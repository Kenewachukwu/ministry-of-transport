import "server-only";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { contentSource } from "@/lib/env";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export class NoDatabaseError extends Error {
  constructor() {
    super("No database is configured (set DATABASE_URL, or LOCAL_DB=pglite for local development).");
    this.name = "NoDatabaseError";
  }
}

// One connection (or embedded DB) per server process, surviving dev hot reloads.
const g = globalThis as unknown as { __motDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  if (!g.__motDb) {
    g.__motDb = createDb().catch((error) => {
      g.__motDb = undefined; // let the next call retry rather than caching a failure
      throw error;
    });
  }
  return g.__motDb;
}

/** Test hook: use an already-prepared database (in-memory PGlite). */
export function __setTestDb(db: Db | undefined) {
  g.__motDb = db ? Promise.resolve(db) : undefined;
}

/** Test hook: make getDb() behave as if the database is still being created. */
export function __setPendingDb() {
  g.__motDb = new Promise<Db>(() => {});
}

async function createDb(): Promise<Db> {
  const kind = contentSource();

  if (kind === "postgres") {
    const { createPostgresDb } = await import("./drivers/postgres");
    return createPostgresDb(process.env.DATABASE_URL!) as unknown as Db;
  }

  if (kind === "pglite") {
    const { createPgliteDb } = await import("./drivers/pglite");
    const db = (await createPgliteDb(".data/pglite")) as unknown as Db;
    const { migrateDb } = await import("./migrate");
    const { seedIfEmpty } = await import("./seed");
    await migrateDb(db, "pglite");
    await seedIfEmpty(db);
    const { bootstrapLocalAdminIfEmpty } = await import("@/lib/auth/bootstrap");
    await bootstrapLocalAdminIfEmpty(db);
    return db;
  }

  throw new NoDatabaseError();
}
