import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "@/components/templates/PageHeader";
import { SITE_BASE_PATH, pageMetadata } from "@/lib/seo";
import { searchSite, snippet, type SearchKind } from "@/lib/search";

// Results pages are for people, not for search engines: there is no end to the questions they could be asked.
export const metadata: Metadata = { ...pageMetadata("Search", "Search the Federal Ministry of Transportation website.", "/search"), robots: { index: false, follow: true } };

const MAX_RESULTS = 40;
const KIND_LABEL: Record<SearchKind, string> = { News: "News", Department: "Department", Leader: "Leadership", Document: "Document", "E-service": "E-Service", Page: "Page" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? "";
  const all = query ? await searchSite(query) : [];
  const results = all.slice(0, MAX_RESULTS);

  return (
    <>
      <PageHeader eyebrow="Find something" title="Search" description="News, departments, leaders, documents, e-services and pages on this website." />
      <section className="py-12">
        <Container size="narrow">
          <form action={`${SITE_BASE_PATH}/search`} method="get" role="search" className="flex gap-2">
            <label htmlFor="site-search" className="sr-only">
              Search the website
            </label>
            <input
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={100}
              autoComplete="off"
              placeholder="For example: railway, budget, NCT communique"
              className="min-w-0 flex-1 rounded-control border border-border bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-control bg-cta px-5 py-3 text-sm font-semibold text-cta-ink hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
              <Search size={16} aria-hidden /> Search
            </button>
          </form>

          {query && (
            <p role="status" className="mt-6 text-sm text-ink-muted">
              {all.length === 0
                ? `Nothing found for “${query}”. Try fewer or different words.`
                : all.length > MAX_RESULTS
                  ? `Showing the best ${MAX_RESULTS} of ${all.length} results for “${query}”. Add a word to narrow them.`
                  : `${all.length} ${all.length === 1 ? "result" : "results"} for “${query}”.`}
            </p>
          )}

          {results.length > 0 && (
            <ol className="mt-4 flex flex-col divide-y divide-border rounded-card border border-border bg-surface-raised shadow-card">
              {results.map((r) => (
                <li key={`${r.kind}:${r.href}:${r.title}`} className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-cta">{KIND_LABEL[r.kind]}</p>
                  {r.external ? (
                    <a href={r.href} className="mt-1 block text-base font-semibold text-ink hover:text-cta hover:underline">
                      {r.title}
                    </a>
                  ) : (
                    <Link href={r.href} className="mt-1 block text-base font-semibold text-ink hover:text-cta hover:underline">
                      {r.title}
                    </Link>
                  )}
                  {snippet(r, query) && <p className="mt-1 text-sm text-ink-muted">{snippet(r, query)}</p>}
                </li>
              ))}
            </ol>
          )}

          {!query && <p className="mt-6 text-sm text-ink-muted">Type a word or two above. You can also browse everything from the <Link href={`${SITE_BASE_PATH}/sitemap`} className="font-semibold text-cta underline underline-offset-2">sitemap</Link>.</p>}
        </Container>
      </section>
    </>
  );
}
