import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";
import { createTestDb } from "@/test/db";
import type { Db } from "@/db/client";
import { auditLog, newsItems, pageBlocks } from "@/db/schema";
import { ENTITIES, getEntity, type Row } from "@/lib/admin/registry";
import { ForbiddenError, type SessionUser } from "@/lib/auth/permissions";
import { isAllowedLink, isAllowedMediaUrl } from "@/lib/storage/validate";
import { archiveRow, createRow, getRow, listRows, reorderRows, restoreRow, updateRow } from "./crud";
import { ConflictError, ContentError } from "./errors";

const admin: SessionUser = { id: "00000000-0000-4000-8000-000000000001", email: "boss@example.gov.ng", name: "Boss", role: "super_admin", permissions: [] };
const newsEditor: SessionUser = { ...admin, id: "00000000-0000-4000-8000-000000000002", email: "n@example.gov.ng", role: "staff", permissions: ["news"] };

const hero = getEntity("hero")!;
const news = getEntity("news")!;
const blocks = getEntity("fcssip")!;

const slide = (n: number) => ({
  eyebrow: `Eyebrow ${n}`,
  headline: `Headline ${n}`,
  body: "Body",
  ctaLabel: "Go",
  ctaHref: "/about",
  imageUrl: "/images/stock/hero-lagos-highway.jpg",
  imageAlt: "A road",
});

