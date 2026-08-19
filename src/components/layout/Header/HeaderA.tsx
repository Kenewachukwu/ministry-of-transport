"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navConfig, portalNav } from "@/content/nav.config";
import { useHeroMode } from "@/design-system/themes/HeroModeContext";
import { Logo } from "./Logo";
import { NavDropdown } from "./NavDropdown";
import { MobileNav } from "./MobileNav";

/**
 * Institutional header — flat nav (no mega-menu, depth pushed into hub
 * pages), fades to solid on scroll (CIA.gov pattern). Transparent-over-hero
 * only when the current page renders a <DarkHeroFlag /> (currently just the
 * homepage) — every inner page defaults to solid.
 *
 * Always `fixed` with a CONSTANT height (h-8 utility bar on lg+ + h-20 main
 * row) rather than a height that changes on scroll — a fixed header with a
 * shifting height needs a matching spacer that also shifts, which is fragile.
 * `HeroA` cancels the layout's compensating padding-top with a matching
 * negative margin so the hero still sits flush at the very top.
 */
export function HeaderA({ basePath }: { basePath: string }) {
  const transparentOverHero = useHeroMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !transparentOverHero;
  const inverse = transparentOverHero && !scrolled;

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-colors duration-300", solid ? "border-b border-border bg-surface-raised" : "bg-transparent")}>
      <div className={cn("hidden h-8 items-center justify-end gap-6 px-4 text-xs sm:px-6 lg:flex lg:px-8", solid ? "border-b border-border text-ink-muted" : "text-white/70")}>
        <Link href={`${basePath}/contact`} className="py-2 hover:text-cta">Contact</Link>
        <Link href={`${basePath}${portalNav.href}`} className="py-2 hover:text-cta">Staff Portal</Link>
      </div>

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo basePath={basePath} inverse={inverse} />

        <nav className="hidden items-center gap-7 lg:flex">
          {navConfig.map((item) => (
            <NavDropdown key={item.label} item={item} basePath={basePath} variant="flat" inverse={inverse} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href={`${basePath}${portalNav.href}`}
            className="rounded-control bg-cta px-4 py-2 text-sm font-semibold text-cta-ink transition-opacity hover:opacity-90"
          >
            {portalNav.label}
          </Link>
        </div>

        <MobileNav items={navConfig} basePath={basePath} inverse={inverse} />
      </div>
    </header>
  );
}
