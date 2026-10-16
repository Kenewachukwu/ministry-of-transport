import { beforeAll, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { createTestDb } from "@/test/db";
import { seedIfEmpty } from "./seed";
import { appMeta, departments, heroSlides, leadership, newsItems, pageBlocks, pillars, resources, siteText, eServices } from "./schema";
import { departments as deptContent } from "../content/departments";
import { leadership as leaderContent } from "../content/leadership";
import { news as newsContent } from "../content/news";
import { events as eventContent } from "../content/events";
import { documents, nctCommuniques } from "../content/documents";
import { fcssipPage } from "../content/fcssip";
import type { Db } from "./client";

const count = async (db: Db, table: PgTable) =>
  (await db.select({ n: sql<number>`count(*)::int` }).from(table))[0].n;

describe("seed", () => {
  let db: Db;
  beforeAll(async () => {
    db = await createTestDb({ seed: true });
  });

  it("loads every existing content file", async () => {
    expect(await count(db, heroSlides)).toBe(3);
    expect(await count(db, departments)).toBe(deptContent.length);
    expect(await count(db, leadership)).toBe(leaderContent.length);
    expect(await count(db, newsItems)).toBe(newsContent.length + eventContent.length);
    expect(await count(db, resources)).toBe(documents.length + nctCommuniques.length);
    expect(await count(db, pageBlocks)).toBe(fcssipPage.blocks.length);
    expect(await count(db, pillars)).toBeGreaterThan(0);
    expect(await count(db, eServices)).toBeGreaterThan(0);
    expect(await count(db, siteText)).toBe(6);
    const [meta] = await db.select().from(appMeta).where(eq(appMeta.key, "seeded_at"));
    expect(meta).toBeTruthy();
  });

  it("is idempotent: re-running never duplicates or overwrites", async () => {
    await db.update(departments).set({ name: "Edited by the Ministry" }).where(eq(departments.slug, deptContent[0].id));
    await seedIfEmpty(db);
    expect(await count(db, departments)).toBe(deptContent.length);
    const [row] = await db.select().from(departments).where(eq(departments.slug, deptContent[0].id));
    expect(row.name).toBe("Edited by the Ministry");
  });

  it("keeps the Minister as a placeholder", async () => {
    const [minister] = await db.select().from(leadership).where(eq(leadership.slug, "minister"));
    expect(minister.name).toBeNull();
  });
});
