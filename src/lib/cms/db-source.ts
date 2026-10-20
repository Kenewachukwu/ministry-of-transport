import "server-only";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { appMeta, departments, eServices, heroSlides, leadership, newsItems, pageBlocks, pillars, resources, siteText } from "@/db/schema";
import type { Department, DocumentCategory, FcssipBlock, LeadershipPerson, NewsItem } from "@/content/types";
import { mandate as fallbackMandate, vision as fallbackVision, mission as fallbackMission } from "@/content/mandate";
import { siteMeta as fallbackSiteMeta } from "@/content/siteMeta";
import { isBuildPhase } from "@/lib/env";
import { cachedRead, TAG } from "./cache";
import type { ContentSource } from "./types";

type NewsRow = typeof newsItems.$inferSelect;

const WORDS_PER_MINUTE = 200;

/** Also used by the admin's "Preview", so a draft is shown through exactly the code the public site uses. */
export function toNewsItem(row: NewsRow): NewsItem {
  const body = row.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.kind === "photo_news" ? "Photo News" : row.isPressRelease ? "Press Release" : "Online News Report",
    excerpt: row.excerpt,
    body,
    date: row.itemDate,
    imageQuery: "",
    imageUrl: row.imageUrl ?? undefined,
    imageAlt: row.imageAlt ?? undefined,
    gallery: row.gallery?.length ? row.gallery : undefined,
    readTimeMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    featured: row.featured,
  };
}

const readSiteText = cachedRead("siteText", TAG.siteText, async () => {
  const db = await getDb();
  const rows = await db.select().from(siteText);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    mandate: map.get("mandate") ?? fallbackMandate,
    vision: map.get("vision") ?? fallbackVision,
    mission: map.get("mission") ?? fallbackMission,
  };
});

/** Saved contact details override the defaults one by one; an empty value hides that item (a phone, a social link). */
const readSiteMeta = cachedRead("siteMeta", TAG.contact, async () => {
  const db = await getDb();
  const rows = await db.select().from(siteText);
  const map = new Map(rows.map((r) => [r.key, r.value.trim()]));
  const pick = (key: string, fallback: string): string => (map.has(key) ? (map.get(key) as string) : fallback);
  const social = fallbackSiteMeta.social;
  return {
    ...fallbackSiteMeta,
    address: pick("contact.address", fallbackSiteMeta.address) || fallbackSiteMeta.address,
    hours: pick("contact.hours", fallbackSiteMeta.hours) || fallbackSiteMeta.hours,
    phone: pick("contact.phone", fallbackSiteMeta.phone ?? "") || null,
    email: pick("contact.email", fallbackSiteMeta.email) || fallbackSiteMeta.email,
    social: {
      x: pick("social.x", social.x),
      instagram: pick("social.instagram", social.instagram),
      facebook: pick("social.facebook", social.facebook),
      youtube: pick("social.youtube", social.youtube),
    },
  };
});

const readHero = cachedRead("hero", TAG.hero, async () => {
  const db = await getDb();
  const rows = await db.select().from(heroSlides).where(eq(heroSlides.status, "published")).orderBy(asc(heroSlides.sortOrder));
  return rows.map((r) => ({
    eyebrow: r.eyebrow,
    headline: r.headline,
    body: r.body,
    linkLabel: r.ctaLabel,
    linkHref: r.ctaHref,
    imageAlt: r.imageAlt,
    imageSrc: r.imageUrl,
  }));
});

const readPillars = cachedRead("pillars", TAG.pillars, async () => {
  const db = await getDb();
  const rows = await db.select().from(pillars).where(eq(pillars.status, "published")).orderBy(asc(pillars.sortOrder));
  return rows.map((r) => ({ id: r.id, title: r.title, description: r.description, kpis: r.kpis }));
});

const readNews = cachedRead("news", TAG.news, async () => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(newsItems)
    .where(and(eq(newsItems.status, "published"), inArray(newsItems.kind, ["online_news", "photo_news"])))
    .orderBy(desc(newsItems.itemDate), desc(newsItems.createdAt));
  return rows.map(toNewsItem);
});

const readEvents = cachedRead("events", TAG.news, async () => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(newsItems)
    .where(and(eq(newsItems.status, "published"), eq(newsItems.kind, "event")))
    .orderBy(desc(newsItems.itemDate), desc(newsItems.createdAt));
  return rows.map((r) => ({ id: r.slug, title: r.title, date: r.itemDate, location: r.location ?? "", summary: r.excerpt }));
});

