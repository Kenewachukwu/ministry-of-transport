"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { ButtonLink } from "@/design-system/primitives/Button";
import { WaveDivider } from "@/components/illustrations/WaveDivider";
import { useReducedMotion } from "@/design-system/motion/useReducedMotion";

function AbstractNetworkBg({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="heroRg1" cx="75%" cy="35%" r="55%">
          <stop offset="0%"   stopColor="#007d53" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#007d53" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heroRg2" cx="60%" cy="75%" r="40%">
          <stop offset="0%"   stopColor="#3aae83" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#3aae83" stopOpacity="0" />
        </radialGradient>
        <pattern id="heroDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#007d53" opacity="0.12" />
        </pattern>
      </defs>

      {/* Soft radial glows */}
      <rect x="0" y="0" width="1440" height="800" fill="url(#heroRg1)" />
      <rect x="0" y="0" width="1440" height="800" fill="url(#heroRg2)" />

      {/* Dot grid — right two-thirds */}
      <rect x="420" y="0" width="1020" height="800" fill="url(#heroDots)" />

      {/* Large outer ring */}
      <circle cx="1100" cy="280" r="380" fill="none" stroke="#007d53" strokeWidth="1.5" opacity="0.13" />
      {/* Medium ring — offset inward */}
      <circle cx="1100" cy="280" r="265" fill="none" stroke="#3aae83" strokeWidth="1"   opacity="0.10" />
      {/* Inner filled disc */}
      <circle cx="1100" cy="280" r="140" fill="#007d53" opacity="0.05" />

      {/* Second ring cluster — lower */}
      <circle cx="860"  cy="580" r="190" fill="none" stroke="#007d53" strokeWidth="1.5" opacity="0.09" />
      <circle cx="860"  cy="580" r="105" fill="#3aae83" opacity="0.04" />

      {/* Small accent node — upper left quadrant */}
      <circle cx="420"  cy="140" r="72"  fill="none" stroke="#007d53" strokeWidth="2"   opacity="0.13" />
      <circle cx="420"  cy="140" r="32"  fill="#007d53" opacity="0.07" />

      {/* Connecting dashed paths (transport routes) */}
      <path d="M420,140 Q660,80  900,200"  fill="none" stroke="#007d53" strokeWidth="1" strokeDasharray="7 5" opacity="0.11" />
      <path d="M420,140 Q580,360 860,580"  fill="none" stroke="#007d53" strokeWidth="1" strokeDasharray="7 5" opacity="0.09" />
      <path d="M860,200 Q980,240 1100,280" fill="none" stroke="#3aae83" strokeWidth="1" strokeDasharray="5 4" opacity="0.10" />

      {/* Small floating nodes */}
      <circle cx="900"  cy="200" r="6"  fill="#007d53" opacity="0.20" />
      <circle cx="280"  cy="320" r="5"  fill="#007d53" opacity="0.15" />
      <circle cx="340"  cy="240" r="3.5" fill="#3aae83" opacity="0.15" />
      <circle cx="180"  cy="190" r="4"  fill="#007d53" opacity="0.12" />
      <circle cx="660"  cy="340" r="4.5" fill="#007d53" opacity="0.12" />

      {/* Sweeping arc — bottom-left to mid-right */}
      <path
        d="M-80,760 C280,560 580,680 900,600 C1100,548 1340,620 1520,560"
        fill="none" stroke="#007d53" strokeWidth="1.5" opacity="0.07"
      />

      {/* Top-left corner accent wedge */}
      <path d="M0,0 L180,0 L0,240 Z" fill="#007d53" opacity="0.04" />
      <path d="M0,0 L100,0 L0,140 Z" fill="#007d53" opacity="0.03" />

      {/* Horizontal road-marking dashes */}
      <line x1="60"  y1="480" x2="220" y2="480" stroke="#007d53" strokeWidth="1.5" strokeDasharray="12 7" opacity="0.09" />
      <line x1="40"  y1="520" x2="165" y2="520" stroke="#007d53" strokeWidth="1"   strokeDasharray="12 7" opacity="0.07" />

      {/* Animated pulse ring — only when motion is allowed */}
      {!reduced && (
        <circle cx="1100" cy="280" r="380" fill="none" stroke="#007d53" strokeWidth="1" opacity="0.06">
          <animate attributeName="r"       values="380;430;380" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0;0.06"  dur="6s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

export function HeroB({ basePath }: { basePath: string }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-b from-brand-50 to-surface">
      <AbstractNetworkBg reduced={reduced} />
      <Container className="relative z-10 flex flex-1 flex-col justify-center pt-20 pb-12 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600"
          >
            Federal Republic of Nigeria
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl"
          >
            Moving Nigeria forward,{" "}
            <span className="text-cta">safely and efficiently.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-lg text-ink-muted"
          >
            The Federal Ministry of Transportation coordinates road and rail
            infrastructure, safety, and services across all 36 states and the FCT.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <ButtonLink href={`${basePath}/e-services`} size="lg">
              Explore E-Services
            </ButtonLink>
            <ButtonLink href={`${basePath}/about`} variant="secondary" size="lg">
              About the Ministry
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted"
        >
          Scroll down
          <motion.span
            animate={reduced ? undefined : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            <ChevronDown size={16} aria-hidden />
          </motion.span>
        </motion.div>
      </Container>

      <div className="relative h-24 text-surface-inverse sm:h-32">
        <WaveDivider className="h-full w-full" />
      </div>
    </section>
  );
}
