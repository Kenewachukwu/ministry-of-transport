import "server-only";
import { departments, leadership, newsItems } from "@/db/schema";
import type { Department, LeadershipPerson, NewsItem } from "@/content/types";
import { toDepartment, toLeader, toNewsItem } from "@/lib/cms/db-source";
import type { EntityDef, Row } from "./registry";
import { effectiveRow } from "./workflow";

/** Which content has a page of its own on the website, and so can be previewed. */
export const PREVIEWABLE = new Set(["news", "departments", "leadership"]);

export type PreviewModel =
  | { kind: "news"; item: NewsItem }
  | { kind: "department"; department: Department }
  | { kind: "leader"; person: LeadershipPerson };

/**
 * What the item will look like on the website once published: its proposed values
 * laid over the live ones, mapped through the SAME functions the public site uses
 * to read the database, so a preview cannot drift from the real thing.
 * Returns null for content that is not a page of its own (a hero slide, an event).
 */
export function previewModel(def: EntityDef, row: Row): PreviewModel | null {
  const shown = effectiveRow(row);
  if (def.key === "news") {
    if (shown.kind === "event") return null; // events appear in a list, not on a page of their own
    return { kind: "news", item: toNewsItem(shown as typeof newsItems.$inferSelect) };
  }
  if (def.key === "departments") return { kind: "department", department: toDepartment(shown as typeof departments.$inferSelect) };
  if (def.key === "leadership") return { kind: "leader", person: toLeader(shown as typeof leadership.$inferSelect) };
  return null;
}
