import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

/**
 * Stands in for real photography until Task 9 (sourcing real ministry
 * photos from official social handles) lands. Deliberately never a broken
 * <img> reference — the current live site has several of those.
 */
export function PlaceholderPhoto({
  label,
  className,
  tone = "brand",
}: {
  label: string;
  className?: string;
  tone?: "brand" | "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        tone === "brand" && "bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900",
        tone === "dark" && "bg-gradient-to-br from-surface-inverse via-ink to-black",
        tone === "light" && "bg-gradient-to-br from-border via-surface to-surface-raised",
        className
      )}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
        <defs>
          <pattern id={`grid-${label.replace(/\s+/g, "-")}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="1" className="text-white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${label.replace(/\s+/g, "-")})`} />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center text-white/70">
        <ImageIcon size={28} aria-hidden />
        <span className="text-xs font-medium uppercase tracking-[0.14em]">{label}</span>
      </div>
    </div>
  );
}
