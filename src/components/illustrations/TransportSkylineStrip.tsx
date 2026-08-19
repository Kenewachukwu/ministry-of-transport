"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/design-system/motion/useReducedMotion";

/**
 * Original flat-illustration strip for Direction B's hero base — adapted
 * from Lagos State's landmark-skyline pattern, but drawn from transport
 * iconography (road, rail, port, airport, BRT) instead of literal
 * landmarks, since this is a federal transport ministry, not a state
 * government. Pure inline SVG — no external assets, no licensing concerns.
 */
export function TransportSkylineStrip({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const pieces = [
    { key: "road", delay: 0 },
    { key: "rail", delay: 0.08 },
    { key: "port", delay: 0.16 },
    { key: "airport", delay: 0.24 },
    { key: "brt", delay: 0.32 },
  ];

  return (
    <svg
      viewBox="0 0 1200 160"
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustration of Nigerian transport infrastructure: road, rail, port, airport and bus rapid transit"
    >
      <motion.g
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: pieces[0].delay, duration: 0.6, ease: "easeOut" }}
      >
        {/* Road */}
        <rect x="0" y="128" width="240" height="32" fill="currentColor" opacity="0.9" />
        <rect x="20" y="140" width="24" height="6" rx="3" fill="white" opacity="0.7" />
        <rect x="60" y="140" width="24" height="6" rx="3" fill="white" opacity="0.7" />
        <rect x="100" y="140" width="24" height="6" rx="3" fill="white" opacity="0.7" />
      </motion.g>

      <motion.g
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: pieces[1].delay, duration: 0.6, ease: "easeOut" }}
      >
        {/* Rail line + train */}
        <rect x="230" y="150" width="260" height="4" fill="currentColor" opacity="0.5" />
        <rect x="260" y="112" width="120" height="38" rx="6" fill="currentColor" />
        <rect x="270" y="120" width="20" height="16" rx="2" fill="white" opacity="0.85" />
        <rect x="298" y="120" width="20" height="16" rx="2" fill="white" opacity="0.85" />
        <rect x="326" y="120" width="20" height="16" rx="2" fill="white" opacity="0.85" />
        <circle cx="275" cy="152" r="7" fill="currentColor" />
        <circle cx="365" cy="152" r="7" fill="currentColor" />
      </motion.g>

      <motion.g
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: pieces[2].delay, duration: 0.6, ease: "easeOut" }}
      >
        {/* Port crane + ship */}
        <rect x="520" y="60" width="6" height="70" fill="currentColor" opacity="0.85" />
        <rect x="480" y="58" width="90" height="6" fill="currentColor" opacity="0.85" />
        <rect x="500" y="64" width="4" height="30" fill="currentColor" opacity="0.6" />
        <path d="M470 150 L480 128 H620 L630 150 Z" fill="currentColor" />
        <rect x="500" y="112" width="20" height="16" rx="2" fill="white" opacity="0.8" />
        <rect x="528" y="112" width="20" height="16" rx="2" fill="white" opacity="0.8" />
        <rect x="556" y="112" width="20" height="16" rx="2" fill="white" opacity="0.8" />
      </motion.g>

      <motion.g
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: pieces[3].delay, duration: 0.6, ease: "easeOut" }}
      >
        {/* Airport control tower + plane (simple, recognizable side-view silhouette) */}
        <rect x="760" y="80" width="14" height="60" fill="currentColor" opacity="0.85" />
        <rect x="748" y="64" width="38" height="20" rx="4" fill="currentColor" />
        <g transform="translate(860,120) rotate(-8)">
          <path
            d="M0 0 L100 0 L112 4 L100 8 L0 8 L-14 -10 L-6 -10 L4 0 Z M46 8 L36 24 L44 24 L54 8 Z M46 0 L36 -16 L44 -16 L54 0 Z"
            fill="currentColor"
            opacity="0.9"
          />
        </g>
      </motion.g>

      <motion.g
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: pieces[4].delay, duration: 0.6, ease: "easeOut" }}
      >
        {/* BRT bus */}
        <rect x="1000" y="104" width="160" height="46" rx="8" fill="currentColor" />
        <rect x="1014" y="114" width="26" height="18" rx="2" fill="white" opacity="0.85" />
        <rect x="1048" y="114" width="26" height="18" rx="2" fill="white" opacity="0.85" />
        <rect x="1082" y="114" width="26" height="18" rx="2" fill="white" opacity="0.85" />
        <rect x="1116" y="114" width="26" height="18" rx="2" fill="white" opacity="0.85" />
        <circle cx="1024" cy="154" r="8" fill="currentColor" />
        <circle cx="1136" cy="154" r="8" fill="currentColor" />
        <rect x="990" y="150" width="180" height="4" fill="currentColor" opacity="0.4" />
      </motion.g>
    </svg>
  );
}
