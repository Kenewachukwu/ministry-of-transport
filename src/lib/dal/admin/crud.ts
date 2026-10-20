import "server-only";
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { audit } from "@/lib/auth/audit";
import { assertCan, assertCanPublish, canPublish, type SessionUser } from "@/lib/auth/permissions";
import type { EntityDef, Row } from "@/lib/admin/registry";
import type { FieldValues } from "@/lib/admin/fields";
import { effectiveRow, workflowState } from "@/lib/admin/workflow";
import { ConflictError, ContentError } from "./errors";

export { effectiveRow, workflowState, type WorkflowState } from "@/lib/admin/workflow";

/**
 * Generic content operations, driven by an EntityDef. Rules that apply to ALL
 * content live here, in one place:
 *  - every function checks the caller's permission for the section itself;
 *  - content is ARCHIVED, never deleted — there is deliberately no delete here;
 *  - what reaches the website depends on the grant: someone who may EDIT but not
 *    PUBLISH creates drafts and proposes changes to live items, and a publisher
 *    approves them. Only `published` rows are ever read by the public site;
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

export type ListStatus = "published" | "archived" | "all" | "drafts" | "waiting";

/**
 * The tabs of a list. Published = on the website now (a live item with changes
 * proposed stays here, flagged). Drafts = new items being written, and proposed
 * changes still being written. Waiting = submitted for a publisher's decision.
 */
function statusCondition(c: Cols, status: ListStatus): SQL | undefined {
  switch (status) {
    case "all":
      return undefined;
    case "drafts":
      return or(eq(c.status, "draft"), and(eq(c.status, "published"), eq(c.pendingState, "draft")));
    case "waiting":
      return or(eq(c.status, "pending"), and(eq(c.status, "published"), eq(c.pendingState, "submitted")));
    default:
      return eq(c.status, status);
  }
}

/** Case-insensitive partial match of the typed words in any of the section's search columns. */
function searchCondition(def: EntityDef, c: Cols, q: string | undefined): SQL | undefined {
  const term = q?.trim().replace(/[\\%_]/g, "");
  if (!term) return undefined;
  const names = (def.searchColumns ?? [def.titleColumn]).filter((n) => c[n]);
  if (names.length === 0) return undefined;
  return or(...names.map((n) => ilike(sql`${c[n]}::text`, `%${term}%`)));
}

export async function listRows(
  def: EntityDef,
  user: SessionUser,
  options: { status?: ListStatus; filter?: string; q?: string } = {}
): Promise<Row[]> {
  assertCan(user, def.section);
  const c = cols(def);
  const db = await getDb();
  const status = options.status ?? "published";
  const conditions = [
    statusCondition(c, status),
    options.filter && def.filter ? eq(c[def.filter.column], options.filter) : undefined,
    searchCondition(def, c, options.q),
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

const clearProposal = {
  pendingValues: null,
  pendingState: null,
  pendingBy: null,
  pendingAt: null,
} as const;

export async function createRow(def: EntityDef, user: SessionUser, values: FieldValues): Promise<string> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);
  // Someone who may edit but not publish starts a DRAFT: nothing reaches the website until a publisher approves it.
  const publishNow = canPublish(user, def.section);

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
      .values({ ...def.createDefaults, ...row, status: publishNow ? "published" : "draft", ...(sortOrder !== undefined ? { sortOrder } : {}), createdBy: user.id, updatedBy: user.id } as never)
      .returning({ id: c.id })) as { id: string }[];
    return created.id;
  });

  await audit(actorOf(user), publishNow ? `${def.key}.create` : `${def.key}.draft`, {
    entity: def.key,
    entityId: id,
    summary: `${publishNow ? "Created" : "Started a draft of"} ${def.singular} “${rowTitle(def, { ...row, ...values })}”`,
  });
  return id;
}

/**
 * Saves edits. What happens depends on the item and the person:
 *  - a draft (never published): the draft itself changes; editing a submitted one withdraws it;
 *  - a live item, by a publisher: goes live at once (and supersedes any proposal);
 *  - a live item, by an editor: stored as a PROPOSAL, the live version is untouched.
 */
