import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { getNewsArticle, listNewsSlugs } from "@/lib/cms";

export async function generateStaticParams() {
  return (await listNewsSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/direction-a/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getNewsArticle(slug);
  return { title: item?.title ?? "News" };
}

export default async function Page(props: PageProps<"/direction-a/news/[slug]">) {
  const { slug } = await props.params;
  const item = await getNewsArticle(slug);
  if (!item) notFound();
  return <ArticleTemplate item={item} basePath="/direction-a" />;
}
