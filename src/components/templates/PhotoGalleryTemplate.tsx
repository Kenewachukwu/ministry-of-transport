import Link from "next/link";
import { SITE_BASE_PATH } from "@/lib/seo";
import { NewsImageFrame } from "@/components/sections/NewsImageFrame";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { getNewsImage } from "@/lib/newsImage";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import type { NewsSummary } from "@/lib/cms/types";

/** Fixes the live site's Photo News page, which currently throws a WordPress critical error. */
export function PhotoGalleryTemplate({ items }: { items: NewsSummary[] }) {
  return (
    <>
      <PageHeader eyebrow="News & Events" title="Photo News" description="Photo coverage of Ministry activities and events." />
      <section className="py-16">
        <Container>
          {items.length === 0 && <p className="max-w-xl text-ink-muted">There is no photo news to show yet. Photographs from Ministry events will appear here as they are published. In the meantime, see the latest <Link href={`${SITE_BASE_PATH}/news`} className="font-semibold text-cta underline underline-offset-2">news and press releases</Link>.</p>}
          <ScrollRevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ScrollRevealItem key={item.id}>
                <div className="overflow-hidden rounded-card border border-border shadow-card">
                  <NewsImageFrame src={getNewsImage(item)} alt={item.imageAlt ?? ""} aspect="aspect-[4/3]" />
                  <p className="p-4 text-sm font-medium text-ink">{item.title}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </section>
    </>
  );
}
