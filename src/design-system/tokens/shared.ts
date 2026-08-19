/**
 * Token values mirrored from src/app/globals.css for use in JS/TS (motion
 * durations, easing curves). The CSS custom properties are the source of
 * truth for anything rendered — this file exists only where a token needs
 * to be read by JavaScript (e.g. `motion` transition configs).
 */

export const brand = {
  50: "#e6f5ef",
  100: "#c0e8d8",
  200: "#96d9be",
  300: "#67c79f",
  400: "#3aae83",
  500: "#007d53",
  600: "#026b47",
  700: "#04573a",
  800: "#06432d",
  900: "#073321",
} as const;

export const motionDuration = {
  micro: 0.15,
  standard: 0.3,
  emphasis: 0.5,
} as const;

export const easeStandard = [0.16, 1, 0.3, 1] as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
