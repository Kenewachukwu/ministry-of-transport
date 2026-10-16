import "server-only";
import { and, asc, desc, eq, ilike, inArray, sql, type SQL } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { getDb } from "@/db/client";
import { audit } from "@/lib/auth/audit";
import { assertCan, type SessionUser } from "@/lib/auth/permissions";
import type { EntityDef, Row } from "@/lib/admin/registry";
import type { FieldValues } from "@/lib/admin/fields";
import { ConflictError, ContentError } from "./errors";

/**
 * Generic content operations, driven by an EntityDef. Rules that apply to ALL
 * content live here, in one place:
 *  - every function checks the caller's permission for the section itself;
 *  - content is ARCHIVED, never deleted — there is deliberately no delete here;
 *  - updates are versioned (optimistic concurrency);
 *  - every change is written to the audit log.
 */

type Cols = Record<string, PgColumn>;
const cols = (def: EntityDef) => getTableColumns(def.table) as Cols;
const STEP = 10;
const LIST_LIMIT = 500;

const actorOf = (user: SessionUser) => ({ id: user.id, label: user.email });

function whereFor(def: EntityDef, ...extra: (SQL | undefined)[]): SQL | undefined {
  const c = cols(def);
  return and(def.scope?.(c), ...extra);
}

export function rowTitle(def: EntityDef, row: Row): string {
  return def.title ? def.title(row) : String(row[def.titleColumn] ?? "(untitled)");
}

export async function listRows(
  def: EntityDef,
  user: SessionUser,
  options: { status?: "published" | "archived" | "all"; filter?: string; q?: string } = {}
): Promise<Row[]> {
  assertCan(user, def.section);
  const c = cols(def);
  const db = await getDb();
  const status = options.status ?? "published";
  const conditions = [
    status === "all" ? undefined : eq(c.status, status),
    options.filter && def.filter ? eq(c[def.filter.column], options.filter) : undefined,
    options.q && c[def.titleColumn] && !def.title ? ilike(c[def.titleColumn], `%${options.q.replace(/[%_]/g, "")}%`) : undefined,
  ];
  const order = def.orderable ? [asc(c.sortOrder), asc(c.createdAt)] : [c.itemDate ? desc(c.itemDate) : desc(c.updatedAt), desc(c.createdAt)];
  const rows = (await db
    .select()
    .from(def.table)
    .where(whereFor(def, ...conditions))
    .orderBy(...order)
    .limit(LIST_LIMIT)) as Row[];
  return rows;
}

export async function getRow(def: EntityDef, user: SessionUser, id: string): Promise<Row | undefined> {
  assertCan(user, def.section);
  const c = cols(def);
  const db = await getDb();
  const [row] = (await db.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
  return row;
}

async function nextSortOrder(def: EntityDef, tx: Awaited<ReturnType<typeof getDb>>): Promise<number> {
  const c = cols(def);
  const [row] = (await tx
    .select({ top: sql<number>`coalesce(max(${c.sortOrder}), 0)::int` })
    .from(def.table)
    .where(whereFor(def))) as { top: number }[];
  return (row?.top ?? 0) + STEP;
}

export async function createRow(def: EntityDef, user: SessionUser, values: FieldValues): Promise<string> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);

  const slugExists = async (slug: string) => {
    if (!c.slug) return false;
    const found = await db.select({ id: c.id }).from(def.table).where(eq(c.slug, slug)).limit(1);
    return found.length > 0;
  };
  const prepared = def.prepareCreate ? await def.prepareCreate(values, { slugExists }) : values;
  const row = def.toRow ? def.toRow(prepared) : prepared;

  const id = await db.transaction(async (tx) => {
    const sortOrder = def.orderable ? await nextSortOrder(def, tx as unknown as typeof db) : undefined;
    const [created] = (await tx
      .insert(def.table)
      .values({ ...def.createDefaults, ...row, ...(sortOrder !== undefined ? { sortOrder } : {}), createdBy: user.id, updatedBy: user.id } as never)
      .returning({ id: c.id })) as { id: string }[];
    return created.id;
  });

  await audit(actorOf(user), `${def.key}.create`, { entity: def.key, entityId: id, summary: `Created ${def.singular} “${rowTitle(def, { ...row, ...values })}”` });
  return id;
}

