import { boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { contentColumns, orderColumn } from "./_shared";
import type { DepartmentSection } from "../../content/types";

export const newsKind = pgEnum("news_kind", ["online_news", "photo_news", "event"]);
export const leaderTier = pgEnum("leader_tier", ["minister", "permanent-secretary", "director"]);
export const resourceKind = pgEnum("resource_kind", ["document", "nct_communique"]);

/** Singleton text: mandate / vision / mission and the FCSSIP page header strings. */
export const siteText = pgTable("site_text", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});

/** Home-page hero carousel. */
export const heroSlides = pgTable(
  "hero_slides",
  {
    ...contentColumns(),
    ...orderColumn(),
    eyebrow: text("eyebrow").notNull(),
    headline: text("headline").notNull(),
    body: text("body").notNull(),
    ctaLabel: text("cta_label").notNull(),
    /** Site-relative path ("/about") or absolute https URL. */
    ctaHref: text("cta_href").notNull(),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
  },
  (t) => [index("hero_slides_order_idx").on(t.status, t.sortOrder)]
);

/** Online news, photo news and events share one table, told apart by `kind`. */
export const newsItems = pgTable(
  "news_items",
  {
    ...contentColumns(),
    slug: text("slug").notNull().unique(),
    kind: newsKind("kind").notNull(),
    /** Online news only: shown as a "Press Release" rather than an "Online News Report". */
    isPressRelease: boolean("is_press_release").notNull().default(false),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    /** Plain text; paragraphs separated by a blank line. */
    body: text("body").notNull().default(""),
    /** Publication date (events: the date of the event). */
    itemDate: date("item_date", { mode: "string" }).notNull(),
    location: text("location"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    /** More pictures shown under the story: [{ src, alt, caption? }]. */
    gallery: jsonb("gallery").$type<{ src: string; alt: string; caption?: string }[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
  },
  (t) => [index("news_items_list_idx").on(t.status, t.kind, t.itemDate)]
);

export const departments = pgTable("departments", {
  ...contentColumns(),
  ...orderColumn(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  /** Introduction paragraphs. */
  description: jsonb("description").$type<string[]>().notNull().default([]),
  /** Structure / functions / mandate blocks. */
  sections: jsonb("sections").$type<DepartmentSection[]>().notNull().default([]),
  photoUrl: text("photo_url"),
});

export const leadership = pgTable("leadership", {
  ...contentColumns(),
  ...orderColumn(),
  slug: text("slug").notNull().unique(),
  tier: leaderTier("tier").notNull().default("director"),
  /** Null = placeholder: the post exists but no name is shown yet. Never invent a name. */
  name: text("name"),
  placeholderLabel: text("placeholder_label"),
  title: text("title").notNull(),
  photoUrl: text("photo_url"),
  bio: jsonb("bio").$type<{ label: string; value: string }[]>().notNull().default([]),
  /** Admin-only governance note; never rendered publicly. */
  internalNote: text("internal_note"),
  lastVerifiedDate: text("last_verified_date"),
});

/** "The Road Ahead": strategic pillars with their targets. */
export const pillars = pgTable("pillars", {
  ...contentColumns(),
  ...orderColumn(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  kpis: jsonb("kpis").$type<{ label: string; targetYear: string }[]>().notNull().default([]),
});

/** Blocks of free-form pages (currently the FCSSIP 25 page). */
export const pageBlocks = pgTable(
  "page_blocks",
  {
    ...contentColumns(),
    ...orderColumn(),
    page: text("page").notNull(),
    type: text("type").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  },
  (t) => [index("page_blocks_page_idx").on(t.page, t.status, t.sortOrder)]
);

export const eServices = pgTable("e_services", {
  ...contentColumns(),
  ...orderColumn(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  href: text("href").notNull(),
});

export const resources = pgTable("resources", {
  ...contentColumns(),
  ...orderColumn(),
  kind: resourceKind("kind").notNull().default("document"),
  title: text("title").notNull(),
  category: text("category").notNull(),
  /** Link or uploaded-file URL; "#" means no file has been attached yet. */
  href: text("href").notNull().default("#"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  contentType: text("content_type"),
});
