import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema";

/**
 * Production driver (Neon pooled connection string). `prepare: false` because
 * Neon's pooler runs PgBouncer in transaction mode, which doesn't support
 * prepared statements.
 */
export function createPostgresDb(url: string) {
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const client = postgres(url, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    ssl: local ? undefined : "require",
  });
  return drizzle({ client, schema });
}
