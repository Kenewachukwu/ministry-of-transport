import { defineConfig } from "drizzle-kit";

/**
 * `npm run db:generate` turns src/db/schema into SQL migrations under
 * ./drizzle (committed). Migrations are APPLIED by src/db/migrate.ts, not by
 * drizzle-kit, so no database connection is needed to generate them.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
});
