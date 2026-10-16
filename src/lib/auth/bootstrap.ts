import "server-only";
import { sql } from "drizzle-orm";
import type { Db } from "@/db/client";
import { users } from "@/db/schema";
import { SYSTEM_ACTOR } from "./audit";
import { createInvitedUser, findUserByEmail } from "./users";
import { issueToken } from "./tokens";
import { inviteEmail } from "@/lib/email/templates";

/**
 * Creates the first super administrator, or (if that person exists but has not
 * signed in yet) issues a fresh invitation link. Used by `npm run
 * admin:bootstrap` — which doubles as break-glass recovery, since database
 * credentials are the root of trust — and automatically for the embedded
 * local database.
 */
export async function ensureBootstrapAdmin(
  email: string,
  name: string,
  database?: Db
): Promise<{ link: string | null; created: boolean }> {
  const existing = await findUserByEmail(email, database);
  if (existing?.status === "active") return { link: null, created: false };

  if (existing) {
    const token = await issueToken(existing.id, "invite", undefined, database);
    return { link: inviteEmail(existing.email, existing.name, token).link, created: false };
  }
  const { user, token } = await createInvitedUser({ email, name, role: "super_admin", permissions: [] }, SYSTEM_ACTOR, database);
  return { link: inviteEmail(user.email, user.name, token).link, created: true };
}

/** Local development convenience: on a brand-new embedded database, create an admin and print the link. */
export async function bootstrapLocalAdminIfEmpty(db: Db): Promise<void> {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  if ((row?.n ?? 0) > 0) return;
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@localhost.test";
  const name = process.env.BOOTSTRAP_ADMIN_NAME || "Local Administrator";
  const { link } = await ensureBootstrapAdmin(email, name, db);
  if (link) {
    console.info(`\n──────── LOCAL ADMIN ────────\nCreated ${email}. Set a password here:\n${link}\n─────────────────────────────\n`);
  }
}
