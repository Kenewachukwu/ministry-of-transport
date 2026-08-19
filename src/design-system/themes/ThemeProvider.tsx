import type { ReactNode } from "react";
import type { Direction } from "@/design-system/tokens";

/**
 * The entire A/B visual-direction mechanism hinges on this one attribute.
 * `globals.css` scopes every semantic color/font/radius token under
 * `[data-direction="a"]` / `[data-direction="b"]`, so a shared component
 * (Button, Card, …) styled with `bg-cta` or `font-display` resolves to a
 * different value purely from where it sits in the DOM — no per-component
 * branching needed.
 */
export function ThemeProvider({
  direction,
  children,
}: {
  direction: Direction;
  children: ReactNode;
}) {
  return (
    <div
      data-direction={direction}
      className="flex min-h-screen flex-col bg-surface text-ink font-body"
    >
      {children}
    </div>
  );
}
