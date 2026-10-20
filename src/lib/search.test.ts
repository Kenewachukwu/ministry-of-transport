import { describe, expect, it } from "vitest";
import { buildSearchEntries, searchEntries, searchSite, snippet, type SearchEntry } from "./search";
import { filterDocuments, fileKind } from "@/components/templates/DocumentLibraryTemplate";
import { news } from "@/content/news";
import type { DocumentItem } from "@/content/types";

const entry = (over: Partial<SearchEntry>): SearchEntry => ({ kind: "Page", title: "Title", text: "", href: "/x", ...over });

describe("searchEntries", () => {
  const entries = [
    entry({ title: "Rail Transport Services", text: "Responsible for railways and rolling stock", href: "/a" }),
    entry({ title: "Annual budget", text: "Finance and rail projects funding", href: "/b" }),
    entry({ kind: "News", title: "Coaches approved", text: "The council approved rail coaches", href: "/c", date: "2026-10-18" }),
    entry({ kind: "News", title: "Older coaches story", text: "rail coaches", href: "/d", date: "2024-01-01" }),
    entry({ title: "Café Ministry", text: "", href: "/e" }),
  ];

  it("needs every word, in any order and any case", () => {
    expect(searchEntries(entries, "RAIL budget").map((e) => e.href)).toEqual(["/b"]);
    expect(searchEntries(entries, "coaches rail").map((e) => e.href).sort()).toEqual(["/c", "/d"]);
    expect(searchEntries(entries, "helicopter")).toEqual([]);
  });

  it("puts a title match above a match in the body", () => {
    expect(searchEntries(entries, "rail")[0].href).toBe("/a");
  });

  it("puts newer news first among equals, and ignores accents", () => {
    expect(searchEntries(entries, "coaches").map((e) => e.href)).toEqual(["/c", "/d"]);
    expect(searchEntries(entries, "cafe").map((e) => e.href)).toEqual(["/e"]);
  });

  it("does nothing for an empty or punctuation-only query, and caps the words it looks at", () => {
    expect(searchEntries(entries, "")).toEqual([]);
    expect(searchEntries(entries, "   ?!  ")).toEqual([]);
    expect(searchEntries(entries, "rail ".repeat(50)).length).toBeGreaterThan(0);
  });

  it("shows a passage around the match", () => {
    const long = entry({ text: `${"filler ".repeat(30)}the NCT communique was issued ${"more ".repeat(30)}` });
    const s = snippet(long, "communique");
    expect(s).toContain("communique");
    expect(s.startsWith("…")).toBe(true);
    expect(snippet(entry({ text: "" }), "x")).toBe("");
  });
});

describe("the site's real content", () => {
  it("is all searchable: pages, stories, departments, leaders, documents and services", async () => {
    const entries = await buildSearchEntries();
    const kinds = new Set(entries.map((e) => e.kind));
    for (const k of ["Page", "News", "Department", "Leader", "Document", "E-service"]) expect(kinds.has(k as never), k).toBe(true);
    for (const n of news) expect(entries.some((e) => e.href.endsWith(`/news/${n.slug}`))).toBe(true);
  });

  it("finds a story by a word that is only in its text", async () => {
    const story = news[0];
    const word = story.body.join(" ").split(/\W+/).find((w) => w.length > 8 && !story.title.toLowerCase().includes(w.toLowerCase()))!;
    const found = await searchSite(word);
    expect(found.some((e) => e.href.endsWith(`/news/${story.slug}`))).toBe(true);
  });

  it("never links a document without a file to a dead '#'", async () => {
    const entries = await buildSearchEntries();
    expect(entries.every((e) => e.href !== "#" && e.href !== "")).toBe(true);
  });
});

describe("the documents library", () => {
  const docs: DocumentItem[] = [
    { id: "1", title: "Merchant Shipping Act 2007", category: "Relevant Acts", href: "/files/msa.pdf" },
    { id: "2", title: "National Transport Policy", category: "Policies", href: "#" },
    { id: "3", title: "Budget Report 2025", category: "Reports", href: "https://x.test/b.xlsx?dl=1" },
  ];
  it("filters by words in the title and by category together", () => {
    expect(filterDocuments(docs, "All", "shipping act").map((d) => d.id)).toEqual(["1"]);
    expect(filterDocuments(docs, "Policies", "").map((d) => d.id)).toEqual(["2"]);
    expect(filterDocuments(docs, "Policies", "budget")).toEqual([]);
    expect(filterDocuments(docs, "All", "REPORTS 2025").map((d) => d.id)).toEqual(["3"]);
    expect(filterDocuments(docs, "All", "").length).toBe(3);
  });
  it("says what kind of file a link is", () => {
    expect(fileKind("/files/msa.pdf")).toBe("PDF");
    expect(fileKind("https://x.test/b.xlsx?dl=1")).toBe("Excel");
    expect(fileKind("/a/b.DOCX")).toBe("Word");
    expect(fileKind("#")).toBeNull();
    expect(fileKind(undefined)).toBeNull();
  });
});

