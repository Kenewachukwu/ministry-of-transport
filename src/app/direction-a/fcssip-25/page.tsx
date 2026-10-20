import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { PageBlocks } from "@/components/sections/PageBlocks";
import { getFcssip } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("FCSSIP 25", "The FCSSIP 25 plan of the Federal Ministry of Transportation: its goals and priorities.", "/fcssip-25");

export default async function Page() {
  const page = await getFcssip();
  return (
    <StaticContentTemplate eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <PageBlocks blocks={page.blocks} />
    </StaticContentTemplate>
  );
}
