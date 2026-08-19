import type { Metadata } from "next";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getNctCommuniques } from "@/lib/cms";

export const metadata: Metadata = { title: "NCT Communique" };

export default function Page() {
  return (
    <DocumentLibraryTemplate
      documents={getNctCommuniques()}
      title="NCT Communique"
      description="Communiques from past editions of the National Council on Transportation."
    />
  );
}
