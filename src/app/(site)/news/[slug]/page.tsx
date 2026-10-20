import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNewsArticle, listNewsSlugs } from "@/lib/cms";
import { getNewsImage } from "@/lib/newsImage";
import { newsArticleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_BASE_PATH } from "@/lib/seo";

export async function generateStaticParams() {
  return (await listNewsSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getNewsArticle(slug);
  if (!item) return { title: "News" };
  return pageMetadata(item.title, item.excerpt, `/news/${item.slug}`, { image: getNewsImage(item), imageAlt: item.imageAlt || undefined, type: "article", publishedTime: item.date });
}

export default async function Page(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const item = await getNewsArticle(slug);
  if (!item) notFound();
  return (
    <>
      <JsonLd data={newsArticleJsonLd(item)} />
      <ArticleTemplate item={item} basePath={SITE_BASE_PATH} />
    </>
  );
}
