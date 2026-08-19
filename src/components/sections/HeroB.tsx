"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { ButtonLink } from "@/design-system/primitives/Button";
import { TransportSkylineStrip } from "@/components/illustrations/TransportSkylineStrip";
import { useReducedMotion } from "@/design-system/motion/useReducedMotion";

export function HeroB({ basePath }: { basePath: string }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-b from-brand-50 to-surface">
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

      <div className="relative h-32 text-brand-600 sm:h-40">
        <TransportSkylineStrip className="h-full w-full" />
      </div>
    </section>
  );
}
