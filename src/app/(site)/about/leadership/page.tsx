import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LeadershipTemplate } from "@/components/templates/LeadershipTemplate";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Leadership", "The leadership of the Federal Ministry of Transportation and its departments.", "/about/leadership");

export default function Page() {
  return <LeadershipTemplate basePath={SITE_BASE_PATH} />;
}
