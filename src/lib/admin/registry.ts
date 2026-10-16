import { eq, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import { departments, eServices, heroSlides, leadership, newsItems, pageBlocks, pillars, resources } from "@/db/schema";
import { documentCategories } from "@/content/documents";
import type { CacheTag } from "@/lib/cms/cache";
import { TAG } from "@/lib/cms/cache";
import type { Section } from "@/lib/auth/permissions";
import { isAllowedLink, isAllowedMediaUrl } from "@/lib/storage/validate";
import type { FieldDef, FieldValues } from "./fields";

export type Row = Record<string, unknown>;
type Columns = Record<string, PgColumn>;

/**
 * One entry per kind of content the admin can edit. Everything generic — the
 * list page, the create/edit forms, archive/restore, re-ordering — is driven
 * from these definitions (see src/lib/dal/admin/crud.ts and the [entity]
 * routes), so adding a kind of content means describing it here.
 */
export interface EntityDef {
  /** URL segment: /admin/<key> */
  key: string;
  section: Section;
  singular: string;
  plural: string;
  description: string;
  table: PgTable;
  /** Public-site cache tag(s) to expire after any change. */
  tags: CacheTag[];
  orderable: boolean;
  /** Column shown as each row's title in lists (or `title` for something computed). */
  titleColumn: string;
  title?: (row: Row) => string;
  subtitle?: (row: Row) => string | null;
  fields: FieldDef[];
  /** Validates the parsed form values. Keys match column names unless `toRow` maps them. */
  schema: z.ZodType<FieldValues>;
  /** Restrict every query to a subset of the table (e.g. one page's blocks). */
  scope?: (cols: Columns) => SQL | undefined;
  /** Values applied to every new row (e.g. which page a block belongs to). */
  createDefaults?: Row;
  /** Optional filter shown above the list (news kind, resource kind). */
  filter?: { column: string; label: string; options: { value: string; label: string }[] };
  /** The last N published rows can't be archived (a carousel must never be empty). */
  minPublished?: number;
  /** Derives values that depend on the database (unique slugs). Runs on create only. */
  prepareCreate?: (values: FieldValues, helpers: { slugExists: (slug: string) => Promise<boolean> }) => Promise<FieldValues>;
  /** Validated form values → column values. */
  toRow?: (values: FieldValues) => Row;
  /** Stored row → form values. */
  fromRow?: (row: Row) => Row;
  publicPath?: (row: Row) => string | null;
}

/* ---------- validation building blocks -------------------------------------------------------------- */

const required = (max: number) => z.string().trim().min(1, "This field is required.").max(max, `Keep this under ${max} characters.`);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((v) => (v === "" ? null : v));
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.");
const optionalDate = z.union([z.literal(""), dateString]).transform((v) => (v === "" ? null : v));
const mediaMessage = "Use the Upload button, or a picture link from Unsplash or Pexels.";
const mediaUrl = z.string().trim().min(1, "A picture is required.").refine(isAllowedMediaUrl, mediaMessage);
const optionalMedia = z
  .union([z.literal(""), z.string().trim().refine(isAllowedMediaUrl, mediaMessage)])
  .transform((v) => (v === "" ? null : v));
const link = z.string().trim().min(1, "Enter a link.").refine(isAllowedLink, "Use a site path like /about, or a full https:// link.");

/* ---------- the entities ---------------------------------------------------------------------------- */

const heroDef: EntityDef = {
  key: "hero",
  section: "hero",
  singular: "slide",
  plural: "Hero slides",
  description: "The slides in the carousel at the top of the home page. They rotate in the order shown here.",
  table: heroSlides,
  tags: [TAG.hero],
  orderable: true,
  titleColumn: "headline",
  subtitle: (r) => String(r.eyebrow ?? ""),
  minPublished: 1,
  fields: [
    { kind: "text", name: "eyebrow", label: "Small heading above the title", required: true, maxLength: 120 },
    { kind: "text", name: "headline", label: "Main heading (h1)", required: true, maxLength: 200 },
    { kind: "textarea", name: "body", label: "Paragraph", required: true, rows: 3, maxLength: 400 },
    { kind: "text", name: "ctaLabel", label: "Button / link text", required: true, maxLength: 60 },
    { kind: "text", name: "ctaHref", label: "Where the link goes", required: true, help: "A page on this site such as /about/departments, or a full https:// link." },
    { kind: "image", name: "imageUrl", label: "Background picture", required: true, altName: "imageAlt", help: "Landscape pictures at least 1600 pixels wide look best." },
    { kind: "text", name: "imageAlt", label: "Picture description (for screen readers)", required: true, maxLength: 200 },
  ],
  schema: z.object({
    eyebrow: required(120),
    headline: required(200),
    body: required(400),
    ctaLabel: required(60),
    ctaHref: link,
    imageUrl: mediaUrl,
    imageAlt: required(200),
  }),
};

const NEWS_KINDS = [
  { value: "online_news", label: "Online news (Online News Sector)" },
  { value: "photo_news", label: "Photo news" },
  { value: "event", label: "Event" },
];

const newsDef: EntityDef = {
  key: "news",
  section: "news",
  singular: "item",
  plural: "News, Photo News & Events",
  description: "Online news, photo news and events share one list. Choose the kind when you create an item; it decides which public page it appears on.",
  table: newsItems,
  tags: [TAG.news],
  orderable: false,
  titleColumn: "title",
  subtitle: (r) => `${NEWS_KINDS.find((k) => k.value === r.kind)?.label ?? ""} · ${String(r.itemDate ?? "")}`,
  filter: { column: "kind", label: "Kind", options: NEWS_KINDS },
  fields: [
    { kind: "select", name: "kind", label: "Kind", options: NEWS_KINDS, required: true },
    { kind: "text", name: "title", label: "Title", required: true, maxLength: 200 },
    { kind: "text", name: "itemDate", label: "Date", inputType: "date", required: true, help: "Publication date, or the date of the event." },
    { kind: "checkbox", name: "isPressRelease", label: "This is a press release", help: "Shown as “Press Release” instead of “Online News Report”.", showWhen: { field: "kind", in: ["online_news"] } },
    { kind: "text", name: "location", label: "Location", maxLength: 120, showWhen: { field: "kind", in: ["event"] } },
    { kind: "textarea", name: "excerpt", label: "Short summary", required: true, rows: 3, maxLength: 400, help: "Shown on cards and lists." },
    { kind: "textarea", name: "body", label: "Full text", rows: 12, maxLength: 20000, help: "Separate paragraphs with a blank line. Plain text only.", showWhen: { field: "kind", in: ["online_news", "photo_news"] } },
    { kind: "image", name: "imageUrl", label: "Picture", altName: "imageAlt", help: "Shown in full on cards. Leave empty to use the standard picture for this kind." },
    { kind: "text", name: "imageAlt", label: "Picture description (for screen readers)", maxLength: 200 },
    { kind: "checkbox", name: "featured", label: "Feature this item", showWhen: { field: "kind", in: ["online_news", "photo_news"] } },
  ],
  schema: z.object({
    kind: z.enum(["online_news", "photo_news", "event"]),
    title: required(200),
    itemDate: dateString,
    isPressRelease: z.boolean(),
    location: optional(120),
    excerpt: required(400),
    body: z.string().trim().max(20000, "Keep this under 20,000 characters."),
    imageUrl: optionalMedia,
    imageAlt: optional(200),
    featured: z.boolean(),
  }),
  prepareCreate: async (values, { slugExists }) => {
    const { slugify, uniqueSlug } = await import("./slug");
    return { ...values, slug: await uniqueSlug(slugify(String(values.title)), slugExists) };
  },
  toRow: (v) => ({ ...v, isPressRelease: v.kind === "online_news" ? v.isPressRelease : false, featured: v.kind === "event" ? false : v.featured }),
  publicPath: (r) => (r.kind === "event" ? "/direction-a/news/events" : `/direction-a/news/${String(r.slug)}`),
};

const departmentsDef: EntityDef = {
  key: "departments",
  section: "departments",
  singular: "department",
  plural: "Departments",
  description: "The Ministry's departments and units, in the order they appear on the website.",
  table: departments,
  tags: [TAG.departments],
  orderable: true,
  titleColumn: "name",
  subtitle: (r) => String(r.summary ?? ""),
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, maxLength: 120 },
    { kind: "textarea", name: "summary", label: "Short description", required: true, rows: 2, maxLength: 300, help: "One or two sentences, shown on department cards." },
    { kind: "paragraphs", name: "description", label: "Introduction", rows: 6, help: "Separate paragraphs with a blank line." },
    { kind: "sections", name: "sections", label: "Structure, functions and mandate", help: "Each block has a heading (for example “Structure” or “Functions”), an optional lead-in sentence, and a list with one item per line." },
    { kind: "image", name: "photoUrl", label: "Picture", help: "Used on the department's card and at the top of its page." },
  ],
  schema: z.object({
    name: required(120),
    summary: required(300),
    description: z.array(z.string().trim().min(1).max(3000)).max(20),
    sections: z
      .array(
        z.object({
          heading: required(120),
          note: z
            .string()
            .trim()
            .max(600)
            .optional()
            .transform((v) => v || undefined),
          items: z.array(z.string().trim().min(1).max(1500)).max(200),
        })
      )
      .max(30),
    photoUrl: optionalMedia,
  }),
  prepareCreate: async (values, { slugExists }) => {
    const { slugify, uniqueSlug } = await import("./slug");
    return { ...values, slug: await uniqueSlug(slugify(String(values.name)), slugExists) };
  },
  publicPath: (r) => `/direction-a/about/departments/${String(r.slug)}`,
};

