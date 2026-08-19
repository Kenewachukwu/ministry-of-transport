import type { ReactNode } from "react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";

export function StaticContentTemplate({
  eyebrow,
  title,
  description,
  children,
  pendingNotice,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  /** Shown for the net-new compliance pages, which need real ministry sign-off. */
  pendingNotice?: boolean;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="py-16">
        <Container size="narrow">
          {pendingNotice && (
            <div className="mb-8 rounded-card border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-800">
              This page is a structural placeholder pending real copy and sign-off from the Ministry.
            </div>
          )}
          <div className="flex flex-col gap-5 text-ink-muted [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
