import type { Metadata } from "next";
import { StakeholderDirectoryTemplate } from "@/components/templates/StakeholderDirectoryTemplate";
import { getStakeholders } from "@/lib/cms";

export const metadata: Metadata = { title: "Stakeholders" };

export default async function Page() {
  return <StakeholderDirectoryTemplate groups={await getStakeholders()} />;
}
