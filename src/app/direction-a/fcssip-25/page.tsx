import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { PageBlocks } from "@/components/sections/PageBlocks";
import { getFcssip } from "@/lib/cms";

export const metadata: Metadata = { title: "FCSSIP 25" };

export default async function Page() {
  const page = await getFcssip();
  return (
    <StaticContentTemplate eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <PageBlocks blocks={page.blocks} />
    </StaticContentTemplate>
  );
}
