import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LeadershipTemplate } from "@/components/templates/LeadershipTemplate";

export const metadata: Metadata = pageMetadata("Leadership", "The leadership of the Federal Ministry of Transportation and its departments.", "/about/leadership");

export default function Page() {
  return <LeadershipTemplate basePath="/direction-a" />;
}
