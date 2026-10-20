import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getDepartments } from "@/lib/cms";
import { SITE_BASE_PATH } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Departments", "The departments of the Federal Ministry of Transportation and what each one is responsible for.", "/about/departments");

const basePath = SITE_BASE_PATH;

export default async function Page() {
  const departments = await getDepartments();
  return (
    <DirectoryTemplate
      eyebrow="About Us"
      title="Departments"
      description={`The ${departments.length} departments and units that carry out the Ministry's day-to-day mandate.`}
      items={departments.map((d) => ({
        id: d.id,
        title: d.name,
        description: d.summary,
        imageUrl: d.photoUrl,
        href: `${basePath}/about/departments/${d.id}`,
      }))}
    />
  );
}
