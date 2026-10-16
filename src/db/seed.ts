import { sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { Db } from "./client";
import {
  appMeta,
  departments,
  eServices,
  heroSlides,
  leadership,
  newsItems,
  pageBlocks,
  pillars,
  resources,
  siteText,
} from "./schema";
import { mandate, vision, mission } from "../content/mandate";
import { heroSlides as heroContent } from "../content/hero";
import { pillars as pillarContent } from "../content/pillars";
import { news as newsContent } from "../content/news";
import { events as eventContent } from "../content/events";
import { departments as departmentContent } from "../content/departments";
import { leadership as leadershipContent } from "../content/leadership";
import { documents as documentContent, nctCommuniques } from "../content/documents";
import { eServices as eServiceContent } from "../content/eServices";
import { fcssipPage } from "../content/fcssip";

const STEP = 10; // gaps between sort_order values leave room to insert without renumbering

async function isEmpty(db: Pick<Db, "select">, table: PgTable): Promise<boolean> {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(table);
  return (row?.n ?? 0) === 0;
}

/**
 * Loads the site's existing content into an empty database. Each table is
 * seeded ONLY if it has no rows, so re-running never overwrites or duplicates
 * what the Ministry has since edited. `seeded_at` is written last: until it
 * exists, the public site keeps serving the static content files.
 */
export async function seedIfEmpty(db: Db) {
  await db.transaction(async (tx) => {
    if (await isEmpty(tx, siteText)) {
      await tx.insert(siteText).values([
        { key: "mandate", value: mandate },
        { key: "vision", value: vision },
        { key: "mission", value: mission },
        { key: "fcssip.eyebrow", value: fcssipPage.eyebrow },
        { key: "fcssip.title", value: fcssipPage.title },
        { key: "fcssip.description", value: fcssipPage.description },
      ]);
    }

    if (await isEmpty(tx, heroSlides)) {
      await tx.insert(heroSlides).values(
        heroContent.map((s, i) => ({
          sortOrder: (i + 1) * STEP,
          eyebrow: s.eyebrow,
          headline: s.headline,
          body: s.body,
          ctaLabel: s.linkLabel,
          ctaHref: s.linkHref,
          imageUrl: s.imageSrc,
          imageAlt: s.imageAlt,
        }))
      );
    }

    if (await isEmpty(tx, pillars)) {
      await tx.insert(pillars).values(
        pillarContent.map((p, i) => ({ sortOrder: (i + 1) * STEP, title: p.title, description: p.description, kpis: p.kpis }))
      );
    }

    if (await isEmpty(tx, newsItems)) {
      await tx.insert(newsItems).values([
        ...newsContent.map((n) => ({
          slug: n.slug,
          kind: n.category === "Photo News" ? ("photo_news" as const) : ("online_news" as const),
          isPressRelease: n.category === "Press Release",
          title: n.title,
          excerpt: n.excerpt,
          body: n.body.join("\n\n"),
          itemDate: n.date,
          imageUrl: n.imageUrl ?? null,
          featured: n.featured ?? false,
        })),
        ...eventContent.map((e) => ({
          slug: e.id,
          kind: "event" as const,
          title: e.title,
          excerpt: e.summary,
          itemDate: e.date,
          location: e.location,
        })),
      ]);
    }

    if (await isEmpty(tx, departments)) {
      await tx.insert(departments).values(
        departmentContent.map((d, i) => ({
          sortOrder: (i + 1) * STEP,
          slug: d.id,
          name: d.name,
          summary: d.summary,
          description: d.description,
          sections: d.sections,
          photoUrl: d.photoUrl ?? null,
        }))
      );
    }

    if (await isEmpty(tx, leadership)) {
      await tx.insert(leadership).values(
        leadershipContent.map((p, i) => ({
          sortOrder: (i + 1) * STEP,
          slug: p.id,
          tier: p.role,
          name: p.name,
          placeholderLabel: p.placeholderLabel ?? null,
          title: p.title,
          photoUrl: p.photoUrl ?? null,
          bio: p.bio ?? [],
          internalNote: p.sourceNote ?? null,
          lastVerifiedDate: p.lastVerifiedDate ?? null,
        }))
      );
    }

    if (await isEmpty(tx, eServices)) {
      await tx.insert(eServices).values(
        eServiceContent.map((s, i) => ({ sortOrder: (i + 1) * STEP, name: s.name, description: s.description, href: s.href }))
      );
    }

    if (await isEmpty(tx, resources)) {
      await tx.insert(resources).values([
        ...documentContent.map((d, i) => ({ sortOrder: (i + 1) * STEP, kind: "document" as const, title: d.title, category: d.category, href: d.href })),
        ...nctCommuniques.map((d, i) => ({ sortOrder: (i + 1) * STEP, kind: "nct_communique" as const, title: d.title, category: d.category, href: d.href })),
      ]);
    }

    if (await isEmpty(tx, pageBlocks)) {
      await tx.insert(pageBlocks).values(
        fcssipPage.blocks.map((block, i) => {
          const { type, ...data } = block;
          return { sortOrder: (i + 1) * STEP, page: "fcssip", type, data: data as Record<string, unknown> };
        })
      );
    }

    await tx.insert(appMeta).values({ key: "seeded_at", value: new Date().toISOString() }).onConflictDoNothing();
  });
}
