import type { Metadata } from "next";
import { ArticleListTemplate } from "@/components/templates/ArticleListTemplate";
import { getNewsSummaries } from "@/lib/cms";

export const metadata: Metadata = { title: "Online News Sector" };

export default async function Page() {
  return <ArticleListTemplate items={await getNewsSummaries("online")} basePath="/direction-a" />;
}
