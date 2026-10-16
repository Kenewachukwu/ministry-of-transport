import "server-only";
import { getDb, type Db } from "@/db/client";
import { auditLog } from "@/db/schema";

export interface AuditActor {
  id: string | null;
  label: string;
}

/** Appends to the audit trail. Never pass secrets, tokens or whole content bodies. */
export async function audit(
  actor: AuditActor,
  action: string,
  details: { entity?: string; entityId?: string; summary?: string; meta?: Record<string, unknown> } = {},
  database?: Db
): Promise<void> {
  // `database` is passed while the database is still being created (bootstrap), when getDb() would wait on itself.
  const db = database ?? (await getDb());
  await db.insert(auditLog).values({
    actorId: actor.id,
    actorLabel: actor.label,
    action,
    entity: details.entity ?? null,
    entityId: details.entityId ?? null,
    summary: details.summary ?? null,
    meta: details.meta ?? null,
  });
}

export const SYSTEM_ACTOR: AuditActor = { id: null, label: "system" };
