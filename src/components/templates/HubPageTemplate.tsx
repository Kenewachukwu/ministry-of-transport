import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { CardGrid, type CardGridItem } from "@/components/sections/CardGrid";
import { mandate } from "@/content/mandate";

export function HubPageTemplate({
  basePath,
  links,
}: {
  basePath: string;
  links: CardGridItem[];
}) {
  return (
    <>
      <PageHeader eyebrow="Federal Ministry of Transportation" title="About Us" description={mandate} />
      <section className="py-16">
        <Container>
          <CardGrid
            items={links.map((l) => ({ ...l, href: l.href ? `${basePath}${l.href}` : undefined }))}
            columns={3}
          />
        </Container>
      </section>
    </>
  );
}
