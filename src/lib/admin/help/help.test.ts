import { describe, expect, it } from "vitest";
import { ENTITIES } from "../registry";
import { CONTENT_NAV, SYSTEM_NAV } from "../nav";
import { SECTIONS, SECTION_LABELS, type SessionUser } from "@/lib/auth/permissions";
import { ENTITY_GUIDE, GLOSSARY, GUIDES, PAGE_GUIDE, getGuide, guideText, isForPerson, searchEntries, splitGuides, toIndexEntry } from "./index";
import { UI_LABELS } from "./ui-labels";

/* ---------- what the guides may quote ------------------------------------------------------------ */

/** Everything a guide may put in “curly quotes”: real labels from the admin, never invented ones. */
function knownLabels(): Set<string> {
  const known = new Set<string>(UI_LABELS);
  for (const e of [...CONTENT_NAV, ...SYSTEM_NAV]) known.add(e.label);
  for (const label of Object.values(SECTION_LABELS)) known.add(label);
  for (const def of ENTITIES) {
    known.add(def.plural);
    known.add(`Add ${def.singular}`);
    known.add(`Create ${def.singular}`);
    known.add(`Archive this ${def.singular}`);
    for (const f of def.fields) {
      known.add(f.label);
      if (f.kind === "select") for (const o of f.options) known.add(o.label);
      if (f.kind === "repeater") for (const c of f.columns) known.add(c.label);
    }
    if (def.filter) for (const o of def.filter.options) known.add(o.label);
  }
  return known;
}

const quoted = (text: string) => [...text.matchAll(/“([^”]+)”/g)].map((m) => m[1]);

function textsOf(guide: (typeof GUIDES)[number]): string[] {
  return [
    guide.summary,
    ...guide.steps.flatMap((s) => [s.text, s.detail ?? ""]),
    ...(guide.tips ?? []),
    ...(guide.problems ?? []).flatMap((p) => [p.q, p.a]),
  ];
}

function isKnownAdminPath(href: string): boolean {
  const staticPaths = ["/admin", "/admin/site-text", "/admin/users", "/admin/audit", "/admin/status", "/admin/account"];
  if (staticPaths.includes(href) || href.startsWith("/admin/help")) return true;
  const m = href.match(/^\/admin\/([a-z-]+)(\/new)?$/);
  return Boolean(m && ENTITIES.some((e) => e.key === m[1]));
}

/* ---------- the guides themselves ----------------------------------------------------------------- */

describe("help guides", () => {
  it("have unique slugs and the fields people need", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const g of GUIDES) {
      expect(g.slug, g.slug).toMatch(/^[a-z0-9-]+$/);
      expect(g.title.length, g.slug).toBeGreaterThan(5);
      expect(g.summary.length, g.slug).toBeGreaterThan(15);
      expect(g.reviewed, g.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.steps.length > 0 || (g.problems?.length ?? 0) > 0, `${g.slug} needs steps or problems`).toBe(true);
      for (const s of g.steps) expect(s.text.trim().length, `${g.slug}: empty step`).toBeGreaterThan(3);
    }
  });

  it("only quote buttons, fields and menu items that really exist in the admin", () => {
    const known = knownLabels();
    const unknown: string[] = [];
    for (const g of GUIDES) for (const t of textsOf(g)) for (const label of quoted(t)) if (!known.has(label)) unknown.push(`${g.slug}: “${label}”`);
    expect(unknown, "These quoted labels are not in the admin. Fix the guide, or add the label to ui-labels.ts if it is real:").toEqual([]);
  });

  it("only link to screens that exist", () => {
    const bad: string[] = [];
    for (const g of GUIDES) for (const s of g.steps) if (s.link && !isKnownAdminPath(s.link.href)) bad.push(`${g.slug}: ${s.link.href}`);
    expect(bad).toEqual([]);
  });

  it("point to related guides that exist", () => {
    for (const g of GUIDES) for (const slug of g.related ?? []) {
      expect(getGuide(slug), `${g.slug} -> ${slug}`).toBeDefined();
      expect(slug, `${g.slug} relates to itself`).not.toBe(g.slug);
    }
  });
});

