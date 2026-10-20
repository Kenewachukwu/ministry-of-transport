import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SitemapTemplate } from "@/components/templates/SitemapTemplate";

export const metadata: Metadata = pageMetadata("Sitemap", "Every page of the Federal Ministry of Transportation website in one place.", "/sitemap");

export default function Page() {
  return <SitemapTemplate basePath="/direction-a" />;
}
