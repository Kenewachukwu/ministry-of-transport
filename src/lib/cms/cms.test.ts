import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "@/test/db";
import { departments, leadership, newsItems, heroSlides } from "@/db/schema";
import { departments as staticDepartments } from "@/content/departments";
import type { Db } from "@/db/client";

async function facade() {
  vi.resetModules();
  return import("./index");
}

describe("public content layer, database mode", () => {
  let db: Db;
  beforeEach(async () => {
    process.env.CONTENT_SOURCE = "pglite";
    db = await createTestDb({ seed: true });
  });
  afterEach(() => {
    delete process.env.CONTENT_SOURCE;
    delete process.env.NEXT_PHASE;
    vi.doUnmock("@/db/client");
  });

  it("serves published rows in sort order", async () => {
    const cms = await facade();
    const items = await cms.getDepartments();
    expect(items).toHaveLength(staticDepartments.length);
    expect(items[0].id).toBe(staticDepartments[0].id);
  });

  it("never serves archived content", async () => {
    await db.update(departments).set({ status: "archived" }).where(eq(departments.slug, "procurement"));
    await db.update(heroSlides).set({ status: "archived" }).where(eq(heroSlides.eyebrow, "Our Vision"));
    const cms = await facade();
    expect((await cms.getDepartments()).map((d) => d.id)).not.toContain("procurement");
    expect(await cms.getDepartmentBySlug("procurement")).toBeUndefined();
    expect((await cms.getHeroSlides()).map((s) => s.eyebrow)).not.toContain("Our Vision");
  });

  it("an archived article disappears from lists and from its own URL lookup", async () => {
    const cms = await facade();
    const [first] = await cms.getNewsSummaries("all");
    await db.update(newsItems).set({ status: "archived" }).where(eq(newsItems.slug, first.slug));
    expect((await cms.getNewsSummaries("all")).map((n) => n.slug)).not.toContain(first.slug);
    expect(await cms.getNewsArticle(first.slug)).toBeUndefined();
    expect(await cms.listNewsSlugs()).not.toContain(first.slug);
  });

  it("splits news by kind and keeps events out of the news lists", async () => {
    const cms = await facade();
    const photo = await cms.getNewsSummaries("photo");
    const online = await cms.getNewsSummaries("online");
    expect(photo.every((n) => n.category === "Photo News")).toBe(true);
    expect(online.every((n) => n.category !== "Photo News")).toBe(true);
    expect((await cms.getNewsSummaries("all")).length).toBe(photo.length + online.length);
    expect((await cms.getEvents()).length).toBeGreaterThan(0);
  });

  it("list items carry no article body", async () => {
    const cms = await facade();
    const [summary] = await cms.getNewsSummaries("all");
    expect("body" in summary).toBe(false);
    const article = await cms.getNewsArticle(summary.slug);
    expect(article?.body.length).toBeGreaterThan(0);
  });

  it("derives placeholder status from a missing name and hides internal notes' effect on cards", async () => {
    const cms = await facade();
    const minister = await cms.getLeadershipById("minister");
    expect(minister?.name).toBeNull();
    expect(minister?.isPlaceholder).toBe(true);
    await db.update(leadership).set({ name: "Hon. Example" }).where(eq(leadership.slug, "minister"));
    expect((await cms.getLeadershipById("minister"))?.isPlaceholder).toBe(false);
  });

  it("derives the department count in the headline stats", async () => {
    await db.update(departments).set({ status: "archived" }).where(eq(departments.slug, "procurement"));
    const cms = await facade();
    const stats = await cms.getStats();
    expect(stats.find((s) => s.id === "departments")?.value).toBe(staticDepartments.length - 1);
  });

  it("serves the FCSSIP page as ordered blocks", async () => {
    const cms = await facade();
    const page = await cms.getFcssip();
    expect(page.title).toBe("FCSSIP 25");
    expect(page.blocks[0].type).toBe("paragraph");
    expect(page.blocks.some((b) => b.type === "link")).toBe(true);
  });
});

describe("pre-rendering lists", () => {
  afterEach(() => {
    delete process.env.CONTENT_SOURCE;
  });

  it("are empty for the embedded dev database (only one process may open it)", async () => {
    process.env.CONTENT_SOURCE = "pglite";
    await createTestDb({ seed: true });
    const cms = await facade();
    expect(await cms.listDepartmentSlugs()).toEqual([]);
    expect(await cms.listLeadershipIds()).toEqual([]);
    expect(await cms.listNewsSlugs()).toEqual([]);
  });

  it("list every published page for a real database or the static content", async () => {
    process.env.CONTENT_SOURCE = "static";
    const cms = await facade();
    expect((await cms.listDepartmentSlugs()).length).toBe(staticDepartments.length);
    expect((await cms.listLeadershipIds())).toContain("minister");
  });
});

describe("fallback to static content", () => {
  afterEach(() => {
    delete process.env.CONTENT_SOURCE;
    delete process.env.NEXT_PHASE;
    vi.doUnmock("@/db/client");
  });

  it("serves the content files while the database is empty (not yet seeded)", async () => {
    process.env.CONTENT_SOURCE = "pglite";
    await createTestDb({ seed: false });
    const cms = await facade();
    expect(await cms.getDepartments()).toHaveLength(staticDepartments.length);
  });

  it("falls back to static content if the database is down during `next build`", async () => {
    process.env.CONTENT_SOURCE = "postgres";
    process.env.NEXT_PHASE = "phase-production-build";
    vi.doMock("@/db/client", () => ({ getDb: () => Promise.reject(new Error("db down")) }));
    const cms = await facade();
    expect(await cms.getDepartments()).toHaveLength(staticDepartments.length);
  });

  it("throws if the database is down at RUNTIME (so Next keeps the last good page)", async () => {
    process.env.CONTENT_SOURCE = "postgres";
    vi.doMock("@/db/client", () => ({ getDb: () => Promise.reject(new Error("db down")) }));
    const cms = await facade();
    await expect(cms.getDepartments()).rejects.toThrow("db down");
  });
});