const leadershipDef: EntityDef = {
  key: "leadership",
  section: "leadership",
  singular: "leader",
  plural: "Leadership",
  description: "The Minister, Permanent Secretary and directors. Leave the name empty to show a placeholder until it is confirmed.",
  table: leadership,
  tags: [TAG.leadership],
  orderable: true,
  titleColumn: "title",
  subtitle: (r) => (r.name ? String(r.name) : "Name to be announced"),
  fields: [
    {
      kind: "select",
      name: "tier",
      label: "Role group",
      required: true,
      options: [
        { value: "minister", label: "Minister (featured)" },
        { value: "permanent-secretary", label: "Permanent Secretary (featured)" },
        { value: "director", label: "Director / other" },
      ],
    },
    { kind: "text", name: "title", label: "Title / position", required: true, maxLength: 160, help: "For example “Honourable Minister of Transportation”." },
    { kind: "text", name: "name", label: "Name", maxLength: 120, help: "Leave empty to show “Name to be announced”." },
    { kind: "text", name: "placeholderLabel", label: "Placeholder label", maxLength: 60, help: "Optional short label shown instead of a name in the directors list, for example “DLS”." },
    { kind: "image", name: "photoUrl", label: "Photo", help: "Optional. Without one, a branded placeholder portrait is shown." },
    { kind: "repeater", name: "bio", label: "Biography details", columns: [{ name: "label", label: "Label", placeholder: "Born" }, { name: "value", label: "Details", multiline: true }], addLabel: "Add a detail" },
    { kind: "textarea", name: "internalNote", label: "Internal note", rows: 2, maxLength: 1000, help: "For administrators only — never shown on the website." },
    { kind: "text", name: "lastVerifiedDate", label: "Last verified", inputType: "date" },
  ],
  schema: z.object({
    tier: z.enum(["minister", "permanent-secretary", "director"]),
    title: required(160),
    name: optional(120),
    placeholderLabel: optional(60),
    photoUrl: optionalMedia,
    bio: z.array(z.object({ label: required(60), value: required(1000) })).max(30),
    internalNote: optional(1000),
    lastVerifiedDate: optionalDate,
  }),
  prepareCreate: async (values, { slugExists }) => {
    const { slugify, uniqueSlug } = await import("./slug");
    return { ...values, slug: await uniqueSlug(slugify(String(values.title)), slugExists) };
  },
  publicPath: (r) => `/direction-a/about/leadership/${String(r.slug)}`,
};

