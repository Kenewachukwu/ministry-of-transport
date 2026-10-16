import type { Metadata } from "next";
import { PhotoGalleryTemplate } from "@/components/templates/PhotoGalleryTemplate";
import { getNewsSummaries } from "@/lib/cms";

export const metadata: Metadata = { title: "Photo News" };

export default async function Page() {
  return <PhotoGalleryTemplate items={await getNewsSummaries("photo")} />;
}