export async function updateRow(def: EntityDef, user: SessionUser, id: string, expectedVersion: number, values: FieldValues): Promise<"live" | "proposed" | "draft"> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);
  const row = def.toRow ? def.toRow(values) : values;

  const [current] = (await db.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
  if (!current) throw new ContentError("That item no longer exists.");
  if (Number(current.version) !== expectedVersion) throw new ConflictError();

  const title = rowTitle(def, { ...row, ...values });
  const state = workflowState(current);

  // A live item edited by someone who cannot publish: keep the proposal beside it.
  if (current.status === "published" && !canPublish(user, def.section)) {
    await db
      .update(def.table)
      .set({ pendingValues: row, pendingState: "draft", pendingBy: user.id, pendingAt: new Date(), reviewNote: null, updatedAt: new Date() } as never)
      .where(whereFor(def, eq(c.id, id), eq(c.version, expectedVersion)));
    await audit(actorOf(user), `${def.key}.propose`, { entity: def.key, entityId: id, summary: `Proposed changes to ${def.singular} “${title}”` });
    return "proposed";
  }

  const draftLike = current.status === "draft" || current.status === "pending";
  const [updated] = await db
    .update(def.table)
    .set({
      ...row,
      ...(current.status === "published" ? clearProposal : {}),
      ...(current.status === "published" ? { reviewNote: null } : {}),
      // editing a submitted draft takes it back out of the queue
      ...(current.status === "pending" ? { status: "draft" } : {}),
      version: sql`${c.version} + 1`,
      updatedAt: new Date(),
      updatedBy: user.id,
    } as never)
    .where(whereFor(def, eq(c.id, id), eq(c.version, expectedVersion)))
    .returning({ id: c.id });
  if (!updated) throw new ConflictError(); // the version moved on between the read and the write

  await audit(actorOf(user), `${def.key}.update`, {
    entity: def.key,
    entityId: id,
    summary: `${draftLike ? "Edited draft of" : state === "archived" ? "Edited archived" : "Edited"} ${def.singular} “${title}”`,
  });
  return draftLike ? "draft" : "live";
}

