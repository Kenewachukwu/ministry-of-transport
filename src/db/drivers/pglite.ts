import { mkdirSync } from "node:fs";
import * as schema from "../schema";

/**
 * Embedded Postgres (WASM) for local development and tests. Imported lazily so
 * it is never part of a production bundle. Pass no directory for an in-memory
 * database (tests); otherwise data persists under `.data/pglite`.
 */
export async function createPgliteDb(dataDir?: string) {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  // PGlite creates only the last path segment, so make sure the parents exist.
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  return drizzle({ client, schema });
}