describe("content operations", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb({ seed: true });
    // users referenced by createdBy/updatedBy must exist
    const { users } = await import("@/db/schema");
    await db.insert(users).values([
      { id: admin.id, email: admin.email, name: admin.name, role: "super_admin", status: "active" },
      { id: newsEditor.id, email: newsEditor.email, name: newsEditor.name, role: "staff", permissions: ["news"], status: "active" },
    ]);
  });

  const titles = async (def = hero, status: "published" | "archived" = "published") => (await listRows(def, admin, { status })).map((r) => String(r.headline));

  it("checks the caller's permission for the section, in every operation", async () => {
    await expect(createRow(hero, newsEditor, slide(9))).rejects.toThrow(ForbiddenError);
    await expect(listRows(hero, newsEditor)).rejects.toThrow(ForbiddenError);
    const [first] = await listRows(hero, admin);
    await expect(archiveRow(hero, newsEditor, String(first.id))).rejects.toThrow(ForbiddenError);
    await expect(restoreRow(hero, newsEditor, String(first.id))).rejects.toThrow(ForbiddenError);
    await expect(updateRow(hero, newsEditor, String(first.id), 1, slide(1))).rejects.toThrow(ForbiddenError);
    await expect(reorderRows(hero, newsEditor, [String(first.id)])).rejects.toThrow(ForbiddenError);
    // …but the same person can work in the section they were granted
    await expect(createRow(news, newsEditor, { kind: "online_news", title: "Hello", itemDate: "2026-10-01", isPressRelease: false, location: null, excerpt: "x", body: "", imageUrl: null, imageAlt: null, featured: false })).resolves.toBeTruthy();
  });

  it("creates at the end, and records who and when", async () => {
    const id = await createRow(hero, admin, slide(4));
    const all = await listRows(hero, admin);
    expect(String(all[all.length - 1].id)).toBe(id);
    const row = (await getRow(hero, admin, id))!;
    expect(row.createdBy).toBe(admin.id);
    expect(row.version).toBe(1);
  });

  it("rejects a stale save instead of overwriting someone else's edit", async () => {
    const [first] = await listRows(hero, admin);
    const id = String(first.id);
    await updateRow(hero, admin, id, 1, { ...slide(1), headline: "Edited first" });
    expect(Number((await getRow(hero, admin, id))!.version)).toBe(2);
    await expect(updateRow(hero, admin, id, 1, { ...slide(1), headline: "Stale edit" })).rejects.toThrow(ConflictError);
    expect((await getRow(hero, admin, id))!.headline).toBe("Edited first");
  });

  it("archives instead of deleting, and restores to the end", async () => {
    const before = await listRows(hero, admin);
    const target = String(before[0].id);
    await archiveRow(hero, admin, target);
    expect((await titles()).length).toBe(before.length - 1);
    expect((await titles(hero, "archived")).length).toBe(1);
    expect((await getRow(hero, admin, target))!.status).toBe("archived"); // the row still exists
    await restoreRow(hero, admin, target);
    const after = await listRows(hero, admin);
    expect(String(after[after.length - 1].id)).toBe(target);
  });

  it("never lets the last published hero slide be archived", async () => {
    const rows = await listRows(hero, admin);
    for (const r of rows.slice(1)) await archiveRow(hero, admin, String(r.id));
    await expect(archiveRow(hero, admin, String(rows[0].id))).rejects.toThrow(ContentError);
    await createRow(hero, admin, slide(7));
    await expect(archiveRow(hero, admin, String(rows[0].id))).resolves.toBeUndefined();
  });

  it("re-orders published rows, ignoring unknown and archived ids", async () => {
    const [a, b, c] = (await listRows(hero, admin)).map((r) => String(r.id));
    await archiveRow(hero, admin, b);
    await reorderRows(hero, admin, [c, "not-a-real-id", b, a]);
    expect((await listRows(hero, admin)).map((r) => String(r.id))).toEqual([c, a]);
  });

  it("creates unique slugs for items with the same title", async () => {
    const v = { kind: "online_news", title: "Same Title", itemDate: "2026-10-01", isPressRelease: false, location: null, excerpt: "x", body: "", imageUrl: null, imageAlt: null, featured: false };
    const one = await createRow(news, admin, v);
    const two = await createRow(news, admin, v);
    const [r1, r2] = await Promise.all([getRow(news, admin, one), getRow(news, admin, two)]);
    expect(r1!.slug).toBe("same-title");
    expect(r2!.slug).toBe("same-title-2");
  });

  it("keeps FCSSIP blocks scoped to their page and shapes their data", async () => {
    const id = await createRow(blocks, admin, { type: "link", text: "", label: "Example", href: "https://example.gov.ng", src: "", alt: "", caption: "", width: "", height: "", size: "full" });
    const row = (await getRow(blocks, admin, id))!;
    expect(row.page).toBe("fcssip");
    expect(row.data).toEqual({ label: "Example", href: "https://example.gov.ng" });
    // a block of another page is invisible to this editor
    await db.insert(pageBlocks).values({ page: "other", type: "paragraph", data: { text: "x" }, sortOrder: 1 });
    expect((await listRows(blocks, admin, { status: "all" })).every((r) => r.page === "fcssip")).toBe(true);
  });

  it("writes every change to the audit log", async () => {
    const id = await createRow(hero, admin, slide(5));
    await updateRow(hero, admin, id, 1, slide(5));
    await archiveRow(hero, admin, id);
    await restoreRow(hero, admin, id);
    const actions = (await db.select().from(auditLog).where(and(eq(auditLog.entity, "hero")))).map((r) => r.action);
    expect(actions).toEqual(expect.arrayContaining(["hero.create", "hero.update", "hero.archive", "hero.restore"]));
  });

  it("filters news by kind", async () => {
    const events = await listRows(news, admin, { filter: "event" });
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((r: Row) => r.kind === "event")).toBe(true);
    const total = (await db.select().from(newsItems)).length;
    expect((await listRows(news, admin, { status: "all" })).length).toBe(total);
  });
});

