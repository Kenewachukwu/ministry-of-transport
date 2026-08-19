import type { Metadata } from "next";
import { StructureTemplate } from "@/components/templates/StructureTemplate";

export const metadata: Metadata = { title: "Structure" };

export default function Page() {
  return <StructureTemplate />;
}
