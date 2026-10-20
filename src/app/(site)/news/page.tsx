import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { NewsHubTemplate } from "@/components/templates/NewsHubTemplate";
import { getNewsSummaries } from "@/lib/cms";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("News & Events", "News, press releases, photo news and events from the Federal Ministry of Transportation.", "/news");

export default async function Page() {
  return <NewsHubTemplate news={await getNewsSummaries("all")} basePath={SITE_BASE_PATH} />;
}
