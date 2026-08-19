import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Text({
  as = "p",
  muted = false,
  size = "base",
  children,
  className,
}: {
  as?: ElementType;
  muted?: boolean;
  size?: "sm" | "base" | "lg";
  children: ReactNode;
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-body",
        muted ? "text-ink-muted" : "text-ink",
        size === "sm" && "text-sm",
        size === "base" && "text-base leading-relaxed",
        size === "lg" && "text-lg leading-relaxed",
        className
      )}
    >
      {children}
    </Tag>
  );
}
