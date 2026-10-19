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

/** A titled block on a department page ("Structure", "Functions", "Mandate"…). */
export interface DepartmentSection {
  heading: string;
  /** Optional lead-in sentence shown above the list. */
  note?: string;
  items: string[];
}

export interface Department {
  /** Stable id, also used as the page slug (`/about/departments/[id]`). */
  id: string;
  name: string;
  /** One-line blurb for cards and listings. */
  summary: string;
  /** Intro paragraphs for the department page (falls back to `summary`). */
  description: string[];
  /** Structure / functions / mandate, in display order. */
  sections: DepartmentSection[];
  /** Card and page-banner image (decorative: the page heading names the department). */
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

/** The Ministry's public contact details and social links. Empty strings mean "not set" and are hidden on the site. */
export interface SiteMeta {
  name: string;
  shortName: string;
  country: string;
  address: string;
  hours: string;
  /** Hidden while empty. */
  phone: string | null;
  email: string;
  social: { x: string; instagram: string; facebook: string; youtube: string };
}

export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

/** A photograph shown in an article's gallery. `alt` describes the picture; `caption` is the visible line under it. */
export interface NewsPhoto {
  src: string;
  alt: string;
  caption?: string;
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
  /** What the cover picture shows, for screen readers. Empty means the picture is decorative. */
  imageAlt?: string;
  /** More photographs for the article page, shown below the text. */
  gallery?: NewsPhoto[];
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

/** One slide of the home-page hero carousel. */
export interface HeroSlide {
  eyebrow: string;
  headline: string;
  body: string;
  /** Call-to-action label and target (site-relative path or absolute URL). */
  linkLabel: string;
  linkHref: string;
  imageAlt: string;
  imageSrc: string;
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

/** One block of the FCSSIP 25 page, in display order. Consecutive `link` blocks render as one list. */
export type FcssipBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "link"; label: string; href: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
      /** "medium" centres the image at a reduced width. */
      size: "full" | "medium";
    };

export interface FcssipPage {
  eyebrow: string;
  title: string;
  description: string;
  blocks: FcssipBlock[];
}
