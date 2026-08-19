import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { NewsItem } from "@/content/types";
import { getNewsImage } from "@/lib/newsImage";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * The dynamic title+image+excerpt+date+"Read More" pull-grid pattern from
 * fmmbe.gov.ng's "Featured News" section — the pattern the client
 * specifically flagged as one to carry over.
 */
export function FeaturedNews({
  items,
  basePath,
  heading = "Featured News",
}: {
  items: NewsItem[];
  basePath: string;
  heading?: string;
}) {
  return (
    <div>
      <ScrollRevealGroup className="grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <ScrollRevealItem key={item.id}>
            <Link href={`${basePath}/news/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-card transition-all duration-200 hover:-translate-y-1">
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={getNewsImage(item)}
                  alt=""
                  width={506}
                  height={316}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-cta">
                  {item.category}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{item.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                  <span>{dateFormatter.format(new Date(item.date))}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden />
                    {item.readTimeMinutes} min read
                  </span>
                </div>
              </div>
            </Link>
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>
    </div>
  );
}
