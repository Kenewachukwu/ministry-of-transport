import type { ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

/**
 * A text link with an animated underline (grows from 0 to full width on
 * hover, pure CSS so it stays out of the JS bundle). Used for CIA-style
 * "soft" chevron links and generic in-copy links alike.
 */
export function InlineLink({
  href,
  children,
  className,
  chevron = false,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  chevron?: boolean;
  external?: boolean;
}) {
  const classes = cn(
    "group relative inline-flex items-center gap-1 font-semibold text-link",
    className
  );

  const content = (
    <>
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
      {chevron && (
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes}>
      {content}
    </NextLink>
  );
}
