import type { MetadataRoute } from "next";
import { getDepartments, getLeadership, getNewsSummaries } from "@/lib/cms";
import { pageUrl } from "@/lib/seo";

/** Refreshed at least hourly; the admin also expires the content it is built from. */
export const revalidate = 3600;

/** Every public page that does not depend on editable content. */
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/about/departments", priority: 0.8 },
  { path: "/about/leadership", priority: 0.7 },
  { path: "/about/agencies", priority: 0.6 },
  { path: "/about/stakeholders", priority: 0.5 },
  { path: "/about/structure", priority: 0.5 },
  { path: "/about/code-of-ethics", priority: 0.5 },
  { path: "/news", priority: 0.9 },
  { path: "/news/online-news-sector", priority: 0.7 },
  { path: "/news/photo-news", priority: 0.7 },
  { path: "/news/events", priority: 0.7 },
  { path: "/fcssip-25", priority: 0.7 },
  { path: "/e-services", priority: 0.7 },
  { path: "/resources", priority: 0.7 },
  { path: "/resources/nct-communique", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/foi", priority: 0.4 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/terms-of-use", priority: 0.3 },
  { path: "/accessibility-statement", priority: 0.3 },
  { path: "/portal", priority: 0.2 },
  { path: "/sitemap", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, departments, leadership] = await Promise.all([getNewsSummaries("all"), getDepartments(), getLeadership()]);
  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({ url: pageUrl(path), priority })),
    ...news.map((n) => ({ url: pageUrl(`/news/${n.slug}`), lastModified: n.date, priority: 0.8 })),
    ...departments.map((d) => ({ url: pageUrl(`/about/departments/${d.id}`), priority: 0.6 })),
    ...leadership.map((p) => ({ url: pageUrl(`/about/leadership/${p.id}`), priority: 0.5 })),
  ];
}
