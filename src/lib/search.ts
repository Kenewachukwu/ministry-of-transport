import "server-only";
import { getDepartments, getDocuments, getEServices, getLeadership, getNctCommuniques, getNewsFull } from "@/lib/cms";
import { SITE_BASE_PATH } from "@/lib/seo";

/**
 * Site search. Everything people can look for is turned into one flat list of
 * entries (news, departments, leaders, documents, e-services and the main pages),
 * read through the same content layer the pages use, so whatever is published is
 * searchable and whatever is archived or still a draft is not.
 */
export type SearchKind = "News" | "Department" | "Leader" | "Document" | "E-service" | "Page";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** Everything else worth matching: summary, text, category. */
  text: string;
  href: string;
  /** Opens the file or another site rather than a page here. */
  external?: boolean;
  /** For ordering news, newest first among equals. */
  date?: string;
}

/** The pages with fixed content, with the words people are likely to look for. */
const PAGES: { title: string; text: string; path: string }[] = [
  { title: "About Us", text: "mandate mission vision ministry about", path: "/about" },
  { title: "Leadership", text: "minister permanent secretary directors management", path: "/about/leadership" },
  { title: "Structure", text: "organisation organization structure departments agencies", path: "/about/structure" },
  { title: "Code of Ethics", text: "ethics conduct integrity staff", path: "/about/code-of-ethics" },
  { title: "Agencies", text: "parastatals agencies NRC NITT nigerian railway corporation institute of transport technology", path: "/about/agencies" },
  { title: "Stakeholders", text: "partners unions professional bodies MDAs", path: "/about/stakeholders" },
  { title: "News & Events", text: "newsroom press releases latest", path: "/news" },
  { title: "Events", text: "calendar council commissioning", path: "/news/events" },
  { title: "FCSSIP 25", text: "strategic implementation plan priorities", path: "/fcssip-25" },
  { title: "Contact Us", text: "address phone email enquiry write message opening hours", path: "/contact" },
  { title: "Freedom of Information", text: "FOI request information act", path: "/foi" },
  { title: "Privacy Policy", text: "data protection personal information", path: "/privacy-policy" },
  { title: "Terms of Use", text: "terms conditions website use", path: "/terms-of-use" },
  { title: "Accessibility Statement", text: "accessibility disability screen reader WCAG", path: "/accessibility-statement" },
  { title: "Staff Portal", text: "staff internal correspondence IPPIS", path: "/portal" },
];

export async function buildSearchEntries(): Promise<SearchEntry[]> {
  const [news, departments, leadership, documents, nct, eServices] = await Promise.all([getNewsFull(), getDepartments(), getLeadership(), getDocuments(), getNctCommuniques(), getEServices()]);
  const base = SITE_BASE_PATH;
  const isFile = (href: string) => Boolean(href) && href !== "#";
  return [
    ...PAGES.map((p) => ({ kind: "Page" as const, title: p.title, text: p.text, href: `${base}${p.path}` })),
    ...news.map((n) => ({ kind: "News" as const, title: n.title, text: `${n.excerpt} ${n.category} ${n.body.join(" ")}`, href: `${base}/news/${n.slug}`, date: n.date })),
    ...departments.map((d) => ({
      kind: "Department" as const,
      title: d.name,
      text: `${d.summary} ${d.description.join(" ")} ${d.sections.map((s) => `${s.heading} ${s.items.join(" ")}`).join(" ")}`,
      href: `${base}/about/departments/${d.id}`,
    })),
    ...leadership.map((p) => ({ kind: "Leader" as const, title: p.name ?? p.title, text: `${p.title} ${(p.bio ?? []).map((b) => b.value).join(" ")}`, href: `${base}/about/leadership/${p.id}` })),
    ...documents.map((d) => ({ kind: "Document" as const, title: d.title, text: d.category, href: isFile(d.href) ? d.href : `${base}/resources`, external: isFile(d.href) })),
    ...nct.map((d) => ({ kind: "Document" as const, title: d.title, text: `${d.category} NCT communique national council on transportation`, href: isFile(d.href) ? d.href : `${base}/resources/nct-communique`, external: isFile(d.href) })),
    ...eServices.map((s) => ({ kind: "E-service" as const, title: s.name, text: s.description, href: s.href, external: /^https?:\/\//.test(s.href) })),
  ];
}

const normalise = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
const wordsOf = (q: string) => normalise(q).split(/[^a-z0-9]+/).filter((w) => w.length > 0).slice(0, 8);

/**
 * Entries that contain every word typed (any order, any case, accents ignored),
 * best first: a word in the title counts most, a title that starts with the words
 * or contains them as a phrase counts extra, and among equals newer news comes first.
 */
export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const words = wordsOf(query);
  if (words.length === 0) return [];
  const phrase = words.join(" ");
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = normalise(entry.title);
    const body = normalise(entry.text);
    if (!words.every((w) => title.includes(w) || body.includes(w))) continue;
    let score = 0;
    for (const w of words) score += title.includes(w) ? 4 : 1;
    if (title.includes(phrase)) score += 6;
    if (title.startsWith(words[0])) score += 2;
    scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score || (b.entry.date ?? "").localeCompare(a.entry.date ?? "")).map((s) => s.entry);
}

/** A short passage from the entry's text around the first word that matches, for showing why it matched. */
export function snippet(entry: SearchEntry, query: string, length = 160): string {
  const text = entry.text.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const words = wordsOf(query);
  const lower = normalise(text);
  const at = words.map((w) => lower.indexOf(w)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, at - 40);
  const piece = text.slice(start, start + length).trim();
  return `${start > 0 ? "…" : ""}${piece}${start + length < text.length ? "…" : ""}`;
}

export async function searchSite(query: string): Promise<SearchEntry[]> {
  return searchEntries(await buildSearchEntries(), query);
}
