import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeadershipDetailTemplate } from "@/components/templates/LeadershipDetailTemplate";
import { pageMetadata } from "@/lib/seo";
import { getLeadershipById, listLeadershipIds } from "@/lib/cms";
import { SITE_BASE_PATH } from "@/lib/seo";

export async function generateStaticParams() {
  return (await listLeadershipIds()).map((id) => ({ id }));
}

export async function generateMetadata(props: PageProps<"/about/leadership/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const person = await getLeadershipById(id);
  if (!person) return { title: "Leadership" };
  // No photo in the preview: the Permanent Secretary asked that his photo not be used on the site.
  return pageMetadata(person.name ?? person.title, `${person.title}, Federal Ministry of Transportation.`, `/about/leadership/${person.id}`);
}

export default async function Page(props: PageProps<"/about/leadership/[id]">) {
  const { id } = await props.params;
  const person = await getLeadershipById(id);
  if (!person) notFound();
  return <LeadershipDetailTemplate person={person} basePath={SITE_BASE_PATH} />;
}
