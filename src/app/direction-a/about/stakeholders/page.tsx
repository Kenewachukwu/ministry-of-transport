import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StakeholderDirectoryTemplate } from "@/components/templates/StakeholderDirectoryTemplate";
import { getStakeholders } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Stakeholders", "The ministries, agencies, professional bodies and unions the Federal Ministry of Transportation works with.", "/about/stakeholders");

export default async function Page() {
  return <StakeholderDirectoryTemplate groups={await getStakeholders()} />;
}
