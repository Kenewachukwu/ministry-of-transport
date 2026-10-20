import { can, type SessionUser } from "@/lib/auth/permissions";
import { contentGuides } from "./guides/content";
import { mediaGuides } from "./guides/media";
import { peopleGuides } from "./guides/people";
import { problemGuides } from "./guides/problems";
import { publishingGuides } from "./guides/publishing";
import { startGuides } from "./guides/start";
import type { GuideIndexEntry } from "./search";
import { HELP_AREAS, type HelpArea, type HelpGuide } from "./types";

export { GLOSSARY } from "./glossary";
export { AREA_ORDER, searchEntries, type GuideIndexEntry } from "./search";
export { HELP_AREAS, type HelpArea, type HelpGuide, type HelpStep } from "./types";

export const GUIDES: HelpGuide[] = [...startGuides, ...contentGuides, ...mediaGuides, ...publishingGuides, ...peopleGuides, ...problemGuides];

export function getGuide(slug: string): HelpGuide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

type Person = Pick<SessionUser, "role" | "permissions">;

/** Is this guide about something this person can do? (Everyone may still read every guide.) */
export function isForPerson(person: Person, guide: HelpGuide): boolean {
  if (guide.audience === "everyone") return true;
  if (guide.audience === "super_admin") return person.role === "super_admin";
  return can(person, guide.audience);
}

/**
 * The person's own guides first (everything they can do), then the rest.
 * Others stay readable: an editor benefits from knowing what a super
 * administrator does, and a super administrator from what an editor sees.
 */
export function splitGuides(person: Person): { mine: HelpGuide[]; others: HelpGuide[] } {
  const mine: HelpGuide[] = [];
  const others: HelpGuide[] = [];
  for (const guide of GUIDES) (isForPerson(person, guide) ? mine : others).push(guide);
  return { mine, others };
}

/** Plain text of a guide, with the quote marks around labels removed, for searching. */
export function guideText(guide: HelpGuide): string {
  const parts = [
    guide.title,
    guide.summary,
    ...guide.steps.flatMap((s) => [s.text, s.detail ?? ""]),
    ...(guide.tips ?? []),
    ...(guide.problems ?? []).flatMap((p) => [p.q, p.a]),
  ];
  return parts.join(" ").replace(/[“”]/g, "").toLowerCase();
}

export function toIndexEntry(guide: HelpGuide, mine: boolean): GuideIndexEntry {
  return { slug: guide.slug, title: guide.title, summary: guide.summary, area: guide.area, audience: guide.audience, mine, time: guide.time, haystack: guideText(guide) };
}

export function areaTitle(area: HelpArea): string {
  return HELP_AREAS[area].title;
}

/** The guide that explains each content section, used for the "Help with this page" link. */
export const ENTITY_GUIDE: Record<string, string> = {
  hero: "change-a-hero-slide",
  news: "publish-a-news-story",
  departments: "add-or-edit-a-department",
  leadership: "update-a-leader",
  "road-ahead": "edit-the-road-ahead",
  fcssip: "edit-the-fcssip-page",
  "e-services": "add-or-edit-an-e-service",
  resources: "publish-a-document",
};

/** And for the pages that are not content lists. */
export const PAGE_GUIDE: Record<string, string> = {
  "/admin": "finding-your-way-around",
  "/admin/site-text": "edit-mandate-mission-vision",
  "/admin/contact": "edit-contact-details",
  "/admin/users": "invite-someone",
  "/admin/audit": "read-the-activity-log",
  "/admin/status": "check-system-status",
  "/admin/review": "approve-or-return-work",
  "/admin/enquiries": "handle-enquiries",
  "/admin/enquiries/settings": "set-where-enquiries-go",
  "/admin/account": "change-your-password",
};
