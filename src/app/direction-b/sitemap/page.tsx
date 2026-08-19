import type { Metadata } from "next";
import { SitemapTemplate } from "@/components/templates/SitemapTemplate";

export const metadata: Metadata = { title: "Sitemap" };

export default function Page() {
  return <SitemapTemplate basePath="/direction-b" />;
}
