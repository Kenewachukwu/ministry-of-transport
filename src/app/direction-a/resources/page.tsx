import type { Metadata } from "next";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getDocuments, getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = { title: "Resources" };

export default async function Page() {
  const [documents, siteMeta] = await Promise.all([getDocuments(), getSiteMeta()]);
  return <DocumentLibraryTemplate documents={documents} contactEmail={siteMeta.email} />;
}
