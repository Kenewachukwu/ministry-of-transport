"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { navConfig, portalNav } from "@/content/nav.config";
import { siteMeta } from "@/content/siteMeta";
import { Logo } from "./Logo";
import { NavDropdown } from "./NavDropdown";
import { MobileNav } from "./MobileNav";

/**
 * Modern Civic header — nested flyout dropdowns, bright utility bar with a
 * hotline number up top (Lagos State pattern), pill-shaped CTA.
 */
export function HeaderB({ basePath }: { basePath: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface-raised shadow-sm">
      <div className="hidden items-center justify-between bg-brand-500 px-4 py-1.5 text-xs text-white sm:px-6 lg:flex lg:px-8">
        <a href="tel:+2348000000000" className="flex items-center gap-1.5 font-medium hover:opacity-90">
          <Phone size={12} aria-hidden />
          Transport Emergency Line: {siteMeta.phone}
        </a>
        <Link href={`${basePath}/e-services`} className="font-medium hover:opacity-90">
          Explore E-Services →
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo basePath={basePath} />

        <nav className="hidden items-center gap-2 lg:flex">
          {navConfig.map((item) => (
            <div key={item.label} className="rounded-control px-3 py-2 transition-colors hover:bg-surface">
              <NavDropdown item={item} basePath={basePath} variant="flyout" />
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href={`${basePath}${portalNav.href}`}
            className="rounded-control bg-cta px-5 py-2.5 text-sm font-semibold text-cta-ink shadow-card transition-transform hover:-translate-y-0.5"
          >
            {portalNav.label}
          </Link>
        </div>

        <MobileNav items={navConfig} basePath={basePath} />
      </div>
    </header>
  );
}
