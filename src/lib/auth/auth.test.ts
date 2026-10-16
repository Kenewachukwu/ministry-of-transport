import { beforeEach, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";
import { createTestDb } from "@/test/db";
import type { Db } from "@/db/client";
import { authTokens, rateLimits, users } from "@/db/schema";
import { assertCan, can, ForbiddenError, SECTIONS } from "./permissions";
import { hashPassword, passwordProblem, verifyPassword } from "./password";
import { consumeToken, hashToken, issueToken, peekToken } from "./tokens";
import { hitRateLimit } from "./rate-limit";
import { signSessionToken, verifySessionToken } from "./token";
import { archiveUser, createInvitedUser, setPassword, updateUserAccess, UserError } from "./users";

const actor = { id: null, label: "test" };

describe("permissions", () => {
  it("a super administrator can manage every section", () => {
    for (const s of SECTIONS) expect(can({ role: "super_admin", permissions: [] }, s)).toBe(true);
  });
  it("staff can manage only the sections they were granted", () => {
    const staff = { role: "staff" as const, permissions: ["news" as const] };
    expect(can(staff, "news")).toBe(true);
    expect(can(staff, "departments")).toBe(false);
    expect(() => assertCan(staff, "leadership")).toThrow(ForbiddenError);
  });
});

describe("passwords", () => {
  it("enforces length limits", () => {
    expect(passwordProblem("short")).toMatch(/at least 12/);
    expect(passwordProblem("x".repeat(129))).toMatch(/at most 128/);
    expect(passwordProblem("a perfectly fine passphrase")).toBeNull();
  });
  it("hashes with argon2id and verifies", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash.startsWith("$argon2id$")).toBe(true);
    expect(await verifyPassword(hash, "correct horse battery staple")).toBe(true);
    expect(await verifyPassword(hash, "wrong password entirely")).toBe(false);
    expect(await verifyPassword("not-a-hash", "anything")).toBe(false);
  });
});

describe("session cookie", () => {
  const secret = new TextEncoder().encode("a-test-secret-that-is-at-least-32-chars-long");
  const future = new Date(Date.now() + 60_000);

  it("round-trips a session id", async () => {
    const token = await signSessionToken("sid-1", future, secret);
    expect(await verifySessionToken(token, secret)).toBe("sid-1");
  });
  it("rejects a tampered token", async () => {
    const token = await signSessionToken("sid-1", future, secret);
    const [h, p, s] = token.split(".");
    const forged = `${h}.${Buffer.from(JSON.stringify({ sid: "sid-2" })).toString("base64url")}.${s}`;
    expect(await verifySessionToken(forged, secret)).toBeNull();
    expect(await verifySessionToken(`${h}.${p}.AAAA`, secret)).toBeNull();
  });
  it("rejects a token signed with another key, or expired", async () => {
    const other = new TextEncoder().encode("a-different-secret-that-is-also-32-chars!!");
    expect(await verifySessionToken(await signSessionToken("s", future, other), secret)).toBeNull();
    expect(await verifySessionToken(await signSessionToken("s", new Date(Date.now() - 60_000), secret), secret)).toBeNull();
  });
  it("is disabled when no secret is configured", async () => {
    expect(await verifySessionToken(await signSessionToken("s", future, secret), null as never)).toBeNull();
  });
});

