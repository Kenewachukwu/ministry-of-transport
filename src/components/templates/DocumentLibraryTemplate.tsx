"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import type { DocumentItem } from "@/content/types";
import { documentCategories } from "@/content/documents";
import { cn } from "@/lib/utils";

/** A document whose file has not been uploaded yet carries "#" (or nothing) as its link. */
const hasFile = (href: string | undefined) => !!href && href !== "#";

/** What kind of file a link points to, from its extension, so people know what they are about to open. */
export function fileKind(href: string | undefined): "PDF" | "Word" | "Excel" | null {
  const path = (href ?? "").split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".pdf")) return "PDF";
  if (path.endsWith(".docx") || path.endsWith(".doc")) return "Word";
  if (path.endsWith(".xlsx") || path.endsWith(".xls")) return "Excel";
  return null;
}

/** Documents whose title or category contains every word typed (any order, any case). */
export function filterDocuments(documents: DocumentItem[], category: string, query: string): DocumentItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return documents.filter((d) => {
    if (category !== "All" && d.category !== category) return false;
    const haystack = `${d.title} ${d.category}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export function DocumentLibraryTemplate({
  documents,
  contactEmail,
  title = "Resources",
  description = "Acts, policies, agreements, and reports relevant to the transport sector.",
}: {
  documents: DocumentItem[];
  /** Where "Available on request" emails go. */
  contactEmail: string;
  title?: string;
  description?: string;
}) {
  const [category, setCategory] = useState<(typeof documentCategories)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = filterDocuments(documents, category, query);

  return (
    <>
      <PageHeader eyebrow="Resources" title={title} description={description} />
      <section className="py-16">
        <Container>
          <div className="max-w-md">
            <label htmlFor="document-search" className="sr-only">
              Search these documents
            </label>
            <input
              id="document-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title"
              autoComplete="off"
              className="w-full rounded-control border border-border bg-surface-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {documentCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-control border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  category === cat
                    ? "border-cta bg-cta text-cta-ink"
                    : "border-border bg-surface-raised text-ink-muted hover:border-cta hover:text-cta"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <p role="status" className="mt-6 text-sm text-ink-muted">
            {filtered.length === documents.length ? `${documents.length} ${documents.length === 1 ? "document" : "documents"}` : `Showing ${filtered.length} of ${documents.length} documents`}
            {query.trim() && <> matching &ldquo;{query.trim()}&rdquo;</>}
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border bg-surface-raised shadow-card">
            {filtered.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="flex items-center gap-3">
                  <FileText size={16} className="shrink-0 text-cta" aria-hidden />
                  <span className="text-sm font-medium text-ink">{doc.title}</span>
                  {hasFile(doc.href) && fileKind(doc.href) && <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-800">{fileKind(doc.href)}</span>}
                </span>
                {hasFile(doc.href) ? (
                  <a
                    href={doc.href}
                    className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cta hover:underline"
                  >
                    <Download size={13} aria-hidden /> Download
                  </a>
                ) : (
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Request for document: ${doc.title}`)}`}
                    className="shrink-0 text-xs font-semibold text-ink-muted hover:text-cta hover:underline"
                  >
                    Available on request
                    <span className="sr-only"> — email the Ministry to request {doc.title}</span>
                  </a>
                )}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-muted">
                {query.trim() || category !== "All" ? "No documents match. Try fewer words or choose All." : "No documents yet."}
              </li>
            )}
          </ul>
        </Container>
      </section>
    </>
  );
}