const roadAheadDef: EntityDef = {
  key: "road-ahead",
  section: "road_ahead",
  singular: "goal",
  plural: "The Road Ahead",
  description: "The Ministry's key goals and their measurable targets, shown on the home page.",
  table: pillars,
  tags: [TAG.pillars],
  orderable: true,
  titleColumn: "title",
  subtitle: (r) => String(r.description ?? ""),
  fields: [
    { kind: "text", name: "title", label: "Goal", required: true, maxLength: 120 },
    { kind: "textarea", name: "description", label: "Description", required: true, rows: 3, maxLength: 600 },
    { kind: "repeater", name: "kpis", label: "Targets", columns: [{ name: "label", label: "Target", placeholder: "Expand freight rail capacity" }, { name: "targetYear", label: "Year", placeholder: "2028" }], addLabel: "Add a target" },
  ],
  schema: z.object({
    title: required(120),
    description: required(600),
    kpis: z.array(z.object({ label: required(200), targetYear: required(20) })).max(20),
  }),
  publicPath: () => "/direction-a",
};

const eServicesDef: EntityDef = {
  key: "e-services",
  section: "e_services",
  singular: "service",
  plural: "E-Services",
  description: "Online government services linked from the E-Services page and the footer.",
  table: eServices,
  tags: [TAG.eServices],
  orderable: true,
  titleColumn: "name",
  subtitle: (r) => String(r.href ?? ""),
  fields: [
    { kind: "text", name: "name", label: "Service name", required: true, maxLength: 120 },
    { kind: "textarea", name: "description", label: "Description", required: true, rows: 3, maxLength: 400 },
    { kind: "text", name: "href", label: "Link", required: true, inputType: "text", help: "A full https:// link to the service." },
  ],
  schema: z.object({ name: required(120), description: required(400), href: link }),
  publicPath: () => "/direction-a/e-services",
};

