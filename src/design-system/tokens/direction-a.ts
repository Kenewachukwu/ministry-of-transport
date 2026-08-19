/**
 * Direction A — "Institutional" (CIA.gov-inspired). Mirrors the
 * `[data-direction="a"]` block in globals.css. Kept as a JS reference for
 * the /design-system showcase route and any motion configs that need the
 * raw values rather than a CSS variable.
 */
export const directionATokens = {
  id: "a",
  label: "Institutional",
  colors: {
    surface: "#f5f3ee",
    surfaceRaised: "#ffffff",
    surfaceInverse: "#0b1524",
    ink: "#0b1524",
    inkMuted: "#45566b",
    border: "#d8d3c6",
    cta: "#007d53",
  },
  fonts: {
    display: "Source Serif 4",
    body: "Public Sans",
  },
  radius: {
    card: "2px",
    control: "4px",
  },
} as const;
