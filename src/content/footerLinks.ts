import type { FooterLinkColumn } from "./types";

export const footerColumns: FooterLinkColumn[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "About", href: "/about" },
      { label: "Departments", href: "/about/departments" },
      { label: "Resources", href: "/resources" },
      { label: "News & Events", href: "/news" },
      { label: "E-Services", href: "/e-services" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "eCMS Portal", href: "/portal/login" },
      { label: "FCSSIP 25", href: "/fcssip-25" },
    ],
  },
];

/**
 * Net-new vs. the current site, which has none of these — flagged for
 * ministry sign-off, per the plan's explicit "include everything necessary
 * for regulations/compliance" requirement.
 */
export const complianceLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Accessibility Statement", href: "/accessibility-statement" },
  { label: "Freedom of Information (FOI)", href: "/foi" },
  { label: "Sitemap", href: "/sitemap" },
];
