import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeadershipDetailTemplate } from "@/components/templates/LeadershipDetailTemplate";
import { getLeadership, getLeadershipById } from "@/lib/cms";

export async function generateStaticParams() {
  return (await getLeadership()).map((person) => ({ id: person.id }));
}

export async function generateMetadata(props: PageProps<"/direction-a/about/leadership/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const person = await getLeadershipById(id);
  return { title: person ? (person.name ?? person.title) : "Leadership" };
}

export default async function Page(props: PageProps<"/direction-a/about/leadership/[id]">) {
  const { id } = await props.params;
  const person = await getLeadershipById(id);
  if (!person) notFound();
  return <LeadershipDetailTemplate person={person} basePath="/direction-a" />;
}
