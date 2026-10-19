import type { ContentSource } from "./types";
import { mandate, vision, mission } from "@/content/mandate";
import { heroSlides } from "@/content/hero";
import { pillars } from "@/content/pillars";
import { news } from "@/content/news";
import { events } from "@/content/events";
import { departments } from "@/content/departments";
import { leadership } from "@/content/leadership";
import { documents, nctCommuniques } from "@/content/documents";
import { eServices } from "@/content/eServices";
import { fcssipPage } from "@/content/fcssip";
import { siteMeta } from "@/content/siteMeta";

const byDateDesc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));

/** The content files in `src/content/` — the always-available fallback. */
export const staticSource: ContentSource = {
  siteText: async () => ({ mandate, vision, mission }),
  siteMeta: async () => siteMeta,
  heroSlides: async () => heroSlides,
  pillars: async () => pillars,
  news: async () => byDateDesc(news),
  events: async () => byDateDesc(events),
  departments: async () => departments,
  leadership: async () => leadership,
  documents: async () => documents,
  nctCommuniques: async () => nctCommuniques,
  eServices: async () => eServices,
  fcssip: async () => fcssipPage,
};
