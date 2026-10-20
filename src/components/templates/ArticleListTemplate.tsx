import Link from "next/link";
import { FileText } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import type { NewsSummary } from "@/lib/cms/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function ArticleListTemplate({ items, basePath }: { items: NewsSummary[]; basePath: string }) {
  return (
    <>
      <PageHeader eyebrow="News & Events" title="Online News Sector" description="A running log of the Ministry's online news coverage." />
      <section className="py-16">
        <Container size="narrow">
          {items.length === 0 && <p className="text-ink-muted">No online news reports have been published yet.</p>}
          <ul className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface-raised shadow-card">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`${basePath}/news/${item.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-3">
                    <FileText size={16} className="shrink-0 text-cta" aria-hidden />
                    <span className="text-sm font-medium text-ink">{item.title}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-muted">{dateFormatter.format(new Date(item.date))}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
