import type { Metadata } from "next";
import { ContactTemplate } from "@/components/templates/ContactTemplate";

export const metadata: Metadata = { title: "Contact Us" };

export default function Page() {
  return <ContactTemplate />;
}
