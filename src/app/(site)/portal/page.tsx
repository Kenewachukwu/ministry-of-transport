import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaffPortalTemplate } from "@/components/templates/StaffPortalTemplate";

export const metadata: Metadata = pageMetadata("Staff Portal", "Links for staff of the Federal Ministry of Transportation to the Ministry's internal systems.", "/portal");

export default function Page() {
  return <StaffPortalTemplate />;
}
