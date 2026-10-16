import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { sessions, users } from "@/db/schema";
import { SESSION_TTL_SECONDS, sessionCookieName } from "./config";
import { signSessionToken, verifySessionToken } from "./token";
import { isSection, type SessionUser } from "./permissions";

export async function clientInfo(): Promise<{ ip: string | null; userAgent: string | null }> {
  const h = await headers();
  // Vercel overwrites x-forwarded-for, so its first entry is the real client address.
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  return { ip: ip || null, userAgent: h.get("user-agent")?.slice(0, 300) ?? null };
}

/** Creates the session row and sets the cookie. Server Action / Route Handler context only. */
export async function startSession(userId: string): Promise<void> {
  const db = await getDb();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const { ip, userAgent } = await clientInfo();
  const [row] = await db.insert(sessions).values({ userId, expiresAt, ip, userAgent }).returning({ id: sessions.id });
  const token = await signSessionToken(row.id, expiresAt);
  const jar = await cookies();
  jar.set(sessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(sessionCookieName())?.value;
  const sid = token ? await verifySessionToken(token) : null;
  if (sid) {
    const db = await getDb();
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sid));
  }
  jar.delete(sessionCookieName());
}

/** Signs a person out everywhere (password reset, deactivation). */
export async function revokeAllSessions(userId: string): Promise<void> {
  const db = await getDb();
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
}

/**
 * The signed-in user, or null. The cookie only proves WHICH session; this checks
 * that the session is still live (not revoked/expired) and the person still
 * active, and loads their CURRENT role and permissions — so an access change
 * takes effect on the very next request. De-duplicated per render via `cache`.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(sessionCookieName())?.value;
  if (!token) return null;
  const sid = await verifySessionToken(token);
  if (!sid) return null;

  const db = await getDb();
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      permissions: users.permissions,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.id, sid),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, sql`now()`),
        eq(users.status, "active")
      )
    )
    .limit(1);
  if (!row) return null;
  return { ...row, permissions: row.permissions.filter(isSection) };
});
