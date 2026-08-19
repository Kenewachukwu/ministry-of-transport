import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { getNewsBySlug, getNews } from "@/lib/cms";

export function generateStaticParams() {
  return getNews().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: PageProps<"/direction-a/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getNewsBySlug(slug);
  return { title: item?.title ?? "News" };
}

export default async function Page(props: PageProps<"/direction-a/news/[slug]">) {
  const { slug } = await props.params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();
  return <ArticleTemplate item={item} basePath="/direction-a" />;
}
