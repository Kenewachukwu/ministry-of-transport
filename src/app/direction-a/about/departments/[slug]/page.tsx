import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DepartmentDetailTemplate } from "@/components/templates/DepartmentDetailTemplate";
import { pageMetadata } from "@/lib/seo";
import { getDepartments, getDepartmentBySlug, listDepartmentSlugs } from "@/lib/cms";

export async function generateStaticParams() {
  return (await listDepartmentSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/direction-a/about/departments/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const department = await getDepartmentBySlug(slug);
  if (!department) return { title: "Departments" };
  return pageMetadata(department.name, department.summary, `/about/departments/${department.id}`, department.photoUrl ? { image: department.photoUrl } : {});
}

export default async function Page(props: PageProps<"/direction-a/about/departments/[slug]">) {
  const { slug } = await props.params;
  const department = await getDepartmentBySlug(slug);
  if (!department) notFound();
  return <DepartmentDetailTemplate department={department} departments={await getDepartments()} basePath="/direction-a" />;
}
