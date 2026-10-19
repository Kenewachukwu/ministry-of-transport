import type { Pillar } from "./types";

/**
 * The Ministry's four key goals, in the layout of fmmbe.gov.ng's "The Road
 * Ahead". The targets (`kpis`) are deliberately empty: earlier figures were
 * placeholders, and a government site must not publish commitments the Ministry
 * has not made. Add real, confirmed targets through the admin (or here) and
 * they appear under each goal automatically.
 */
export const pillars: Pillar[] = [
  {
    id: "safe-secure",
    title: "Safe and Secure Transportation",
    description:
      "Strengthening safety standards across road and rail to protect the travelling public.",
    kpis: [],
  },
  {
    id: "economic-development",
    title: "Drive Economic Development",
    description:
      "Positioning transport infrastructure as a driver of trade, industry, and job creation.",
    kpis: [],
  },
  {
    id: "connectivity",
    title: "Facilitate Connectivity",
    description: "Building an integrated, intermodal and multimodal transport network.",
    kpis: [],
  },
  {
    id: "local-capacity",
    title: "Develop Local Capacity",
    description: "Growing professionalism and technical capability within the sector's workforce.",
    kpis: [],
  },
];
