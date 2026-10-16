import path from "node:path";
import type { Db } from "./client";

/**
 * Applies the SQL files in ./drizzle. Run by `npm run db:migrate` against the
 * production database, and automatically for the local embedded database.
 */
export async function migrateDb(db: Db, kind: "pglite" | "postgres") {
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if (kind === "pglite") {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    await migrate(db as never, { migrationsFolder });
  } else {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    await migrate(db as never, { migrationsFolder });
  }
}
