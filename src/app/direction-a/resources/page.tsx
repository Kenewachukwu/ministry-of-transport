import type { Metadata } from "next";
import { DocumentLibraryTemplate } from "@/components/templates/DocumentLibraryTemplate";
import { getDocuments } from "@/lib/cms";

export const metadata: Metadata = { title: "Resources" };

export default async function Page() {
  return <DocumentLibraryTemplate documents={await getDocuments()} />;
}
