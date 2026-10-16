import { createPgliteDb } from "@/db/drivers/pglite";
import { migrateDb } from "@/db/migrate";
import { seedIfEmpty } from "@/db/seed";
import { __setTestDb, type Db } from "@/db/client";

/**
 * A fresh in-memory Postgres (PGlite) with the REAL migrations applied, so
 * tests exercise the actual SQL — constraints, enums, atomic updates — rather
 * than a mock of it. Installed as the app's database for the duration of a test.
 */
export async function createTestDb(options: { seed?: boolean } = {}): Promise<Db> {
  const db = (await createPgliteDb()) as unknown as Db;
  await migrateDb(db, "pglite");
  if (options.seed) await seedIfEmpty(db);
  __setTestDb(db);
  return db;
}
