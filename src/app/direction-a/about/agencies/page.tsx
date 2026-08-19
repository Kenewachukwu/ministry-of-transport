import type { Metadata } from "next";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getAgencies } from "@/lib/cms";

export const metadata: Metadata = { title: "Agencies" };

export default function Page() {
  const agencies = getAgencies();
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
