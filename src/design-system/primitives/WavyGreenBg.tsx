"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function WavyGreenBg({
  className,
  intensity = "medium",
}: {
  className?: string;
  intensity?: "subtle" | "medium" | "bold";
}) {
  const raw = useId();
  const uid = "wg" + raw.replace(/[^a-zA-Z0-9]/g, "");

  const opacities = {
    subtle: [0.06, 0.04, 0.025],
    medium: [0.14, 0.09,  0.05],
    bold:   [0.24, 0.16,  0.09],
  };
  const [o1, o2, o3] = opacities[intensity];

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}a`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#007d53" stopOpacity={o1} />
          <stop offset="60%"  stopColor="#3aae83" stopOpacity={o1 * 0.3} />
          <stop offset="100%" stopColor="#c0e8d8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#026b47" stopOpacity={o2} />
          <stop offset="55%"  stopColor="#67c79f" stopOpacity={o2 * 0.2} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}c`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3aae83" stopOpacity={o3} />
          <stop offset="50%"  stopColor="#96d9be" stopOpacity={o3 * 0.15} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Back wave — tallest, slowest curve */}
      <path
        d="M0,0 L0,210 C240,270 480,140 720,190 C960,240 1200,120 1440,165 L1440,0 Z"
        fill={`url(#${uid}a)`}
      />
      {/* Mid wave */}
      <path
        d="M0,0 L0,155 C300,200 600,100 900,140 C1100,168 1300,105 1440,125 L1440,0 Z"
        fill={`url(#${uid}b)`}
      />
      {/* Front wave — shortest, tightest crests */}
      <path
        d="M0,0 L0,95 C340,122 680,62 1020,95 C1160,113 1320,72 1440,88 L1440,0 Z"
        fill={`url(#${uid}c)`}
      />
    </svg>
  );
}
