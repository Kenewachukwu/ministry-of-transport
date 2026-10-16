"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/content/types";

export function NavDropdown({
  item,
  basePath,
  variant,
  inverse = false,
}: {
  item: NavItem;
  basePath: string;
  variant: "flat" | "flyout";
  inverse?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  // Sliding underline on hover and keyboard focus, plus a focus ring, so the
  // active target is obvious beyond a subtle colour change.
  const navItemClasses = cn(
    "relative rounded-sm py-1 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
    inverse ? "text-white/85 hover:text-white focus-visible:text-white" : "text-ink hover:text-cta focus-visible:text-cta"
  );

  if (!item.children?.length) {
    return (
      <Link href={`${basePath}${item.href}`} className={navItemClasses}>
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={cn("flex items-center gap-1", navItemClasses)}
      >
        {item.label}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full left-1/2 z-40 -translate-x-1/2 pt-3",
            variant === "flyout" ? "w-[420px]" : "w-64"
          )}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div
            className={cn(
              "border border-border bg-surface-raised shadow-card",
              variant === "flyout" ? "rounded-card p-3" : "rounded-card py-2"
            )}
          >
            <ul
              className={cn(
                variant === "flyout" ? "grid grid-cols-2 gap-1" : "flex flex-col"
              )}
            >
              {item.children.map((child) => (
                <li key={child.href}>
                  {child.external ? (
                    <a
                      href={child.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "block px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface hover:text-cta focus-visible:bg-surface focus-visible:text-cta focus-visible:outline-none",
                        variant === "flyout" && "rounded-md"
                      )}
                    >
                      {child.label}
                    </a>
                  ) : (
                    <Link
                      href={`${basePath}${child.href}`}
                      className={cn(
                        "block px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface hover:text-cta focus-visible:bg-surface focus-visible:text-cta focus-visible:outline-none",
                        variant === "flyout" && "rounded-md"
                      )}
                    >
                      {child.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
