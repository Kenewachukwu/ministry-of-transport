import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/design-system/motion/ScrollReveal";
import { InlineLink } from "@/design-system/primitives/Link";

/**
 * Direction A only — CIA.gov's repeating two-column "label + copy + CTA"
 * module. One flexible template, reused with alternating side and varied
 * copy, rather than a different component per section.
 */
export function EditorialModule({
  eyebrow,
  heading,
  children,
  linkLabel,
  linkHref,
  reversed = false,
  aside,
}: {
  eyebrow: string;
  heading: string;
  children: ReactNode;
  linkLabel?: string;
  linkHref?: string;
  reversed?: boolean;
  aside?: ReactNode;
}) {
  const label = (
    <div className="flex items-start gap-4">
      <span className="mt-1 h-full w-px shrink-0 bg-cta" aria-hidden />
      <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">{eyebrow}</p>
    </div>
  );

  const content = (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
      <div className="mt-4 max-w-2xl text-ink-muted">{children}</div>
      {linkLabel && linkHref && (
        <div className="mt-5">
          <InlineLink href={linkHref} chevron>
            {linkLabel}
          </InlineLink>
        </div>
      )}
      {aside && <div className="mt-6">{aside}</div>}
    </div>
  );

  return (
    <ScrollReveal>
      <div
        className={cn(
          "grid gap-10 lg:gap-16",
          reversed ? "lg:grid-cols-[1fr_minmax(0,280px)]" : "lg:grid-cols-[minmax(0,280px)_1fr]"
        )}
      >
        {reversed ? (
          <>
            {content}
            {label}
          </>
        ) : (
          <>
            {label}
            {content}
          </>
        )}
      </div>
    </ScrollReveal>
  );
}
