import type { Metadata } from "next";
import { ArticleListTemplate } from "@/components/templates/ArticleListTemplate";
import { getNews } from "@/lib/cms";

export const metadata: Metadata = { title: "Online News Sector" };

export default function Page() {
  return <ArticleListTemplate items={getNews()} basePath="/direction-a" />;
}
