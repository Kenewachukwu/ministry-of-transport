import type { Section } from "@/lib/auth/permissions";

export interface NavEntry {
  href: string;
  label: string;
  /** Needed to see this entry (omit for entries everyone sees). */
  section?: Section;
  superAdminOnly?: boolean;
}

export const CONTENT_NAV: NavEntry[] = [
  { href: "/admin/hero", label: "Home page hero", section: "hero" },
  { href: "/admin/site-text", label: "Mandate, Mission & Vision", section: "site_text" },
  { href: "/admin/news", label: "News, Photo News & Events", section: "news" },
  { href: "/admin/departments", label: "Departments", section: "departments" },
  { href: "/admin/leadership", label: "Leadership", section: "leadership" },
  { href: "/admin/road-ahead", label: "The Road Ahead", section: "road_ahead" },
  { href: "/admin/fcssip", label: "FCSSIP 25 page", section: "fcssip" },
  { href: "/admin/e-services", label: "E-Services", section: "e_services" },
  { href: "/admin/resources", label: "Resources & documents", section: "resources" },
  { href: "/admin/contact", label: "Contact details & links", section: "contact" },
];

export const SYSTEM_NAV: NavEntry[] = [
  { href: "/admin/users", label: "Users & access", superAdminOnly: true },
  { href: "/admin/audit", label: "Activity log", superAdminOnly: true },
  { href: "/admin/status", label: "System status", superAdminOnly: true },
];
