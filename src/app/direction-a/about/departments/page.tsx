import type { Metadata } from "next";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getDepartments } from "@/lib/cms";

export const metadata: Metadata = { title: "Departments" };

const basePath = "/direction-a";

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