const RESOURCE_KINDS = [
  { value: "document", label: "Document (Resources page)" },
  { value: "nct_communique", label: "NCT Communique" },
];

const resourcesDef: EntityDef = {
  key: "resources",
  section: "resources",
  singular: "document",
  plural: "Resources & documents",
  description: "Documents and communiques for download. Upload a file, or link to one hosted elsewhere.",
  table: resources,
  tags: [TAG.resources],
  orderable: true,
  titleColumn: "title",
  subtitle: (r) => `${String(r.category ?? "")}${r.href === "#" ? " · no file attached yet" : ""}`,
  filter: { column: "kind", label: "List", options: RESOURCE_KINDS },
  fields: [
    { kind: "select", name: "kind", label: "Appears in", options: RESOURCE_KINDS, required: true },
    { kind: "text", name: "title", label: "Title", required: true, maxLength: 300 },
    { kind: "select", name: "category", label: "Category", required: true, options: documentCategories.map((c) => ({ value: c, label: c })) },
    { kind: "file", name: "href", label: "File or link", help: "Upload a PDF, Word or Excel file, or paste a full https:// link." },
  ],
  schema: z.object({
    kind: z.enum(["document", "nct_communique"]),
    title: required(300),
    category: z.enum(documentCategories as unknown as [string, ...string[]]),
    href: link,
  }),
  publicPath: (r) => (r.kind === "nct_communique" ? "/direction-a/resources/nct-communique" : "/direction-a/resources"),
};

/* ---------- FCSSIP 25 page blocks ------------------------------------------------------------------ */

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph of text" },
  { value: "heading", label: "Heading" },
  { value: "link", label: "Link in a list" },
  { value: "image", label: "Picture" },
];

