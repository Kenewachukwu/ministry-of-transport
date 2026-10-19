import Image from "next/image";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { getNewsImage } from "@/lib/newsImage";
import type { NewsItem, NewsPhoto } from "@/content/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/**
 * Two photographs per row. An odd photo at the end takes the full width,
 * so the grid never ends with a gap.
 */
function Gallery({ photos }: { photos: NewsPhoto[] }) {
  return (
    <section aria-label="Photo gallery" className="mt-14">
      <Heading as="h2" size="h3">
        Photo gallery
      </Heading>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {photos.map((photo, i) => {
          const wide = i === photos.length - 1 && photos.length % 2 === 1;
          return (
            <li key={photo.src} className={wide ? "sm:col-span-2" : undefined}>
              <figure>
                <div className="overflow-hidden rounded-card border border-border bg-brand-50">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1080}
                    height={810}
                    sizes={wide ? "(min-width: 768px) 704px, 100vw" : "(min-width: 768px) 340px, 100vw"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                {photo.caption && <figcaption className="mt-2 text-sm text-ink-muted">{photo.caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

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
          {item.gallery && item.gallery.length > 0 && <Gallery photos={item.gallery} />}
        </Container>
      </section>
    </article>
  );
}
