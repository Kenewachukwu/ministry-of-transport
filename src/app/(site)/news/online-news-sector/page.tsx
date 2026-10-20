import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArticleListTemplate } from "@/components/templates/ArticleListTemplate";
import { getNewsSummaries } from "@/lib/cms";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Online News Sector", "Online news reports and press releases from the Federal Ministry of Transportation.", "/news/online-news-sector");

export default async function Page() {
  return <ArticleListTemplate items={await getNewsSummaries("online")} basePath={SITE_BASE_PATH} />;
}
