import "server-only";
import { inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteText } from "@/db/schema";

/**
 * Reads a group of site-text keys together with the time of the newest change
 * among them. The form carries that time as `loadedAt`; when saving, if the
 * group has changed since, someone else saved first and the save is refused
 * rather than silently overwriting their work (the same protection the
 * versioned content items have).
 */
export async function readSiteTextGroup(keys: string[]): Promise<{ values: Map<string, string>; loadedAt: string }> {
  const db = await getDb();
  const rows = await db.select().from(siteText).where(inArray(siteText.key, keys));
  const latest = rows.reduce((max, r) => Math.max(max, r.updatedAt.getTime()), 0);
  return { values: new Map(rows.map((r) => [r.key, r.value])), loadedAt: latest ? new Date(latest).toISOString() : "" };
}

/** Has the group been changed by someone since the form was loaded? (`loadedAt` "" means no rows existed then.) */
export function changedSince(loadedAt: string, currentLatest: string): boolean {
  if (!currentLatest) return false;
  if (!loadedAt) return true;
  return Date.parse(currentLatest) > Date.parse(loadedAt);
}
