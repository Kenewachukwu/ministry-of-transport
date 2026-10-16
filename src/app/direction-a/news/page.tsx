import type { Metadata } from "next";
import { NewsHubTemplate } from "@/components/templates/NewsHubTemplate";
import { getNewsSummaries } from "@/lib/cms";

export const metadata: Metadata = { title: "News & Events" };

export default async function Page() {
  return <NewsHubTemplate news={await getNewsSummaries("all")} basePath="/direction-a" />;
}