/** Archive, restore and re-order change what the website shows, so they need the publish grant. */
export async function archiveRow(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCanPublish(user, def.section);
  const db = await getDb();
  const c = cols(def);

  const title = await db.transaction(async (tx) => {
    const [current] = (await tx.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
    if (!current) throw new ContentError("That item no longer exists.");
    if (current.status === "archived") return rowTitle(def, current);

    if (def.minPublished && current.status === "published") {
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
  assertCanPublish(user, def.section);
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
  assertCanPublish(user, def.section);
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

export async function countByStatus(
  def: EntityDef,
  user: SessionUser
): Promise<{ published: number; archived: number; drafts: number; waiting: number }> {
  assertCan(user, def.section);
  const c = cols(def);
  const db = await getDb();
  const count = async (status: ListStatus) => {
    const [r] = (await db.select({ n: sql<number>`count(*)::int` }).from(def.table).where(whereFor(def, statusCondition(c, status)))) as { n: number }[];
    return r?.n ?? 0;
  };
  const [published, archived, drafts, waiting] = await Promise.all([count("published"), count("archived"), count("drafts"), count("waiting")]);
  return { published, archived, drafts, waiting };
}

/* ---------- approval workflow ------------------------------------------------------------------- */

/** Anyone who may edit can send their own work for approval. Draft -> waiting; proposed changes -> submitted. */
export async function submitForApproval(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);
  const [current] = (await db.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
  if (!current) throw new ContentError("That item no longer exists.");
  const state = workflowState(current);

  if (state === "draft") {
    await db.update(def.table).set({ status: "pending", pendingBy: user.id, pendingAt: new Date(), reviewNote: null, updatedAt: new Date() } as never).where(whereFor(def, eq(c.id, id)));
  } else if (state === "changes-draft") {
    await db.update(def.table).set({ pendingState: "submitted", pendingBy: user.id, pendingAt: new Date(), reviewNote: null, updatedAt: new Date() } as never).where(whereFor(def, eq(c.id, id)));
  } else if (state === "waiting" || state === "changes-waiting") {
    return; // already in the queue
  } else {
    throw new ContentError("There is nothing to submit: this item has no draft or proposed changes.");
  }
  await audit(actorOf(user), `${def.key}.submit`, { entity: def.key, entityId: id, summary: `Submitted ${def.singular} “${rowTitle(def, effectiveRow(current))}” for approval` });
}

/**
 * A publisher approves: a new item goes live, or proposed changes replace the live
 * values. A publisher may also publish a draft directly, and approve their own work.
 */
export async function approveRow(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCanPublish(user, def.section);
  const db = await getDb();
  const c = cols(def);

  const title = await db.transaction(async (tx) => {
    const [current] = (await tx.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
    if (!current) throw new ContentError("That item no longer exists.");
    const state = workflowState(current);
    const review = { reviewedBy: user.id, reviewedAt: new Date(), reviewNote: null, updatedAt: new Date(), updatedBy: user.id };

    if (state === "draft" || state === "waiting") {
      const sortOrder = def.orderable ? await nextSortOrder(def, tx as unknown as typeof db) : undefined;
      await tx
        .update(def.table)
        .set({ status: "published", ...clearProposal, ...review, ...(sortOrder !== undefined ? { sortOrder } : {}), version: sql`${c.version} + 1` } as never)
        .where(whereFor(def, eq(c.id, id)));
      return rowTitle(def, current);
    }
    if (state === "changes-draft" || state === "changes-waiting") {
      const proposed = (current.pendingValues ?? {}) as Row;
      await tx
        .update(def.table)
        .set({ ...proposed, ...clearProposal, ...review, version: sql`${c.version} + 1` } as never)
        .where(whereFor(def, eq(c.id, id)));
      return rowTitle(def, { ...current, ...proposed });
    }
    throw new ContentError("There is nothing waiting for approval on this item.");
  });
  await audit(actorOf(user), `${def.key}.approve`, { entity: def.key, entityId: id, summary: `Approved and published ${def.singular} “${title}”` });
}

/** A publisher sends work back to its author with a reason. The author sees the note and can fix and resubmit. */
export async function returnRow(def: EntityDef, user: SessionUser, id: string, note: string): Promise<void> {
  assertCanPublish(user, def.section);
  const reason = note.trim();
  if (reason.length < 3) throw new ContentError("Say what needs to change, so the author knows what to fix.");
  const db = await getDb();
  const c = cols(def);
  const [current] = (await db.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
  if (!current) throw new ContentError("That item no longer exists.");
  const state = workflowState(current);
  const review = { reviewNote: reason.slice(0, 1000), reviewedBy: user.id, reviewedAt: new Date(), updatedAt: new Date() };

  if (state === "waiting") await db.update(def.table).set({ status: "draft", ...review } as never).where(whereFor(def, eq(c.id, id)));
  else if (state === "changes-waiting") await db.update(def.table).set({ pendingState: "draft", ...review } as never).where(whereFor(def, eq(c.id, id)));
  else throw new ContentError("This item is not waiting for approval.");
  await audit(actorOf(user), `${def.key}.return`, { entity: def.key, entityId: id, summary: `Sent ${def.singular} “${rowTitle(def, effectiveRow(current))}” back for changes`, meta: { note: reason.slice(0, 300) } });
}

/**
 * Drops proposed changes to a live item (the website never changed), or archives a
 * draft that was never published. Nothing is deleted.
 */
export async function discardChanges(def: EntityDef, user: SessionUser, id: string): Promise<void> {
  assertCan(user, def.section);
  const db = await getDb();
  const c = cols(def);
  const [current] = (await db.select().from(def.table).where(whereFor(def, eq(c.id, id))).limit(1)) as Row[];
  if (!current) throw new ContentError("That item no longer exists.");
  const state = workflowState(current);

  if (state === "changes-draft" || state === "changes-waiting") {
    await db.update(def.table).set({ ...clearProposal, reviewNote: null, updatedAt: new Date() } as never).where(whereFor(def, eq(c.id, id)));
  } else if (state === "draft" || state === "waiting") {
    await db
      .update(def.table)
      .set({ status: "archived", archivedAt: new Date(), archivedBy: user.id, ...clearProposal, version: sql`${c.version} + 1`, updatedAt: new Date(), updatedBy: user.id } as never)
      .where(whereFor(def, eq(c.id, id)));
  } else {
    throw new ContentError("There is nothing to discard on this item.");
  }
  await audit(actorOf(user), `${def.key}.discard`, { entity: def.key, entityId: id, summary: `Discarded the draft of ${def.singular} “${rowTitle(def, effectiveRow(current))}”` });
}

/** Everything waiting for a decision in the sections this person can publish in, oldest first. */
export async function listWaiting(user: SessionUser, entities: EntityDef[]): Promise<{ def: EntityDef; row: Row }[]> {
  const out: { def: EntityDef; row: Row }[] = [];
  for (const def of entities) {
    if (!canPublish(user, def.section)) continue;
    for (const row of await listRows(def, user, { status: "waiting" })) out.push({ def, row });
  }
  return out.sort((a, b) => new Date(String(a.row.pendingAt ?? a.row.updatedAt)).getTime() - new Date(String(b.row.pendingAt ?? b.row.updatedAt)).getTime());
}

/** How many items wait for this person's decision (for the badge). */
export async function countWaiting(user: SessionUser, entities: EntityDef[]): Promise<number> {
  const db = await getDb();
  const counts = await Promise.all(
    entities
      .filter((def) => canPublish(user, def.section))
      .map(async (def) => {
        const [r] = (await db.select({ n: sql<number>`count(*)::int` }).from(def.table).where(whereFor(def, statusCondition(cols(def), "waiting")))) as { n: number }[];
        return r?.n ?? 0;
      })
  );
  return counts.reduce((a, b) => a + b, 0);
}

/** Names for the people behind an item's draft, proposal or review, so pages can say who. */
export async function personNames(ids: (string | null | undefined)[]): Promise<Map<string, string>> {
  const wanted = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (wanted.length === 0) return new Map();
  const db = await getDb();
  const found = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, wanted));
  return new Map(found.map((u) => [u.id, u.name]));
}
