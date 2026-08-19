import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  display: "text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight",
  h1: "text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight",
  h2: "text-2xl sm:text-3xl leading-tight tracking-tight",
  h3: "text-xl sm:text-2xl leading-snug",
  h4: "text-lg sm:text-xl leading-snug",
  label: "text-sm uppercase tracking-[0.16em]",
} as const;

export function Heading({
  as = "h2",
  size = "h2",
  children,
  className,
  eyebrow,
}: {
  as?: ElementType;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
  eyebrow?: boolean;
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-display font-semibold text-ink",
        eyebrow && "text-cta",
        sizes[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
