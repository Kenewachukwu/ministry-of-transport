import { describe, expect, it } from "vitest";
import { createTestDb } from "@/test/db";
import { __setPendingDb, __setTestDb } from "@/db/client";
import { ensureBootstrapAdmin, bootstrapLocalAdminIfEmpty } from "./bootstrap";
import { findUserByEmail, setPassword } from "./users";

const withTimeout = <T,>(p: Promise<T>, ms = 5000) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timed out: probable self-deadlock")), ms))]);

describe("first administrator bootstrap", () => {
  it("creates a super administrator and returns a one-time link", async () => {
    const db = await createTestDb();
    const result = await ensureBootstrapAdmin("first@example.gov.ng", "First Admin", db);
    expect(result.created).toBe(true);
    expect(result.link).toMatch(/\/admin\/accept-invite\/[A-Za-z0-9_-]{20,}$/);
    const user = await findUserByEmail("first@example.gov.ng", db);
    expect(user?.role).toBe("super_admin");
    expect(user?.status).toBe("invited");
  });

  it("issues a fresh link for someone who has not signed in yet, and does nothing for an active account", async () => {
    const db = await createTestDb();
    const first = await ensureBootstrapAdmin("a@example.gov.ng", "A", db);
    const second = await ensureBootstrapAdmin("a@example.gov.ng", "A", db);
    expect(second.created).toBe(false);
    expect(second.link).not.toBe(first.link);
    const user = await findUserByEmail("a@example.gov.ng", db);
    await setPassword(user!.id, "a long enough password!", db);
    expect(await ensureBootstrapAdmin("a@example.gov.ng", "A", db)).toEqual({ link: null, created: false });
  });

  // Regression: it once called getDb() while getDb() was itself still creating the database, and waited on itself forever.
  it("does not wait on the database while it is still being created", async () => {
    const db = await createTestDb();
    __setPendingDb();
    try {
      await withTimeout(bootstrapLocalAdminIfEmpty(db));
    } finally {
      __setTestDb(db);
    }
    expect(await findUserByEmail("admin@localhost.test", db)).toBeTruthy();
  });
});
