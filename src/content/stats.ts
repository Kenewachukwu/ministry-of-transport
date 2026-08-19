import type { Stat } from "./types";

/**
 * Fixes the live site's "stuck at 0" stat-counter bug — real figures
 * flagged for the ministry to confirm before launch.
 */
export const stats: Stat[] = [
  { id: "departments", value: 15, label: "Departments" },
  { id: "agencies", value: 2, label: "Agencies under the Ministry" },
  { id: "states-coordinated", value: 36, suffix: "+1 FCT", label: "States coordinated with" },
  { id: "nct-editions", value: 18, label: "Editions of the National Council on Transportation" },
];
