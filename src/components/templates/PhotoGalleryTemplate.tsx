import Image from "next/image";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { getNewsImage } from "@/lib/newsImage";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import type { NewsItem } from "@/content/types";

/** Fixes the live site's Photo News page, which currently throws a WordPress critical error. */
export function PhotoGalleryTemplate({ items }: { items: NewsItem[] }) {
  return (
    <>
      <PageHeader eyebrow="News & Events" title="Photo News" description="Photo coverage of Ministry activities and events." />
      <section className="py-16">
        <Container>
          <ScrollRevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ScrollRevealItem key={item.id}>
                <div className="overflow-hidden rounded-card border border-border shadow-card">
                  <div className="aspect-[4/3]">
                    <Image
                      src={getNewsImage(item)}
                      alt=""
                      width={560}
                      height={420}
                      className="h-full w-full object-cover"
                    />
                  </div>
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
