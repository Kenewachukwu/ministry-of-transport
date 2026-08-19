"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DarkHeroFlag } from "@/design-system/themes/HeroModeContext";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { Container } from "@/design-system/primitives/Container";
import { InlineLink } from "@/design-system/primitives/Link";
import { cn } from "@/lib/utils";

interface Slide {
  eyebrow: string;
  headline: string;
  body: string;
  linkLabel: string;
  linkHref: string;
  imageQuery: string;
}

const slides: Slide[] = [
  {
    eyebrow: "Our Vision",
    headline: "A secure, world-class transportation system.",
    body: "Building the road and rail infrastructure that connects every part of Nigeria.",
    linkLabel: "Our mandate and vision",
    linkHref: "/about",
    imageQuery: "Nigerian highway aerial view",
  },
  {
    eyebrow: "National Council on Transportation",
    headline: "Embracing innovation for sustainable transportation.",
    body: "The 18th NCT brought federal and state stakeholders together to tackle the sector's energy and connectivity challenges.",
    linkLabel: "Read the communique",
    linkHref: "/resources/nct-communique",
    imageQuery: "government conference delegates Nigeria",
  },
  {
    eyebrow: "Rail Transport Services",
    headline: "An intermodal network built for growth.",
    body: "Expanding rail capacity and intermodal terminals to support Nigeria's economic development.",
    linkLabel: "Explore our departments",
    linkHref: "/about/departments",
    imageQuery: "railway locomotive Nigeria",
  },
];

export function HeroA({ basePath }: { basePath: string }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <section className="relative -mt-20 flex min-h-dvh items-center overflow-hidden bg-surface-inverse text-white lg:-mt-28">
      <DarkHeroFlag />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <PlaceholderPhoto label={slide.imageQuery} tone="dark" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 pt-40 pb-32 lg:pt-48">
        <div className="max-w-2xl">
          <motion.p
            key={`eyebrow-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300"
          >
            {slide.eyebrow}
          </motion.p>
          <motion.h1
            key={`headline-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-4 font-display text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl"
          >
            {slide.headline}
          </motion.h1>
          <motion.p
            key={`body-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 max-w-lg text-base text-white/75"
          >
            {slide.body}
          </motion.p>
          <div className="mt-7">
            <InlineLink href={`${basePath}${slide.linkHref}`} chevron className="text-white">
              {slide.linkLabel}
            </InlineLink>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <Container className="flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.headline}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-brand-400" : "w-4 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
