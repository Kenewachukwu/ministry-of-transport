import type { Section } from "@/lib/auth/permissions";

export type HelpArea = "start" | "content" | "media" | "publishing" | "people" | "problems";

export const HELP_AREAS: Record<HelpArea, { title: string; blurb: string }> = {
  start: { title: "Getting started", blurb: "Signing in, finding your way around, and how changes reach the website." },
  content: { title: "Editing the website", blurb: "Step by step: each part of the website you can change." },
  media: { title: "Pictures and files", blurb: "Uploading, sizes, and describing pictures for people who cannot see them." },
  publishing: { title: "Publishing and organising", blurb: "Archiving, restoring and re-arranging what is on the website." },
  people: { title: "People and access", blurb: "For super administrators: inviting people and choosing what they can change." },
  problems: { title: "When something goes wrong", blurb: "Quick answers to the problems people run into most." },
};

export interface HelpStep {
  /** What to do. Write buttons, fields and menu items exactly as they appear, in curly quotes: “Save changes”. */
  text: string;
  /** Optional extra explanation shown under the step. */
  detail?: string;
  /** A shortcut straight to the screen the step is about. */
  link?: { label: string; href: string };
}

export interface HelpGuide {
  slug: string;
  title: string;
  /** One sentence: what this guide lets you do. */
  summary: string;
  area: HelpArea;
  /** Who needs it. `everyone`, a content section (people who can manage it see it first), or `super_admin`. */
  audience: "everyone" | "super_admin" | Section;
  /** How long the task usually takes. */
  time?: string;
  steps: HelpStep[];
  tips?: string[];
  problems?: { q: string; a: string }[];
  /** Slugs of related guides. */
  related?: string[];
  /** When someone last walked through the task and checked the wording (YYYY-MM-DD). */
  reviewed: string;
}

export interface GlossaryTerm {
  term: string;
  meaning: string;
}
