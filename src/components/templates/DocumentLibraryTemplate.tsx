"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import type { DocumentItem } from "@/content/types";
import { documentCategories } from "@/content/documents";
import { cn } from "@/lib/utils";

export function DocumentLibraryTemplate({
  documents,
  title = "Resources",
  description = "Acts, policies, agreements, and reports relevant to the transport sector.",
}: {
  documents: DocumentItem[];
  title?: string;
  description?: string;
}) {
  const [category, setCategory] = useState<(typeof documentCategories)[number]>("All");
  const filtered = category === "All" ? documents : documents.filter((d) => d.category === category);

  return (
    <>
      <PageHeader eyebrow="Resources" title={title} description={description} />
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {documentCategories.map((cat) => (
              <button
                key={cat}
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
          <ul className="mt-8 flex flex-col divide-y divide-border rounded-card border border-border bg-surface-raised shadow-card">
            {filtered.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="flex items-center gap-3">
                  <FileText size={16} className="shrink-0 text-cta" aria-hidden />
                  <span className="text-sm font-medium text-ink">{doc.title}</span>
                </span>
                <a
                  href={doc.href}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cta hover:underline"
                >
                  <Download size={13} aria-hidden /> Download
                </a>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-muted">No documents in this category yet.</li>
            )}
          </ul>
        </Container>
      </section>
    </>
  );
}
