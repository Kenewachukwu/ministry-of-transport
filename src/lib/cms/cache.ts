import { unstable_cache } from "next/cache";

/**
 * One cache tag per kind of content. Every admin change calls `updateTag` for
 * the tags it touched, which expires those reads (and the pages built from
 * them) immediately — that is how an edit shows up on the public site.
 */
export const TAG = {
  siteText: "site-text",
  contact: "contact",
  hero: "hero",
  news: "news",
  departments: "departments",
  leadership: "leadership",
  pillars: "pillars",
  fcssip: "fcssip",
  eServices: "e-services",
  resources: "resources",
} as const;

export type CacheTag = (typeof TAG)[keyof typeof TAG];

// Part of every cache key. The Data Cache outlives deployments and is keyed on
// the function's source text, not on the row-mapping code it calls — so a
// change to what a read returns could otherwise be served from a stale entry.
const REVISION = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

/**
 * Wraps a database read in the Data Cache, tagged for on-demand expiry, with a
 * one-hour safety-net revalidation. Results are JSON-serialised, so a read must
 * return only primitives, arrays and plain objects. Outside a Next.js runtime
 * (unit tests) the read is simply called directly.
 */
export function cachedRead<T>(name: string, tag: CacheTag, read: () => Promise<T>): () => Promise<T> {
  if (process.env.VITEST || process.env.NODE_ENV === "test") return read;
  return unstable_cache(read, ["cms", REVISION, name], { tags: [tag], revalidate: 3600 });
}
