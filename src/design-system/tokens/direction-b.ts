/**
 * Direction B — "Modern Civic" (Lagos State-inspired). Mirrors the
 * `[data-direction="b"]` block in globals.css.
 */
export const directionBTokens = {
  id: "b",
  label: "Modern Civic",
  colors: {
    surface: "#fafaf7",
    surfaceRaised: "#ffffff",
    surfaceInverse: "#073321",
    ink: "#111827",
    inkMuted: "#4b5563",
    border: "#e5e1d8",
    cta: "#007d53",
    secondary: "#0ea5e9",
    accentAmber: "#fdb022",
    accentCoral: "#f2703c",
  },
  fonts: {
    display: "Sora",
    body: "Inter",
  },
  radius: {
    card: "12px",
    control: "9999px",
  },
} as const;
