import "server-only";
import { and, eq, ne, sql } from "drizzle-orm";
import { getDb, type Db } from "@/db/client";
import { users } from "@/db/schema";
import { audit, type AuditActor } from "./audit";
import { hashPassword } from "./password";
import { isSection, type Role, type Section } from "./permissions";
import { revokeAllSessions } from "./session";
import { issueToken } from "./tokens";
import { getEmailProvider } from "@/lib/email/provider";
import { inviteEmail, resetEmail } from "@/lib/email/templates";

export type UserRow = typeof users.$inferSelect;

export class UserError extends Error {}

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export async function findUserByEmail(email: string, database?: Db): Promise<UserRow | undefined> {
  const db = database ?? (await getDb());
  const [row] = await db.select().from(users).where(sql`lower(${users.email}) = ${normaliseEmail(email)}`).limit(1);
  return row;
}

async function activeSuperAdminCount(db: Db, excluding?: string): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(users)
    .where(
      and(
        eq(users.role, "super_admin"),
        eq(users.status, "active"),
        excluding ? ne(users.id, excluding) : undefined
      )
    );
  return rows[0]?.n ?? 0;
}

/** Creates an invited account (no password yet) and returns the one-time token. */
export async function createInvitedUser(
  input: { email: string; name: string; role: Role; permissions: Section[] },
  actor: AuditActor,
  database?: Db
): Promise<{ user: UserRow; token: string }> {
  const db = database ?? (await getDb());
  const email = normaliseEmail(input.email);
  const existing = await findUserByEmail(email, db);
  if (existing && existing.status === "active") throw new UserError("That person already has an account.");
  if (existing && existing.status === "archived") throw new UserError("That account is deactivated. Restore it from the Users list instead.");

  const permissions = input.role === "super_admin" ? [] : input.permissions.filter(isSection);
  let user = existing;
  if (!user) {
    [user] = await db.insert(users).values({ email, name: input.name.trim(), role: input.role, permissions, status: "invited" }).returning();
  } else {
    // re-inviting someone whose invitation is still pending: refresh their details
    [user] = await db
      .update(users)
      .set({ name: input.name.trim(), role: input.role, permissions, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
  }
  const token = await issueToken(user.id, "invite", actor.id ?? undefined, db);
  await audit(actor, "user.invite", { entity: "user", entityId: user.id, summary: `Invited ${email}`, meta: { role: input.role, permissions } }, db);
  return { user, token };
}

export interface DeliveryResult {
  /** True when an email was actually sent. */
  sent: boolean;
  /** Present only when no email could be sent: the administrator passes it on by hand. */
  link?: string;
}

async function deliver(message: { to: string; subject: string; text: string; html: string; link: string }, revealLinkIfUnsent: boolean): Promise<DeliveryResult> {
  const provider = getEmailProvider();
  if (provider) {
    try {
      await provider.send(message);
      return { sent: true };
    } catch (error) {
      console.error("[email] delivery failed:", error instanceof Error ? error.message : error);
    }
  }
  return { sent: false, link: revealLinkIfUnsent ? message.link : undefined };
}

export const sendInvite = (user: UserRow, token: string) => deliver(inviteEmail(user.email, user.name, token), true);

/** Password-reset mail. The link is never revealed to the requester: only the mailbox owner sees it. */
export const sendReset = (user: UserRow, token: string) => deliver(resetEmail(user.email, user.name, token), false);

/** Sets the password and activates the account (used by invite acceptance and reset). */
export async function setPassword(userId: string, password: string, database?: Db): Promise<void> {
  const db = database ?? (await getDb());
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), status: "active", updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function updateUserAccess(
  id: string,
  input: { name: string; role: Role; permissions: Section[] },
  actor: AuditActor
): Promise<void> {
  const db = await getDb();
  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new UserError("User not found.");
  if (current.role === "super_admin" && input.role !== "super_admin" && current.status === "active") {
    if ((await activeSuperAdminCount(db, id)) === 0) throw new UserError("There must always be at least one active super administrator.");
  }
  const permissions = input.role === "super_admin" ? [] : input.permissions.filter(isSection);
  await db.update(users).set({ name: input.name.trim(), role: input.role, permissions, updatedAt: new Date() }).where(eq(users.id, id));
  await audit(actor, "user.update", { entity: "user", entityId: id, summary: `Changed access for ${current.email}`, meta: { role: input.role, permissions } });
}

/** Deactivate (the Ministry's "archive, never delete"). Ends all of that person's sessions. */
export async function archiveUser(id: string, actor: AuditActor & { id: string }): Promise<void> {
  const db = await getDb();
  if (id === actor.id) throw new UserError("You can't deactivate your own account.");
  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new UserError("User not found.");
  if (current.role === "super_admin" && current.status === "active" && (await activeSuperAdminCount(db, id)) === 0) {
    throw new UserError("There must always be at least one active super administrator.");
  }
  await db.update(users).set({ status: "archived", updatedAt: new Date() }).where(eq(users.id, id));
  await revokeAllSessions(id);
  await audit(actor, "user.archive", { entity: "user", entityId: id, summary: `Deactivated ${current.email}` });
}

/** Reactivate: returns to "invited" with a fresh invitation if they never set a password, else to "active". */
export async function restoreUser(id: string, actor: AuditActor): Promise<{ token?: string; user: UserRow }> {
  const db = await getDb();
  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new UserError("User not found.");
  const status = current.passwordHash ? "active" : "invited";
  const [user] = await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id)).returning();
  const token = status === "invited" ? await issueToken(id, "invite", actor.id ?? undefined, db) : undefined;
  await audit(actor, "user.restore", { entity: "user", entityId: id, summary: `Reactivated ${current.email}` });
  return { token, user };
}
