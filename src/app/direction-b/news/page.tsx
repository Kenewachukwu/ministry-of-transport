import type { Metadata } from "next";
import { NewsHubTemplate } from "@/components/templates/NewsHubTemplate";
import { getNews } from "@/lib/cms";

export const metadata: Metadata = { title: "News & Events" };

export default function Page() {
  return <NewsHubTemplate news={getNews()} basePath="/direction-b" />;
}
