import type { Metadata } from "next";
import { LeadershipTemplate } from "@/components/templates/LeadershipTemplate";

export const metadata: Metadata = { title: "Leadership" };

export default function Page() {
  return <LeadershipTemplate />;
}
