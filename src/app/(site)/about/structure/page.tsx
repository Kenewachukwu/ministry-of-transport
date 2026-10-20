import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StructureTemplate } from "@/components/templates/StructureTemplate";

export const metadata: Metadata = pageMetadata("Structure", "How the Federal Ministry of Transportation is organised.", "/about/structure");

export default function Page() {
  return <StructureTemplate />;
}
