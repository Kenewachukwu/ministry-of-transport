import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DepartmentDetailTemplate } from "@/components/templates/DepartmentDetailTemplate";
import { getDepartments, getDepartmentBySlug } from "@/lib/cms";

export async function generateStaticParams() {
  return (await getDepartments()).map((department) => ({ slug: department.id }));
}

export async function generateMetadata(props: PageProps<"/direction-a/about/departments/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const department = await getDepartmentBySlug(slug);
  return { title: department?.name ?? "Departments", description: department?.summary };
}

export default async function Page(props: PageProps<"/direction-a/about/departments/[slug]">) {
  const { slug } = await props.params;
  const department = await getDepartmentBySlug(slug);
  if (!department) notFound();
  return <DepartmentDetailTemplate department={department} departments={await getDepartments()} basePath="/direction-a" />;
}
