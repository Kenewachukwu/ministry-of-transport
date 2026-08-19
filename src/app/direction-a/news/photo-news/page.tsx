import type { Metadata } from "next";
import { PhotoGalleryTemplate } from "@/components/templates/PhotoGalleryTemplate";
import { getNews } from "@/lib/cms";

export const metadata: Metadata = { title: "Photo News" };

export default function Page() {
  return <PhotoGalleryTemplate items={getNews()} />;
}