describe("help coverage (nothing in the admin without a guide)", () => {
  it("every kind of content has a guide for the right section", () => {
    for (const def of ENTITIES) {
      const slug = ENTITY_GUIDE[def.key];
      expect(slug, `no guide mapped for /admin/${def.key}`).toBeDefined();
      const guide = getGuide(slug)!;
      expect(guide, `${def.key} -> ${slug}`).toBeDefined();
      expect(guide.audience, `${slug} should be for the ${def.section} section`).toBe(def.section);
    }
  });

  it("every section of the website has at least one guide", () => {
    for (const section of SECTIONS) {
      expect(GUIDES.some((g) => g.audience === section), `no guide for section ${section}`).toBe(true);
    }
  });

  it("every administration page and account page has a guide", () => {
    for (const e of SYSTEM_NAV) expect(PAGE_GUIDE[e.href], `no guide for ${e.href}`).toBeDefined();
    for (const slug of Object.values(PAGE_GUIDE)) expect(getGuide(slug), slug).toBeDefined();
    expect(PAGE_GUIDE["/admin/account"]).toBeDefined();
    expect(PAGE_GUIDE["/admin/site-text"]).toBeDefined();
  });
});

describe("who sees which guides first", () => {
  const person = (role: SessionUser["role"], permissions: SessionUser["permissions"]) => ({ role, permissions });

  it("a content editor gets their sections' guides first, and not the super administrator's", () => {
    const { mine, others } = splitGuides(person("staff", ["news"]));
    const mineSlugs = mine.map((g) => g.slug);
    expect(mineSlugs).toContain("publish-a-news-story");
    expect(mineSlugs).toContain("accept-your-invitation"); // everyone's guides
    expect(mineSlugs).not.toContain("change-a-hero-slide");
    expect(mineSlugs).not.toContain("invite-someone");
    expect(others.map((g) => g.slug)).toContain("invite-someone"); // still readable
    expect(mine.length + others.length).toBe(GUIDES.length);
  });

  it("a super administrator has every guide as their own", () => {
    const { mine, others } = splitGuides(person("super_admin", []));
    expect(others).toHaveLength(0);
    expect(mine).toHaveLength(GUIDES.length);
  });

  it("an editor with no sections only has the general guides", () => {
    const { mine } = splitGuides(person("staff", []));
    expect(mine.every((g) => g.audience === "everyone")).toBe(true);
    expect(isForPerson(person("staff", []), getGuide("invite-someone")!)).toBe(false);
  });
});

describe("help search", () => {
  const entries = GUIDES.map((g) => toIndexEntry(g, true));

  it("finds guides by any word in their steps, not only the title", () => {
    const hits = searchEntries(entries, "blank line").map((e) => e.slug);
    expect(hits).toContain("publish-a-news-story");
  });

  it("ranks title matches first, and needs every word to match", () => {
    const hits = searchEntries(entries, "archive");
    expect(hits[0].slug).toBe("archive-and-restore");
    expect(searchEntries(entries, "archive zzzznotaword")).toHaveLength(0);
  });

  it("returns everything for an empty search and ignores curly quotes in the text", () => {
    expect(searchEntries(entries, "   ")).toHaveLength(entries.length);
    expect(guideText(getGuide("change-your-password")!)).not.toContain("“");
    expect(searchEntries(entries, "save changes").length).toBeGreaterThan(0);
  });
});

describe("glossary", () => {
  it("has unique terms with real explanations", () => {
    const terms = GLOSSARY.map((g) => g.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
    for (const g of GLOSSARY) expect(g.meaning.length, g.term).toBeGreaterThan(20);
  });
});