describe("one-time tokens", () => {
  let db: Db;
  let userId: string;
  beforeEach(async () => {
    db = await createTestDb();
    ({ user: { id: userId } } = await createInvitedUser({ email: "a@example.gov.ng", name: "A", role: "staff", permissions: ["news"] }, actor, db));
  });

  it("stores only a hash, never the raw token", async () => {
    const raw = await issueToken(userId, "reset", undefined, db);
    const rows = await db.select().from(authTokens).where(eq(authTokens.purpose, "reset"));
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).toBe(hashToken(raw));
    expect(JSON.stringify(rows)).not.toContain(raw);
  });
  it("can be consumed once and only once", async () => {
    const raw = await issueToken(userId, "reset", undefined, db);
    expect(await consumeToken(raw, "reset")).toBe(userId);
    expect(await consumeToken(raw, "reset")).toBeNull();
  });
  it("peeking never consumes it (mail scanners open links)", async () => {
    const raw = await issueToken(userId, "reset", undefined, db);
    expect(await peekToken(raw, "reset")).toBe(userId);
    expect(await peekToken(raw, "reset")).toBe(userId);
    expect(await consumeToken(raw, "reset")).toBe(userId);
    expect(await peekToken(raw, "reset")).toBeNull();
  });
  it("is bound to its purpose", async () => {
    const raw = await issueToken(userId, "reset", undefined, db);
    expect(await peekToken(raw, "invite")).toBeNull();
    expect(await consumeToken(raw, "invite")).toBeNull();
  });
  it("expires", async () => {
    const raw = await issueToken(userId, "reset", undefined, db);
    await db.update(authTokens).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(authTokens.tokenHash, hashToken(raw)));
    expect(await peekToken(raw, "reset")).toBeNull();
    expect(await consumeToken(raw, "reset")).toBeNull();
  });
  it("issuing a new token voids the previous one", async () => {
    const first = await issueToken(userId, "reset", undefined, db);
    const second = await issueToken(userId, "reset", undefined, db);
    expect(await consumeToken(first, "reset")).toBeNull();
    expect(await consumeToken(second, "reset")).toBe(userId);
  });
  it("an unknown token is rejected", async () => {
    expect(await consumeToken("nonsense", "reset")).toBeNull();
  });
});

describe("rate limiting", () => {
  beforeEach(async () => {
    await createTestDb();
  });
  it("blocks only after the limit is exceeded", async () => {
    for (let i = 0; i < 3; i++) expect(await hitRateLimit("login:x", 3, 60)).toBe(false);
    expect(await hitRateLimit("login:x", 3, 60)).toBe(true);
    expect(await hitRateLimit("login:other", 3, 60)).toBe(false);
  });
  it("opens a fresh window once the old one has expired", async () => {
    const db = await createTestDb();
    for (let i = 0; i < 4; i++) await hitRateLimit("k", 3, 60);
    await db.update(rateLimits).set({ windowStart: sql`now() - interval '2 minutes'` }).where(eq(rateLimits.key, "k"));
    expect(await hitRateLimit("k", 3, 60)).toBe(false);
  });
});

describe("user safeguards", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb();
  });

  it("rejects a duplicate active account, case-insensitively", async () => {
    const { user } = await createInvitedUser({ email: "Boss@Example.gov.ng", name: "Boss", role: "super_admin", permissions: [] }, actor, db);
    await setPassword(user.id, "a long enough password!", db);
    await expect(createInvitedUser({ email: "boss@example.gov.ng", name: "Boss", role: "staff", permissions: [] }, actor, db)).rejects.toThrow(UserError);
  });

  it("super administrators carry no section grants", async () => {
    const { user } = await createInvitedUser({ email: "s@example.gov.ng", name: "S", role: "super_admin", permissions: ["news"] }, actor, db);
    expect(user.permissions).toEqual([]);
  });

  it("the last active super administrator cannot be deactivated or demoted", async () => {
    const { user: boss } = await createInvitedUser({ email: "boss@example.gov.ng", name: "Boss", role: "super_admin", permissions: [] }, actor, db);
    await setPassword(boss.id, "a long enough password!", db);
    const { user: other } = await createInvitedUser({ email: "o@example.gov.ng", name: "O", role: "staff", permissions: [] }, actor, db);
    await setPassword(other.id, "another long password!!", db);
    await expect(updateUserAccess(boss.id, { name: "Boss", role: "staff", permissions: [] }, actor)).rejects.toThrow(/at least one active super administrator/);
    await expect(archiveUser(boss.id, { id: other.id, label: "o" })).rejects.toThrow(/at least one active super administrator/);
  });

  it("nobody can deactivate their own account", async () => {
    const { user } = await createInvitedUser({ email: "x@example.gov.ng", name: "X", role: "staff", permissions: [] }, actor, db);
    await expect(archiveUser(user.id, { id: user.id, label: "x" })).rejects.toThrow(/own account/);
  });

  it("deactivating a user archives rather than deletes", async () => {
    const { user: boss } = await createInvitedUser({ email: "boss@example.gov.ng", name: "Boss", role: "super_admin", permissions: [] }, actor, db);
    await setPassword(boss.id, "a long enough password!", db);
    const { user } = await createInvitedUser({ email: "y@example.gov.ng", name: "Y", role: "staff", permissions: ["news"] }, actor, db);
    await archiveUser(user.id, { id: boss.id, label: "boss" });
    const [row] = await db.select().from(users).where(eq(users.id, user.id));
    expect(row.status).toBe("archived");
  });
});