describe("searching a list", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb({ seed: true });
    const { users } = await import("@/db/schema");
    await db.insert(users).values([{ id: admin.id, email: admin.email, name: admin.name, role: "super_admin", status: "active" }]);
  });

  // Made-up words, so nothing in the seeded content can match by accident.
  const newsItem = (title: string, excerpt = "x", body = "") => ({ kind: "online_news", title, itemDate: "2026-10-01", isPressRelease: false, location: null, excerpt, body, imageUrl: null, imageAlt: null, featured: false });

  it("finds news by words in the title, summary or text, ignoring case and partial words", async () => {
    await createRow(news, admin, newsItem("Quokka corridor opens", "A zorblax line", "Passengers will board at Wombatville."));
    await createRow(news, admin, newsItem("Glimmerport tariffs updated", "Fees change", "Plinkton only."));
    const find = async (q: string) => (await listRows(news, admin, { q })).map((r) => String(r.title));
    expect(await find("QUOKKA")).toEqual(["Quokka corridor opens"]);
    expect(await find("quokka")).not.toContain("Glimmerport tariffs updated");
    expect(await find("wombatville")).toEqual(["Quokka corridor opens"]); // found in the body
    expect(await find("zorblax")).toEqual(["Quokka corridor opens"]); // found in the summary
    expect(await find("quokk")).toEqual(["Quokka corridor opens"]); // partial word
    expect(await find("zzzznotthere")).toEqual([]);
  });

  it("treats % and _ as ordinary characters, never as wildcards", async () => {
    await createRow(news, admin, newsItem("Ordinaryzz title"));
    // a lone % becomes blank after stripping, which means "no search"
    expect(await listRows(news, admin, { q: "%" })).toHaveLength((await listRows(news, admin)).length);
    expect((await listRows(news, admin, { q: "Ordinaryzz_title" })).map((r) => String(r.title))).toEqual([]);
  });

  it("combines with the status and the kind filter", async () => {
    const id = await createRow(news, admin, newsItem("Archived flumph story"));
    await archiveRow(news, admin, id);
    expect(await listRows(news, admin, { q: "flumph", status: "published" })).toHaveLength(0);
    expect((await listRows(news, admin, { q: "flumph", status: "archived" })).map((r) => String(r.title))).toEqual(["Archived flumph story"]);
    expect(await listRows(news, admin, { q: "flumph", status: "archived", filter: "event" })).toHaveLength(0);
  });

  it("searches FCSSIP blocks by the text inside them", async () => {
    await createRow(blocks, admin, { type: "paragraph", text: "The strategy covers snorklewhistle transformation.", label: "", href: "", src: "", alt: "", caption: "", width: "", height: "", size: "full" });
    expect((await listRows(blocks, admin, { q: "snorklewhistle" })).length).toBe(1);
    expect(await listRows(blocks, admin, { q: "zzzznotthere" })).toHaveLength(0);
  });
});

describe("registry", () => {
  it("every plain field maps to a real database column", () => {
    for (const def of ENTITIES.filter((e) => !e.toRow || e.key === "news")) {
      const columns = Object.keys(getTableColumns(def.table));
      for (const f of def.fields) expect(columns, `${def.key}.${f.name}`).toContain(f.name);
    }
  });
  it("entity keys are unique and none shadows a fixed admin route", () => {
    const keys = ENTITIES.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const reserved of ["users", "audit", "status", "account", "site-text"]) expect(keys).not.toContain(reserved);
  });
});

describe("no hard deletes", () => {
  it("the content data layer contains no delete operations", () => {
    const root = path.resolve(__dirname);
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.tsx?$/.test(name) && !name.endsWith(".test.ts")) files.push(full);
      }
    };
    walk(path.resolve(root, ".."));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) expect(readFileSync(file, "utf8"), path.relative(root, file)).not.toMatch(/\.delete\(/);
  });
});

describe("URL validators", () => {
  it("accepts site images and allowed hosts only", () => {
    for (const ok of ["/images/stock/x.jpg", "/uploads/images/a-b.png", "https://images.unsplash.com/photo-1?w=1", "https://abc123.public.blob.vercel-storage.com/images/x.jpg"]) expect(isAllowedMediaUrl(ok), ok).toBe(true);
    for (const bad of ["javascript:alert(1)", "data:image/png;base64,AAAA", "//evil.example/x.jpg", "http://images.unsplash.com/x.jpg", "https://evil.example/x.jpg", "/images/../secret.txt", "/etc/passwd", "https://images.unsplash.com.evil.example/x.jpg", ""]) expect(isAllowedMediaUrl(bad), bad).toBe(false);
  });
  it("accepts safe links only", () => {
    for (const ok of ["#", "/about", "https://ohcsf.gov.ng/downloads", "mailto:info@transportation.gov.ng"]) expect(isAllowedLink(ok), ok).toBe(true);
    for (const bad of ["javascript:alert(1)", "data:text/html,x", "//evil.example", "http://insecure.example", "ftp://x", "\\\\evil", "", "/\\evil"]) expect(isAllowedLink(bad), bad).toBe(false);
  });
});
