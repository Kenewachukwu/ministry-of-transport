import type { ReactNode } from "react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";

/**
 * Consistent inner-page title banner, reused by every hub/detail template
 * across both directions — themed automatically via the surface-inverse /
 * ink CSS tokens, no per-direction branching needed here.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-surface-inverse py-16 text-white sm:py-20">
      <Container>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-300">{eyebrow}</p>
        )}
        <Heading as="h1" size="h1" className="mt-3 text-white">
          {title}
        </Heading>
        {description && <p className="mt-4 max-w-2xl text-white/70">{description}</p>}
        {children}
      </Container>
    </section>
  );
}
