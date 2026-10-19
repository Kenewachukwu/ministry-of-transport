/**
 * The public site's only door to editable content. Every page and template
 * calls through here rather than importing `src/content/*` directly, so where
 * the content actually comes from (static files today, a database once the
 * Ministry's admin is connected) is decided in exactly one place.
 */
import { agencies } from "@/content/agencies";
import { stakeholders } from "@/content/stakeholders";
import { stats } from "@/content/stats";
import type { NewsItem } from "@/content/types";
import { contentSource } from "@/lib/env";
import { resolveSource } from "./source";
import type { NewsFilter, NewsSummary } from "./types";

export type { NewsSummary, NewsFilter, SiteText } from "./types";

/** Drop the article body and gallery so list pages never ship them to the browser. */
function summarise(item: NewsItem): NewsSummary {
  const { body, gallery, ...summary } = item;
  void body;
  void gallery;
  return summary;
}

const matchesFilter = (item: NewsItem, filter: NewsFilter) =>
  filter === "all" ? true : filter === "photo" ? item.category === "Photo News" : item.category !== "Photo News";

export async function getSiteText() {
  return (await resolveSource()).siteText();
}

/** The Ministry's address, hours, phone, email and social links (editable in the admin under Contact details & links). */
export async function getSiteMeta() {
  return (await resolveSource()).siteMeta();
}

export async function getHeroSlides() {
  return (await resolveSource()).heroSlides();
}

export async function getPillars() {
  return (await resolveSource()).pillars();
}

export async function getNewsSummaries(filter: NewsFilter = "all"): Promise<NewsSummary[]> {
  const items = await (await resolveSource()).news();
  return items.filter((item) => matchesFilter(item, filter)).map(summarise);
}

export async function getNewsArticle(slug: string): Promise<NewsItem | undefined> {
  const items = await (await resolveSource()).news();
  return items.find((item) => item.slug === slug);
}

/**
 * Pages to pre-render at build time (`generateStaticParams`). Skipped for the
 * embedded development database: Next runs those lists in a separate process,
 * and only one process may open an embedded database. Unlisted pages simply
 * render on demand, which is how development works anyway.
 */
const prerenderable = () => contentSource() !== "pglite";

export async function listNewsSlugs(): Promise<string[]> {
  if (!prerenderable()) return [];
  const items = await (await resolveSource()).news();
  return items.map((item) => item.slug);
}

export async function listDepartmentSlugs(): Promise<string[]> {
  if (!prerenderable()) return [];
  return (await getDepartments()).map((department) => department.id);
}

export async function listLeadershipIds(): Promise<string[]> {
  if (!prerenderable()) return [];
  return (await getLeadership()).map((person) => person.id);
}

export async function getEvents() {
  return (await resolveSource()).events();
}

export async function getDepartments() {
  return (await resolveSource()).departments();
}

export async function getDepartmentBySlug(slug: string) {
  return (await getDepartments()).find((department) => department.id === slug);
}

export async function getLeadership() {
  return (await resolveSource()).leadership();
}

export async function getLeadershipById(id: string) {
  return (await getLeadership()).find((person) => person.id === id);
}

export async function getDocuments() {
  return (await resolveSource()).documents();
}

export async function getNctCommuniques() {
  return (await resolveSource()).nctCommuniques();
}

export async function getEServices() {
  return (await resolveSource()).eServices();
}

export async function getFcssip() {
  return (await resolveSource()).fcssip();
}

/* Not editable from the admin (yet): kept in code, served through the same door. */

export async function getAgencies() {
  return agencies;
}

export async function getStakeholders() {
  return stakeholders;
}

/** Headline figures; the department count always reflects the real list. */
export async function getStats() {
  const departmentCount = (await getDepartments()).length;
  return stats.map((stat) => (stat.id === "departments" ? { ...stat, value: departmentCount } : stat));
}
