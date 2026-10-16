import type { Metadata } from "next";
import { HubPageTemplate } from "@/components/templates/HubPageTemplate";
import { getDepartments } from "@/lib/cms";

export const metadata: Metadata = { title: "About Us" };

const buildLinks = (departmentCount: number) => [
  { id: "leadership", title: "Leadership", description: "Minister, Permanent Secretary, and directors.", href: "/about/leadership" },
  { id: "departments", title: "Departments", description: `The ${departmentCount} departments and units carrying out our mandate.`, href: "/about/departments" },
  { id: "structure", title: "Structure", description: "How the Ministry is organised.", href: "/about/structure" },
  { id: "code-of-ethics", title: "Code of Ethics", description: "Our standards of conduct.", href: "/about/code-of-ethics" },
  { id: "agencies", title: "Agencies", description: "Parastatals under the Ministry.", href: "/about/agencies" },
  { id: "stakeholders", title: "Stakeholders", description: "Federal and state bodies we work with.", href: "/about/stakeholders" },
];

export default async function Page() {
  const departments = await getDepartments();
  return <HubPageTemplate basePath="/direction-a" links={buildLinks(departments.length)} />;
}
