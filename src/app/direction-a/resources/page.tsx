import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getDocuments, getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Resources", "Policies, acts, reports and other documents published by the Federal Ministry of Transportation.", "/resources");

export default async function Page() {
  const [documents, siteMeta] = await Promise.all([getDocuments(), getSiteMeta()]);
  return <DocumentLibraryTemplate documents={documents} contactEmail={siteMeta.email} />;
}