export function toDepartment(r: typeof departments.$inferSelect): Department {
  return {
    id: r.slug,
    name: r.name,
    summary: r.summary,
    description: r.description,
    sections: r.sections,
    photoUrl: r.photoUrl ?? undefined,
  };
}

export function toLeader(r: typeof leadership.$inferSelect): LeadershipPerson {
  return {
    id: r.slug,
    role: r.tier,
    name: r.name,
    placeholderLabel: r.placeholderLabel ?? undefined,
    title: r.title,
    photoUrl: r.photoUrl ?? undefined,
    bio: r.bio.length ? r.bio : undefined,
    isPlaceholder: r.name === null,
    lastVerifiedDate: r.lastVerifiedDate ?? undefined,
    sourceNote: r.internalNote ?? undefined,
  };
}

const readDepartments = cachedRead("departments", TAG.departments, async () => {
  const db = await getDb();
  const rows = await db.select().from(departments).where(eq(departments.status, "published")).orderBy(asc(departments.sortOrder));
  return rows.map(toDepartment);
});

const readLeadership = cachedRead("leadership", TAG.leadership, async () => {
  const db = await getDb();
  const rows = await db.select().from(leadership).where(eq(leadership.status, "published")).orderBy(asc(leadership.sortOrder));
  return rows.map(toLeader);
});

const readEServices = cachedRead("eServices", TAG.eServices, async () => {
  const db = await getDb();
  const rows = await db.select().from(eServices).where(eq(eServices.status, "published")).orderBy(asc(eServices.sortOrder));
  return rows.map((r) => ({ id: r.id, name: r.name, description: r.description, href: r.href }));
});

const readResources = cachedRead("resources", TAG.resources, async () => {
  const db = await getDb();
  const rows = await db.select().from(resources).where(eq(resources.status, "published")).orderBy(asc(resources.sortOrder));
  const toDoc = (r: (typeof rows)[number]) => ({ id: r.id, title: r.title, category: r.category as DocumentCategory, href: r.href });
  return {
    documents: rows.filter((r) => r.kind === "document").map(toDoc),
    nct: rows.filter((r) => r.kind === "nct_communique").map(toDoc),
  };
});

const readFcssip = cachedRead("fcssip", TAG.fcssip, async () => {
  const db = await getDb();
  const [text, blocks] = await Promise.all([
    db.select().from(siteText),
    db
      .select()
      .from(pageBlocks)
      .where(and(eq(pageBlocks.page, "fcssip"), eq(pageBlocks.status, "published")))
      .orderBy(asc(pageBlocks.sortOrder)),
  ]);
  const map = new Map(text.map((r) => [r.key, r.value]));
  return {
    eyebrow: map.get("fcssip.eyebrow") ?? "",
    title: map.get("fcssip.title") ?? "FCSSIP 25",
    description: map.get("fcssip.description") ?? "",
    blocks: blocks.map((b) => ({ type: b.type, ...b.data }) as FcssipBlock),
  };
});

export const dbSource: ContentSource = {
  siteText: readSiteText,
  siteMeta: readSiteMeta,
  heroSlides: readHero,
  pillars: readPillars,
  news: readNews,
  events: readEvents,
  departments: readDepartments,
  leadership: readLeadership,
  documents: async () => (await readResources()).documents,
  nctCommuniques: async () => (await readResources()).nct,
  eServices: readEServices,
  fcssip: readFcssip,
};

let seeded = false;

/**
 * The database source, or `null` when the site should serve static content:
 * the database exists but hasn't been seeded yet (so adding DATABASE_URL never
 * blanks the site), or — only while `next build` is running — it can't be
 * reached. At runtime a database failure is thrown, not hidden: Next then keeps
 * serving the last good cached page instead of caching a degraded one.
 */
export async function getDbSource(): Promise<ContentSource | null> {
  try {
    if (!seeded) {
      const db = await getDb();
      const rows = await db.select().from(appMeta).where(eq(appMeta.key, "seeded_at"));
      if (rows.length === 0) return null;
      seeded = true;
    }
    return dbSource;
  } catch (error) {
    if (isBuildPhase()) return null;
    throw error;
  }
}
