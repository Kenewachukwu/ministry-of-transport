import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactTemplate } from "@/components/templates/ContactTemplate";

export const metadata: Metadata = pageMetadata("Contact Us", "How to reach the Federal Ministry of Transportation: address, opening hours and email.", "/contact");

export default function Page() {
  return <ContactTemplate />;
}
