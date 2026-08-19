import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { CardGrid, type CardGridItem } from "@/components/sections/CardGrid";

/**
 * Generic directory listing, reused for Departments and Agencies (and any
 * future flat card-listing page) across both directions.
 */
export function DirectoryTemplate({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: CardGridItem[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="py-16">
        <Container>
          <CardGrid items={items} columns={columns} />
        </Container>
      </section>
    </>
  );
}
