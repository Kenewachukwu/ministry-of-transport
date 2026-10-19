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

  it("the gallery and the cover picture's description reach the article, but not the lists", async () => {
    const cms = await facade();
    const article = await cms.getNewsArticle("fg-approves-surveillance-equipment-additional-railway-coaches");
    expect(article?.gallery?.length).toBeGreaterThan(3);
    expect(article?.gallery?.every((p) => p.src.startsWith("/images/") && p.alt.length > 10)).toBe(true);
    expect(article?.imageAlt).toMatch(/crane/i);
    const summaries = await cms.getNewsSummaries("all");
    const listed = summaries.find((n) => n.slug === article?.slug);
    expect(listed).toBeDefined();
    expect("gallery" in (listed as object)).toBe(false);
    expect("body" in (listed as object)).toBe(false);
  });

  it("contact details come from the admin, one by one, with the built-in values as the fallback", async () => {
    const { siteText } = await import("@/db/schema");
    const { siteMeta } = await import("@/content/siteMeta");
    let cms = await facade();
    expect(await cms.getSiteMeta()).toEqual(siteMeta); // nothing saved yet

    await db.insert(siteText).values([
      { key: "contact.phone", value: " +234 9 000 0000 " },
      { key: "contact.email", value: "press@transportation.gov.ng" },
      { key: "social.x", value: "" }, // cleared: hidden
      { key: "social.facebook", value: "https://www.facebook.com/FMoTNigeria" },
    ]);
    cms = await facade();
    const meta = await cms.getSiteMeta();
    expect(meta.phone).toBe("+234 9 000 0000");
    expect(meta.email).toBe("press@transportation.gov.ng");
    expect(meta.address).toBe(siteMeta.address); // untouched keys keep the default
    expect(meta.social.x).toBe("");
    expect(meta.social.facebook).toBe("https://www.facebook.com/FMoTNigeria");
    expect(meta.social.youtube).toBe(siteMeta.social.youtube);
  });

  it("an emptied phone number or required value falls back safely instead of showing nothing", async () => {
    const { siteText } = await import("@/db/schema");
    const { siteMeta } = await import("@/content/siteMeta");
    await db.insert(siteText).values([
      { key: "contact.phone", value: "" },
      { key: "contact.address", value: "" },
    ]);
    const meta = await (await facade()).getSiteMeta();
    expect(meta.phone).toBeNull(); // empty phone means "show none"
    expect(meta.address).toBe(siteMeta.address); // an empty address must never blank the footer
  });

  it("a story with no gallery has none (an empty list in the database is not a gallery)", async () => {
    const cms = await facade();
    const article = await cms.getNewsArticle("dala-inland-dry-port-commissioning");
    expect(article?.gallery).toBeUndefined();
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
