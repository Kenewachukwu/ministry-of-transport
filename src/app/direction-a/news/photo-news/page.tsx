import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PhotoGalleryTemplate } from "@/components/templates/PhotoGalleryTemplate";
import { getNewsSummaries } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Photo News", "Photographs from the activities of the Federal Ministry of Transportation.", "/news/photo-news");

export default async function Page() {
  return <PhotoGalleryTemplate items={await getNewsSummaries("photo")} />;
}
