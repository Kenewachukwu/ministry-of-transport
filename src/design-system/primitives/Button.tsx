import type { ButtonHTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "outline-brand";
type Size = "sm" | "md" | "lg";

/**
 * Every variant has distinct hover and pressed (`active:`) states. The lift is
 * `motion-safe:` so reduced-motion users get the colour change without movement.
 * `outline` is for dark backgrounds (white border); `outline-brand` for light ones.
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cta text-cta-ink shadow-card hover:bg-brand-600 hover:shadow-lg motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-700 active:shadow-card",
  secondary:
    "bg-surface-raised text-ink border border-border hover:border-cta hover:text-cta hover:shadow-card motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-50",
  ghost: "text-ink hover:text-cta hover:bg-brand-50 active:bg-brand-100",
  outline:
    "bg-transparent text-cta-ink border border-current hover:bg-white/15 motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:bg-white/25",
  "outline-brand":
    "bg-transparent text-cta border border-cta hover:bg-cta hover:text-cta-ink hover:shadow-card motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-700 active:text-cta-ink",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes}>
      {children}
    </NextLink>
  );
}
