"use client";

import { useState } from "react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { FeaturedNews } from "@/components/sections/FeaturedNews";
import type { NewsItem } from "@/content/types";
import { cn } from "@/lib/utils";

const categories = ["All", "Online News Report", "Press Release", "Photo News"] as const;

export function NewsHubTemplate({ news, basePath }: { news: NewsItem[]; basePath: string }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const filtered = category === "All" ? news : news.filter((n) => n.category === category);

  return (
    <>
      <PageHeader
        eyebrow="News & Events"
        title="Newsroom"
        description="Press releases, online news reports, and photo news from across the Ministry."
      />
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-control border px-4 py-2 text-sm font-semibold transition-colors",
                  category === cat
                    ? "border-cta bg-cta text-cta-ink"
                    : "border-border bg-surface-raised text-ink-muted hover:border-cta hover:text-cta"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-10">
            <FeaturedNews items={filtered} basePath={basePath} />
          </div>
          {filtered.length === 0 && (
            <p className="mt-10 text-center text-ink-muted">No items in this category yet.</p>
          )}
        </Container>
      </section>
    </>
  );
}
