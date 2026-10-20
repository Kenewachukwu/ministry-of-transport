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
import { emailChangedEmail, inviteEmail, resetEmail } from "@/lib/email/templates";

export type UserRow = typeof users.$inferSelect;

export class UserError extends Error {}

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/**
 * What a person is granted, in one place: a super administrator holds nothing
 * explicitly (they can do everything), and for everyone else publishing in a
 * section always includes editing it.
 */
export function normaliseGrants(role: Role, edit: Section[], publish: Section[] = []): { permissions: Section[]; publishPermissions: Section[] } {
  if (role === "super_admin") return { permissions: [], publishPermissions: [] };
  const publishOnly = publish.filter(isSection);
  const permissions = [...new Set([...edit.filter(isSection), ...publishOnly])];
  return { permissions, publishPermissions: [...new Set(publishOnly)] };
}

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
  input: { email: string; name: string; role: Role; permissions: Section[]; publishPermissions?: Section[] },
  actor: AuditActor,
  database?: Db
): Promise<{ user: UserRow; token: string }> {
  const db = database ?? (await getDb());
  const email = normaliseEmail(input.email);
  const existing = await findUserByEmail(email, db);
  if (existing && existing.status === "active") throw new UserError("That person already has an account.");
  if (existing && existing.status === "archived") throw new UserError("That account is deactivated. Restore it from the Users list instead.");

  const { permissions, publishPermissions } = normaliseGrants(input.role, input.permissions, input.publishPermissions);
  let user = existing;
  if (!user) {
    [user] = await db.insert(users).values({ email, name: input.name.trim(), role: input.role, permissions, publishPermissions, status: "invited" }).returning();
  } else {
    // re-inviting someone whose invitation is still pending: refresh their details
    [user] = await db
      .update(users)
      .set({ name: input.name.trim(), role: input.role, permissions, publishPermissions, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
  }
  const token = await issueToken(user.id, "invite", actor.id ?? undefined, db);
  await audit(actor, "user.invite", { entity: "user", entityId: user.id, summary: `Invited ${email}`, meta: { role: input.role, permissions, publishPermissions } }, db);
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
  input: { name: string; role: Role; permissions: Section[]; publishPermissions?: Section[] },
  actor: AuditActor
): Promise<void> {
  const db = await getDb();
  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new UserError("User not found.");
  if (current.role === "super_admin" && input.role !== "super_admin" && current.status === "active") {
    if ((await activeSuperAdminCount(db, id)) === 0) throw new UserError("There must always be at least one active super administrator.");
  }
  const { permissions, publishPermissions } = normaliseGrants(input.role, input.permissions, input.publishPermissions);
  await db.update(users).set({ name: input.name.trim(), role: input.role, permissions, publishPermissions, updatedAt: new Date() }).where(eq(users.id, id));
  await audit(actor, "user.update", { entity: "user", entityId: id, summary: `Changed access for ${current.email}`, meta: { role: input.role, permissions, publishPermissions } });
}

export interface EmailChangeResult {
  user: UserRow;
  /** For someone who has not activated yet: the new invitation, since the old link went to the old address. */
  invitation?: DeliveryResult;
}

/**
 * Changes someone ELSE's sign-in email. Their password, sessions and history are
 * untouched. Both addresses are told, so a wrong or malicious change is noticed.
 * Someone who has not activated yet gets a fresh invitation at the new address
 * (and the old link stops working). You cannot change your own: a typo would lock
 * you out, and the one person who could fix it is you.
 */
export async function changeUserEmail(id: string, newEmailRaw: string, actor: AuditActor & { id: string }): Promise<EmailChangeResult> {
  const db = await getDb();
  if (id === actor.id) throw new UserError("You can't change your own email address here. Ask another super administrator.");
  const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!current) throw new UserError("User not found.");

  const email = normaliseEmail(newEmailRaw);
  if (email === normaliseEmail(current.email)) throw new UserError("That is already their email address.");
  const taken = await findUserByEmail(email, db);
  if (taken && taken.id !== id) throw new UserError("Another account already uses that email address.");

  const [user] = await db.update(users).set({ email, updatedAt: new Date() }).where(eq(users.id, id)).returning();
  await audit(actor, "user.email_changed", { entity: "user", entityId: id, summary: `Changed sign-in email from ${current.email} to ${email}`, meta: { from: current.email, to: email } });

  if (user.status === "invited") {
    const token = await issueToken(id, "invite", actor.id, db);
    return { user, invitation: await sendInvite(user, token) };
  }
  if (user.status === "active") {
    // Best effort: the change has happened either way.
    await Promise.all([current.email, email].map((to) => deliver(emailChangedEmail(to, user.name, current.email, email), false)));
  }
  return { user };
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