const fcssipBlocksDef: EntityDef = {
  key: "fcssip",
  section: "fcssip",
  singular: "block",
  plural: "FCSSIP 25 page",
  description: "The content of the FCSSIP 25 page, top to bottom. Links that sit next to each other appear together as one list.",
  table: pageBlocks,
  tags: [TAG.fcssip],
  orderable: true,
  titleColumn: "type",
  title: (row) => blockTitle(row),
  subtitle: (r) => BLOCK_TYPES.find((b) => b.value === r.type)?.label ?? String(r.type),
  scope: (cols) => eq(cols.page, "fcssip"),
  createDefaults: { page: "fcssip" },
  fields: [
    { kind: "select", name: "type", label: "Type of block", options: BLOCK_TYPES, required: true, lockAfterCreate: true },
    { kind: "textarea", name: "text", label: "Text", rows: 5, maxLength: 3000, showWhen: { field: "type", in: ["paragraph", "heading"] } },
    { kind: "text", name: "label", label: "Link text", maxLength: 160, showWhen: { field: "type", in: ["link"] } },
    { kind: "text", name: "href", label: "Link address", showWhen: { field: "type", in: ["link"] }, help: "A full https:// link, or a page on this site." },
    { kind: "image", name: "src", label: "Picture", showWhen: { field: "type", in: ["image"] } },
    { kind: "text", name: "alt", label: "Picture description (for screen readers)", maxLength: 300, showWhen: { field: "type", in: ["image"] } },
    { kind: "text", name: "caption", label: "Caption (optional)", maxLength: 300, showWhen: { field: "type", in: ["image"] } },
    { kind: "text", name: "width", label: "Picture width (pixels)", inputType: "number", showWhen: { field: "type", in: ["image"] }, help: "The picture's real width in pixels." },
    { kind: "text", name: "height", label: "Picture height (pixels)", inputType: "number", showWhen: { field: "type", in: ["image"] } },
    {
      kind: "select",
      name: "size",
      label: "Display size",
      options: [
        { value: "full", label: "Full width" },
        { value: "medium", label: "Medium, centred" },
      ],
      showWhen: { field: "type", in: ["image"] },
    },
  ],
  schema: z
    .object({
      type: z.enum(["paragraph", "heading", "link", "image"]),
      text: z.string().trim().max(3000),
      label: z.string().trim().max(160),
      href: z.string().trim(),
      src: z.string().trim(),
      alt: z.string().trim().max(300),
      caption: z.string().trim().max(300),
      width: z.string().trim(),
      height: z.string().trim(),
      size: z.enum(["full", "medium"]).catch("full"),
    })
    .superRefine((v, ctx) => {
      const need = (cond: boolean, path: string, message: string) => cond && ctx.addIssue({ code: "custom", path: [path], message });
      if (v.type === "paragraph" || v.type === "heading") need(!v.text, "text", "Enter the text.");
      if (v.type === "link") {
        need(!v.label, "label", "Enter the link text.");
        need(!isAllowedLink(v.href) || v.href === "#", "href", "Use a site path like /about, or a full https:// link.");
      }
      if (v.type === "image") {
        need(!isAllowedMediaUrl(v.src), "src", mediaMessage);
        need(!v.alt, "alt", "Describe the picture for screen readers.");
        need(!(Number(v.width) > 0), "width", "Enter the width in pixels.");
        need(!(Number(v.height) > 0), "height", "Enter the height in pixels.");
      }
    }),
  toRow: (v) => {
    const type = String(v.type);
    const data: Row =
      type === "paragraph" || type === "heading"
        ? { text: v.text }
        : type === "link"
          ? { label: v.label, href: v.href }
          : { src: v.src, alt: v.alt, ...(v.caption ? { caption: v.caption } : {}), width: Number(v.width), height: Number(v.height), size: v.size };
    return { type, data };
  },
  fromRow: (row) => ({ type: row.type, ...(row.data as Row) }),
  publicPath: () => "/direction-a/fcssip-25",
};

export const ENTITIES: EntityDef[] = [heroDef, newsDef, departmentsDef, leadershipDef, roadAheadDef, fcssipBlocksDef, eServicesDef, resourcesDef];

export function getEntity(key: string): EntityDef | undefined {
  return ENTITIES.find((e) => e.key === key);
}

/** Text shown as a block's title in lists. */
export function blockTitle(row: Row): string {
  const data = (row.data ?? {}) as Row;
  const first = String(data.text ?? data.label ?? data.alt ?? data.caption ?? "").trim();
  return first.length > 90 ? `${first.slice(0, 90)}…` : first || "(empty block)";
}

