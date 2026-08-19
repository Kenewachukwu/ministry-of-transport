"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/**
 * Central gate for the "disable non-essential motion" accessibility rule
 * (WCAG 2.2 SC 2.3.3). Wraps motion's own hook so every consumer imports
 * from one place — if the gating strategy ever changes, it changes here.
 */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
