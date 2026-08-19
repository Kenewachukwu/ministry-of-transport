import type { NavItem } from "./types";

/**
 * Single source of nav truth, consumed by both HeaderA and HeaderB (and the
 * footer's Quick Links column). Paths are relative to a direction root —
 * the Header component prefixes them with `/direction-a` or `/direction-b`.
 * Mirrors the current site's full nav 1:1 so nothing is silently dropped.
 */
export const navConfig: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Leadership", href: "/about/leadership" },
      { label: "Departments", href: "/about/departments" },
      { label: "Structure", href: "/about/structure" },
      { label: "Code of Ethics", href: "/about/code-of-ethics" },
      { label: "Agencies", href: "/about/agencies" },
      { label: "Stakeholders", href: "/about/stakeholders" },
    ],
  },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "Events", href: "/news/events" },
      { label: "Photo News", href: "/news/photo-news" },
      { label: "Online News Sector", href: "/news/online-news-sector" },
      {
        label: "OHCSF",
        href: "https://ohcsf.gov.ng",
        external: true,
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [{ label: "NCT Communique", href: "/resources/nct-communique" }],
  },
  { label: "E-Services", href: "/e-services" },
  { label: "FCSSIP 25", href: "/fcssip-25" },
  { label: "Contact", href: "/contact" },
];

export const portalNav: NavItem = {
  label: "eCMS Portal",
  href: "/portal/login",
};
