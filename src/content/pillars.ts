import type { Pillar } from "./types";

/**
 * Adapted from fmmbe.gov.ng's "The Road Ahead" pillar-cards pattern
 * (bullet KPIs + target years), mapped onto this ministry's own Key Goals.
 * Placeholder KPI figures — flagged for the ministry to confirm real targets.
 */
export const pillars: Pillar[] = [
  {
    id: "safe-secure",
    title: "Safe and Secure Transportation",
    description:
      "Strengthening safety standards across road and rail to protect the travelling public.",
    kpis: [
      { label: "Reduce rail incident rate year-on-year", targetYear: "2027" },
      { label: "Nationwide road-rail crossing safety audit", targetYear: "2026" },
    ],
  },
  {
    id: "economic-development",
    title: "Drive Economic Development",
    description:
      "Positioning transport infrastructure as a driver of trade, industry, and job creation.",
    kpis: [
      { label: "Expand freight rail capacity", targetYear: "2028" },
      { label: "Reduce logistics cost as % of GDP", targetYear: "2030" },
    ],
  },
  {
    id: "connectivity",
    title: "Facilitate Connectivity",
    description: "Building an integrated, intermodal and multimodal transport network.",
    kpis: [
      { label: "New intermodal terminals commissioned", targetYear: "2027" },
      { label: "Rail network extension (km)", targetYear: "2029" },
    ],
  },
  {
    id: "local-capacity",
    title: "Develop Local Capacity",
    description: "Growing professionalism and technical capability within the sector's workforce.",
    kpis: [
      { label: "NITT graduate placement rate", targetYear: "2026" },
      { label: "Local content in rail maintenance", targetYear: "2028" },
    ],
  },
];
