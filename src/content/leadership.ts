import type { LeadershipPerson } from "./types";

/**
 * CMS-shaped, not hardcoded prose — per the client's decision, kept as-is
 * from the live site with a governance trail (`sourceNote`,
 * `lastVerifiedDate`) rather than baked into JSX, because public reports of
 * a possible 2026 resignation are unresolved and the ministry's own site is
 * currently self-inconsistent about this. Incomplete director entries on
 * the live site ("DLS", "DFA") are kept as honest placeholders — never
 * invent a name.
 */
export const leadership: LeadershipPerson[] = [
  {
    id: "minister",
    role: "minister",
    name: "Sen. Sa'idu Ahmed Alkali",
    title: "Honourable Minister of Transportation",
    photoUrl: "/images/sourced/minister-alkali.jpeg",
    isPlaceholder: false,
    lastVerifiedDate: "2026-08-18",
    sourceNote:
      "Per the live site's Leadership Team page as of Aug 2026. Note: the site's own /about/ page currently shows a blank minister field, and unresolved April 2026 press reports state a resignation to contest the Gombe State governorship. Confirm with the ministry before this goes live.",
    bio: [
      { label: "Born", value: "February 12, 1969 — Gombe State" },
      {
        label: "Prior roles",
        value:
          "Secretary, Muslim Pilgrims Welfare Board; Commissioner of Information, Gombe State; Senator for Gombe North (2011, re-elected 2019)",
      },
      { label: "Honorary title", value: "Sarkin Gabas Dukku" },
      { label: "Appointed", value: "August 16, 2023" },
    ],
  },
  {
    id: "minister-of-state",
    role: "director",
    name: null,
    placeholderLabel: "Minister of State",
    title: "Honourable Minister of State for Transportation",
    isPlaceholder: true,
    lastVerifiedDate: "2026-08-18",
    sourceNote: "Live site shows this bio page as under construction — no name populated.",
  },
  {
    id: "permanent-secretary",
    role: "permanent-secretary",
    name: "Engr. Olufunso Adebiyi, FNSE",
    title: "Permanent Secretary",
    isPlaceholder: false,
    lastVerifiedDate: "2026-08-24",
    sourceNote:
      "Per the live site's Leadership Team page as of Aug 2026. No photo exists anywhere on the live site (his dedicated bio page is marked \"Under Construction\") — do not substitute a stock photo for a specific named individual; leave as a placeholder-safe portrait until the ministry supplies one.",
  },
  {
    id: "dir-road-transport",
    role: "director",
    name: "Mrs. Cynthia Akhidenor",
    title: "Deputy Director, overseeing Road Transport & Mass Transit Administration",
    isPlaceholder: false,
  },
  {
    id: "dir-rail",
    role: "director",
    name: "Finbarr James Zirra",
    title: "Director, Rail Transport Service",
    isPlaceholder: false,
  },
  {
    id: "dir-tpc",
    role: "director",
    name: "Mrs. Asogu Faith",
    title: "Director, Transport Planning & Coordination",
    isPlaceholder: false,
  },
  {
    id: "dir-special-duties",
    role: "director",
    name: "Dr. (Mrs) Vivian Nwosu",
    title: "Director, Special Duties",
    isPlaceholder: false,
  },
  {
    id: "dir-hrm",
    role: "director",
    name: "Shelbwala Ibrahim",
    title: "Director, Human Resources Management",
    isPlaceholder: false,
  },
  {
    id: "dir-procurement",
    role: "director",
    name: "Magaji A. Saidu",
    title: "Deputy Director, overseeing Procurement",
    isPlaceholder: false,
  },
  {
    id: "dir-reform",
    role: "director",
    name: "Mukhtar Iliyasu Umar",
    title: "Director, Reform Coordination & Service Improvement",
    isPlaceholder: false,
  },
  {
    id: "dir-general-services",
    role: "director",
    name: "Ladan Ibrahim Idris",
    title: "Director, General Services",
    isPlaceholder: false,
  },
  {
    id: "dir-internal-audit",
    role: "director",
    name: null,
    title: "Deputy Director, Internal Audit",
    isPlaceholder: true,
    sourceNote: "Unnamed on the live site's Leadership Team page.",
  },
  {
    id: "dir-legal",
    role: "director",
    name: null,
    placeholderLabel: "DLS",
    title: "Director, Legal Services",
    isPlaceholder: true,
    sourceNote: "Live site shows only the placeholder acronym \"DLS\", no name.",
  },
  {
    id: "dir-ppp",
    role: "director",
    name: "Bernard Uche Alaeto",
    title: "Head, Public Private Partnership Unit",
    isPlaceholder: false,
  },
  {
    id: "dir-finance",
    role: "director",
    name: null,
    placeholderLabel: "DFA",
    title: "Director, Finance & Accounts",
    isPlaceholder: true,
    sourceNote: "Live site shows only the placeholder acronym \"DFA\", no name.",
  },
  {
    id: "dir-survey",
    role: "director",
    name: "Surveyor Jaiyesinmi Adekunle",
    title: "Assistant Director, overseeing Survey & Hydrographics",
    isPlaceholder: false,
  },
  {
    id: "dir-press",
    role: "director",
    name: "Mrs. Janet McDickson",
    title: "Director, Press & Public Relations",
    isPlaceholder: false,
  },
];

export const welcomeMessage = {
  signOff: "Sen. Sa'idu Ahmed Alkali",
  title: "Honourable Minister of Transportation",
  photoUrl: "/images/sourced/minister-alkali.jpeg",
  body: [
    "Welcome to the Federal Ministry of Transportation. Our mandate is to build a transport system Nigerians can rely on — safe, efficient, and connected across road and rail.",
    "We are committed to modernising the sector's infrastructure, strengthening the institutions under our purview, and working closely with our stakeholders across all 36 states to deliver a transport network that supports the nation's economic growth.",
  ],
};
