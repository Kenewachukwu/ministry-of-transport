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
    isPlaceholder: false,
    lastVerifiedDate: "2026-08-29",
    sourceNote:
      "Bio details and photo removed at KO's request, 2026-08-29 — name and title remain, shown with a placeholder-safe portrait like the Permanent Secretary. Note: the live site's own /about/ page currently shows a blank minister field, and unresolved April 2026 press reports state a resignation to contest the Gombe State governorship.",
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
    lastVerifiedDate: "2026-08-29",
    sourceNote:
      "Name per the live site's Leadership Team page as of Aug 2026 (his dedicated bio page there is marked \"Under Construction\" and has never carried a photo). A portrait was supplied by the client on 2026-08-26, but the Permanent Secretary has since asked not to have his photo shown — reverted to a placeholder-safe portrait at his request, 2026-08-29.",
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
