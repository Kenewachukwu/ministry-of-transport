import type {
  Department,
  DocumentItem,
  EService,
  EventItem,
  FcssipPage,
  HeroSlide,
  LeadershipPerson,
  NewsItem,
  Pillar,
} from "@/content/types";

/** A news item as list components need it: no article body (kept off the client). */
/** What list pages get: no article text and no gallery, so lists stay small. Both only reach the article page. */
export type NewsSummary = Omit<NewsItem, "body" | "gallery">;

/** Which news the page wants: Online News Sector, Photo News, or the whole newsroom. */
export type NewsFilter = "all" | "online" | "photo";

export interface SiteText {
  mandate: string;
  vision: string;
  mission: string;
}

/**
 * Everything the public site reads that the Ministry can edit. Two
 * implementations: the static content files (`static.ts`, always available)
 * and the database (`db-source.ts`, used when one is configured). Pages never
 * touch either directly — they go through `@/lib/cms`.
 */
export interface ContentSource {
  siteText(): Promise<SiteText>;
  heroSlides(): Promise<HeroSlide[]>;
  pillars(): Promise<Pillar[]>;
  /** Published online + photo news, newest first, WITH article bodies. */
  news(): Promise<NewsItem[]>;
  events(): Promise<EventItem[]>;
  departments(): Promise<Department[]>;
  leadership(): Promise<LeadershipPerson[]>;
  documents(): Promise<DocumentItem[]>;
  nctCommuniques(): Promise<DocumentItem[]>;
  eServices(): Promise<EService[]>;
  fcssip(): Promise<FcssipPage>;
}
