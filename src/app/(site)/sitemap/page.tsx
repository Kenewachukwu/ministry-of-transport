import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SitemapTemplate } from "@/components/templates/SitemapTemplate";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Sitemap", "Every page of the Federal Ministry of Transportation website in one place.", "/sitemap");

export default function Page() {
  return <SitemapTemplate basePath={SITE_BASE_PATH} />;
}
