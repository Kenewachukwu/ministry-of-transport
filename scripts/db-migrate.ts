import { requireDatabaseUrl } from "./_env";
import { createPostgresDb } from "../src/db/drivers/postgres";
import { migrateDb } from "../src/db/migrate";
import type { Db } from "../src/db/client";

const db = createPostgresDb(requireDatabaseUrl());
await migrateDb(db as unknown as Db, "postgres");
console.log("Migrations applied.");
await db.$client.end();
