import { requireDatabaseUrl } from "./_env.mjs";
import { createPostgresDb } from "../src/db/drivers/postgres";
import { seedIfEmpty } from "../src/db/seed";
import type { Db } from "../src/db/client";

const db = createPostgresDb(requireDatabaseUrl());
await seedIfEmpty(db as unknown as Db);
console.log("Seed complete (tables that already had rows were left untouched).");
await db.$client.end();
