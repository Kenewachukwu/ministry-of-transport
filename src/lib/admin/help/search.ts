import { HELP_AREAS, type HelpArea, type HelpGuide } from "./types";

export { HELP_AREAS };

export const AREA_ORDER: HelpArea[] = ["start", "content", "media", "publishing", "people", "problems"];

/** What the search box needs from each guide, small enough to send to the browser. */
export interface GuideIndexEntry {
  slug: string;
  title: string;
  summary: string;
  area: HelpArea;
  audience: HelpGuide["audience"];
  /** Is it about something this person can do? */
  mine: boolean;
  time?: string;
  /** Lower-case text to search. */
  haystack: string;
}

/**
 * Every word the person typed must appear somewhere in the guide; guides whose
 * title matches rank first. An empty search returns everything unchanged.
 */
export function searchEntries<T extends { title: string; haystack: string }>(entries: T[], query: string): T[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return entries;
  const hits = entries.filter((e) => words.every((w) => e.haystack.includes(w)));
  const inTitle = (e: T) => words.every((w) => e.title.toLowerCase().includes(w));
  return [...hits.filter(inTitle), ...hits.filter((e) => !inTitle(e))];
}
