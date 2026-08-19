import type { Metadata } from "next";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getDepartments } from "@/lib/cms";

export const metadata: Metadata = { title: "Departments" };

export default function Page() {
  const departments = getDepartments();
  return (
    <DirectoryTemplate
      eyebrow="About Us"
      title="Departments"
      description="The fifteen departments that carry out the Ministry's day-to-day mandate."
      items={departments.map((d) => ({ id: d.id, title: d.name, description: d.summary, imageUrl: d.photoUrl }))}
    />
  );
}
