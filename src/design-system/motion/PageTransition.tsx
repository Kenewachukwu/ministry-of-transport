"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Enter-only fade, on a plain element with a CSS `animation` — not a
 * Framer Motion `motion.div`. Framer Motion's JS-driven `initial`→`animate`
 * transition was tried first (both with and without AnimatePresence) and
 * reliably got stuck at its `initial` (invisible) state after a Next.js
 * client-side route change in production, breaking navigation. A CSS
 * `animation` runs on the style engine as soon as the element exists — no
 * React effect or rAF callback has to fire first — so it can't get stuck
 * hidden the same way. `prefers-reduced-motion` already neutralizes it
 * globally (see globals.css), and if it somehow fails to fire at all, the
 * element still renders at its default (visible) opacity.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <div key={pathname} className="animate-count-fade">
      {children}
    </div>
  );
}
