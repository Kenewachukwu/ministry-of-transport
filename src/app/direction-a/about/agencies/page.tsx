import type { Metadata } from "next";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getAgencies } from "@/lib/cms";

export const metadata: Metadata = { title: "Agencies" };

export default async function Page() {
  const agencies = await getAgencies();
  return (
    <DirectoryTemplate
      eyebrow="About Us"
      title="Agencies"
      description="Parastatals under the Federal Ministry of Transportation."
      columns={2}
      items={agencies.map((a) => ({
        id: a.id,
        title: a.name,
        description: a.description,
        href: a.href,
        external: true,
        badge: a.shortName,
        imageUrl: a.photoUrl,
      }))}
    />
  );
}
