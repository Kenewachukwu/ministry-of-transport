import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getNctCommuniques, getSiteMeta } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("NCT Communique", "Communiques from the National Council on Transportation.", "/resources/nct-communique");

export default async function Page() {
  const [documents, siteMeta] = await Promise.all([getNctCommuniques(), getSiteMeta()]);
  return (
    <DocumentLibraryTemplate
      documents={documents}
      contactEmail={siteMeta.email}
      title="NCT Communique"
      description="Communiques from past editions of the National Council on Transportation."
    />
  );
}
