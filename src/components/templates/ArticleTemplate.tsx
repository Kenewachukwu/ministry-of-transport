import Image from "next/image";
import { Container } from "@/design-system/primitives/Container";
import { InlineLink } from "@/design-system/primitives/Link";
import { getNewsImage } from "@/lib/newsImage";
import type { NewsItem } from "@/content/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/**
 * Fixes the live site's sitewide broken article-detail pages (every post
 * currently throws a WordPress critical error).
 */
export function ArticleTemplate({ item, basePath }: { item: NewsItem; basePath: string }) {
  return (
    <article>
      <section className="border-b border-border bg-surface-inverse py-16 text-white sm:py-20">
        <Container size="narrow">
          <InlineLink href={`${basePath}/news`} className="text-white/70">
            ← Back to Newsroom
          </InlineLink>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-300">
            {item.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{item.title}</h1>
          <p className="mt-4 text-sm text-white/60">
            {dateFormatter.format(new Date(item.date))} · {item.readTimeMinutes} min read
          </p>
        </Container>
      </section>
      <section className="py-14">
        <Container size="narrow">
          <div className="aspect-[16/9] overflow-hidden rounded-card">
            <Image src={getNewsImage(item)} alt="" width={800} height={450} className="h-full w-full object-cover" />
          </div>
          <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-ink">
            {item.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
