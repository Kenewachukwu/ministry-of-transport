import type { Metadata } from "next";
import { StaffPortalTemplate } from "@/components/templates/StaffPortalTemplate";

export const metadata: Metadata = { title: "Staff Portal" };

export default function Page() {
  return <StaffPortalTemplate />;
}
