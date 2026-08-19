/**
 * Soft two-layer wave transition from the hero's light gradient into
 * whatever section follows (driven by `fill="currentColor"`, so a parent
 * sets the target color via a text-* class — no hardcoded color here).
 */
export function WaveDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,80 C240,20 480,20 720,55 C960,90 1200,110 1440,60 L1440,140 L0,140 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M0,95 C280,140 560,50 840,75 C1080,96 1260,130 1440,90 L1440,140 L0,140 Z"
        fill="currentColor"
      />
    </svg>
  );
}
