import type { Metadata } from "next";
import type { NewsItem, SiteMeta } from "@/content/types";
import { getNewsImage } from "@/lib/newsImage";
import { siteUrl } from "@/lib/env";

/**
 * Where the public pages live. Canonical links, the sitemap and the structured
 * data all derive from this, so moving the site to the domain root later is a
 * change here plus the route folder.
 */
export const SITE_BASE_PATH = "/direction-a";

export const SITE_NAME = "Federal Ministry of Transportation";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
const DEFAULT_IMAGE = "/images/brand/fmt-coat-of-arms.png";

/** The full address of a public page, from its path under the site (`/about`, or `""` for the home page). */
export const pageUrl = (path: string) => `${siteUrl()}${SITE_BASE_PATH}${path}`;

/** An absolute link to a file or picture on this site; full links pass through. */
export const absoluteUrl = (href: string) => (/^https?:\/\//.test(href) ? href : `${siteUrl()}${href.startsWith("/") ? "" : "/"}${href}`);

/** Shared by every page so the title, description, canonical link and social preview always agree. */
export function pageMetadata(title: string, description: string, path: string, options: { image?: string; imageAlt?: string; type?: "website" | "article"; publishedTime?: string } = {}): Metadata {
  const url = pageUrl(path);
  const image = options.image ?? DEFAULT_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: options.type ?? "website",
      siteName: SITE_NAME,
      locale: "en_NG",
      title: `${title}${TITLE_SUFFIX}`,
      description,
      url,
      images: [{ url: absoluteUrl(image), alt: options.imageAlt ?? SITE_NAME }],
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title}${TITLE_SUFFIX}`, description, images: [absoluteUrl(image)] },
  };
}

/** The home page keeps the full site name as its title rather than "Home | Federal Ministry…". */
export function homeMetadata(description: string): Metadata {
  const full = `${SITE_NAME} | Nigeria`;
  const base = pageMetadata(SITE_NAME, description, "");
  return { ...base, title: { absolute: full }, openGraph: { ...base.openGraph, title: full }, twitter: { ...base.twitter, title: full } };
}

/** The Ministry as a government organisation, for search engines (only fields that are really set). */
export function organizationJsonLd(meta: SiteMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: meta.name,
    url: pageUrl(""),
    logo: absoluteUrl(DEFAULT_IMAGE),
    address: { "@type": "PostalAddress", streetAddress: meta.address, addressCountry: "NG" },
    ...(meta.email ? { email: meta.email } : {}),
    ...(meta.phone ? { telephone: meta.phone } : {}),
    sameAs: Object.values(meta.social).filter(Boolean),
  };
}

export function newsArticleJsonLd(item: NewsItem) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    image: [absoluteUrl(getNewsImage(item))],
    mainEntityOfPage: pageUrl(`/news/${item.slug}`),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl(DEFAULT_IMAGE) } },
  };
}
