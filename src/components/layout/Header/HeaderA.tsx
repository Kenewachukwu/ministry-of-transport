"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navConfig, extCorresNav, pebecNav, staffPortalNav } from "@/content/nav.config";
import { useHeroMode } from "@/design-system/themes/HeroModeContext";
import { WavyGreenBg } from "@/design-system/primitives/WavyGreenBg";
import { ButtonLink } from "@/design-system/primitives/Button";
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

  // Utility-bar links: colour shift + sliding underline on hover AND keyboard
  // focus. Over the dark hero the hover colour is white (brand green on a dark
  // photo would lose contrast); on the solid bar it is the brand green.
  const utilityLink = cn(
    "relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
    solid ? "hover:text-cta focus-visible:text-cta" : "hover:text-white focus-visible:text-white"
  );

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-colors duration-300", solid ? "border-b border-border bg-surface-raised" : "bg-transparent")}>
      {solid && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <WavyGreenBg intensity="subtle" />
        </div>
      )}
      <div className={cn("hidden h-8 items-center justify-end gap-6 px-4 text-xs sm:px-6 lg:flex lg:px-8", solid ? "border-b border-border text-ink-muted" : "text-white/70")}>
        <Link href={`${basePath}/search`} className={utilityLink}>Search</Link>
        <Link href={`${basePath}/contact`} className={utilityLink}>Contact</Link>
        <Link href={`${basePath}${staffPortalNav.href}`} className={utilityLink}>{staffPortalNav.label}</Link>
      </div>

      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo basePath={basePath} inverse={inverse} />

        <nav className="hidden items-center gap-6 xl:flex">
          {navConfig.map((item) => (
            <NavDropdown key={item.label} item={item} basePath={basePath} variant="flat" inverse={inverse} />
          ))}
        </nav>

        {/* The full nav + two buttons need ~1,150px, so the drawer stays in use
            until the xl breakpoint. External links are absolute URLs: never
            prefixed with basePath. */}
        <div className="hidden items-center gap-2 xl:flex">
          <ButtonLink href={extCorresNav.href} external size="sm" className="border border-transparent px-3.5 py-2">
            {extCorresNav.label}
          </ButtonLink>
          <ButtonLink
            href={pebecNav.href}
            external
            variant="outline-brand"
            size="sm"
            className={cn("px-3.5 py-2", inverse && "border-white/70 text-white hover:border-white hover:bg-white hover:text-ink active:bg-white/90 active:text-ink")}
          >
            {pebecNav.label}
          </ButtonLink>
        </div>

        <MobileNav items={navConfig} basePath={basePath} inverse={inverse} />
      </div>
    </header>
  );
}
