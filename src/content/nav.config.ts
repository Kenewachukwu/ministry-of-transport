import type { NavItem } from "./types";

/**
 * Single source of nav truth, consumed by the header, mobile drawer, sitemap
 * and the home page's topic directory. Internal paths are relative to the
 * site root (`/direction-a`) — consumers prefix them; `external: true` links
 * are absolute URLs and must NOT be prefixed.
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

/**
 * External correspondence system (formerly labelled "eCMS Portal"). One
 * constant so the URL can change in a single place — as of Oct 2026 this host
 * does not yet resolve in DNS; the Ministry asked for it to be wired anyway.
 */
export const ECMS_URL = "https://federalministryoftransportation-ecms.schulltech.com/";

/** Header call-to-action, beside the PEBEC link. */
export const extCorresNav: NavItem = {
  label: "Ext. Corres.",
  href: ECMS_URL,
  external: true,
};

export const pebecNav: NavItem = {
  label: "PEBEC",
  href: "https://www.pebec.gov.ng/reportgov-ng",
  external: true,
};

/** Top-bar "Staff Portal" link (a page of links to the systems staff use; it is not a sign-in). */
export const staffPortalNav: NavItem = {
  label: "Staff Portal",
  href: "/portal",
};
