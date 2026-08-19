import type { Metadata } from "next";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getEServices } from "@/lib/cms";

export const metadata: Metadata = { title: "E-Services" };

export default function Page() {
  const services = getEServices();
  return (
    <DirectoryTemplate
      eyebrow="Find Government Services"
      title="E-Services"
      description="Government services and information for road, rail, and cross-border transport."
      columns={3}
      items={services.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        href: s.href,
        external: !s.href.startsWith("/"),
      }))}
    />
  );
}
