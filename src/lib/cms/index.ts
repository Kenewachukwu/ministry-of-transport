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
import { resolveSource } from "./source";
import type { NewsFilter, NewsSummary } from "./types";

export type { NewsSummary, NewsFilter, SiteText } from "./types";

/** Drop the article body so list pages never ship it to the browser. */
function summarise(item: NewsItem): NewsSummary {
  const { body, ...summary } = item;
  void body;
  return summary;
}

const matchesFilter = (item: NewsItem, filter: NewsFilter) =>
  filter === "all" ? true : filter === "photo" ? item.category === "Photo News" : item.category !== "Photo News";

export async function getSiteText() {
  return (await resolveSource()).siteText();
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

export async function listNewsSlugs(): Promise<string[]> {
  const items = await (await resolveSource()).news();
  return items.map((item) => item.slug);
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
