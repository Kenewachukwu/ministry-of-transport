import type { ReactNode } from "react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";

export function StaticContentTemplate({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="py-16">
        <Container size="narrow">
          <div className="flex flex-col gap-5 text-ink-muted [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
