import type { Metadata } from "next";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getNctCommuniques } from "@/lib/cms";

export const metadata: Metadata = { title: "NCT Communique" };

export default async function Page() {
  const documents = await getNctCommuniques();
  return (
    <DocumentLibraryTemplate
      documents={documents}
      title="NCT Communique"
      description="Communiques from past editions of the National Council on Transportation."
    />
  );
}
