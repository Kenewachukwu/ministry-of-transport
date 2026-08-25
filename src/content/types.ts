/** Shared content types — the typed contract between data and templates. */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export interface LeadershipPerson {
  id: string;
  role: "minister" | "permanent-secretary" | "director";
  /** null = confirmed placeholder on the live site. Never invent a name. */
  name: string | null;
  /** e.g. "DLS", "DFA" — the literal placeholder shown on the live site. */
  placeholderLabel?: string;
  title: string;
  photoUrl?: string;
  bio?: { label: string; value: string }[];
  isPlaceholder: boolean;
  lastVerifiedDate?: string;
  sourceNote?: string;
}

export interface Department {
  id: string;
  name: string;
  summary: string;
  photoUrl?: string;
}

export interface Agency {
  id: string;
  name: string;
  shortName: string;
  description: string;
  href: string;
  photoUrl?: string;
}

export interface StakeholderGroup {
  category: "Federal MDAs" | "Professional Bodies" | "Unions" | "State MDAs";
  items: string[];
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  kpis: { label: string; targetYear: string }[];
}

export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: "Online News Report" | "Press Release" | "Photo News";
  excerpt: string;
  body: string[];
  date: string;
  imageQuery: string;
  /** Real photo for this specific item; falls back to a per-category default when absent. */
  imageUrl?: string;
  readTimeMinutes: number;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
}

export type DocumentCategory =
  | "Finance & Budget"
  | "International Agreements"
  | "International Convention & Protocols"
  | "Policies"
  | "Relevant Acts"
  | "Reports"
  | "Others";

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  href: string;
}

export interface EService {
  id: string;
  name: string;
  description: string;
  href: string;
}

export interface FooterLinkColumn {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}

export interface ImageManifestEntry {
  path: string;
  usage: string;
  source: "stock" | "illustration" | "official";
  sourceUrl?: string;
  license?: string;
  attribution?: string;
}