export async function updateRow(def: EntityDef, user: SessionUser, id: string, expectedVersion: number, values: FieldValues): Promise<void> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);
  const row = def.toRow ? def.toRow(values) : values;

  const [updated] = await db
    .update(def.table)
    .set({ ...row, version: sql`${c.version} + 1`, updatedAt: new Date(), updatedBy: user.id } as never)
    .where(whereFor(def, eq(c.id, id), eq(c.version, expectedVersion)))
    .returning({ id: c.id });

  if (!updated) {
    const exists = await db.select({ id: c.id }).from(def.table).where(whereFor(def, eq(c.id, id))).limit(1);
    if (exists.length === 0) throw new ContentError("That item no longer exists.");
    throw new ConflictError(); // it exists, so the version moved on: someone else saved first
  }
  await audit(actorOf(user), `${def.key}.update`, { entity: def.key, entityId: id, summary: `Edited ${def.singular} “${rowTitle(def, { ...row, ...values })}”` });
}

export async function archiveRow(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);

  const title = await db.transaction(async (tx) => {
    const [current] = (await tx.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
    if (!current) throw new ContentError("That item no longer exists.");
    if (current.status === "archived") return rowTitle(def, current);

    if (def.minPublished) {
      const [{ n }] = (await tx
        .select({ n: sql<number>`count(*)::int` })
        .from(def.table)
        .where(whereFor(def, eq(c.status, "published")))) as { n: number }[];
      if (n <= def.minPublished) {
        throw new ContentError(`This is the last published ${def.singular}, so it can't be archived. Add another one first, then archive this.`);
      }
    }
    await tx
      .update(def.table)
      .set({ status: "archived", archivedAt: new Date(), archivedBy: user.id, version: sql`${c.version} + 1`, updatedAt: new Date(), updatedBy: user.id } as never)
      .where(whereFor(def, eq(c.id, id)));
    return rowTitle(def, current);
  });
  await audit(actorOf(user), `${def.key}.archive`, { entity: def.key, entityId: id, summary: `Archived ${def.singular} “${title}”` });
}

export async function restoreRow(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);

  const title = await db.transaction(async (tx) => {
    const [current] = (await tx.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
    if (!current) throw new ContentError("That item no longer exists.");
    if (current.status === "published") return rowTitle(def, current);
    // A restored item rejoins at the END, rather than jumping back into a position others now occupy.
    const sortOrder = def.orderable ? await nextSortOrder(def, tx as unknown as typeof db) : undefined;
    await tx
      .update(def.table)
      .set({
        status: "published",
        archivedAt: null,
        archivedBy: null,
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        version: sql`${c.version} + 1`,
        updatedAt: new Date(),
        updatedBy: user.id,
      } as never)
      .where(whereFor(def, eq(c.id, id)));
    return rowTitle(def, current);
  });
  await audit(actorOf(user), `${def.key}.restore`, { entity: def.key, entityId: id, summary: `Restored ${def.singular} “${title}”` });
}

/**
 * Saves a new display order. `orderedIds` is the order the editor chose for the
 * PUBLISHED rows; ids that aren't published rows are ignored, and any published
 * row they didn't mention keeps its relative position at the end.
 */
export async function reorderRows(def: EntityDef, user: SessionUser, orderedIds: string[]): Promise<void> {
  assertCan(user, def.section);
  if (!def.orderable) throw new ContentError(`${def.plural} can't be re-ordered.`);
  const db = await getDb();
  const c = cols(def);

  await db.transaction(async (tx) => {
    const published = (await tx
      .select({ id: c.id })
      .from(def.table)
      .where(whereFor(def, eq(c.status, "published")))
      .orderBy(asc(c.sortOrder), asc(c.createdAt))) as { id: string }[];
    const known = new Set(published.map((r) => r.id));
    const chosen = orderedIds.filter((id, i) => known.has(id) && orderedIds.indexOf(id) === i);
    const rest = published.map((r) => r.id).filter((id) => !chosen.includes(id));
    const finalOrder = [...chosen, ...rest];
    if (finalOrder.length === 0) return;

    const whens = finalOrder.map((id, i) => sql`when ${c.id} = ${id} then ${(i + 1) * STEP}::int`);
    await tx
      .update(def.table)
      .set({ sortOrder: sql`case ${sql.join(whens, sql` `)} end`, updatedAt: new Date(), updatedBy: user.id } as never)
      .where(and(def.scope?.(c), inArray(c.id, finalOrder)));
  });
  await audit(actorOf(user), `${def.key}.reorder`, { entity: def.key, summary: `Re-ordered ${def.plural.toLowerCase()}` });
}

export async function countByStatus(def: EntityDef, user: SessionUser): Promise<{ published: number; archived: number }> {
  assertCan(user, def.section);
  const c = cols(def);
  const db = await getDb();
  const rows = (await db
    .select({ status: c.status, n: sql<number>`count(*)::int` })
    .from(def.table)
    .where(whereFor(def))
    .groupBy(c.status)) as { status: string; n: number }[];
  return { published: rows.find((r) => r.status === "published")?.n ?? 0, archived: rows.find((r) => r.status === "archived")?.n ?? 0 };
}
