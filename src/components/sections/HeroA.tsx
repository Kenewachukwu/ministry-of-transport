"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DarkHeroFlag } from "@/design-system/themes/HeroModeContext";
import { Container } from "@/design-system/primitives/Container";
import { InlineLink } from "@/design-system/primitives/Link";
import { cn } from "@/lib/utils";

const SHAPES = [
  {
    d: "M 1440 0 C 1180 80 900 240 760 460 C 640 660 720 820 940 900 L 1440 900 Z",
    fill: "#04573a",
    opacity: 0.62,
    delay: 0,
    fx: 6,
    fy: 4,
    fd: 7,
  },
  {
    d: "M 1440 120 C 1220 180 980 340 840 540 C 760 670 800 810 960 870 L 1160 900 L 1440 720 Z",
    fill: "#007d53",
    opacity: 0.42,
    delay: 0.1,
    fx: -5,
    fy: 6,
    fd: 8,
  },
  {
    d: "M 1440 350 C 1300 390 1100 480 940 600 C 840 680 800 800 900 880 L 1180 900 L 1440 820 Z",
    fill: "#3aae83",
    opacity: 0.28,
    delay: 0.2,
    fx: 8,
    fy: -4,
    fd: 9,
  },
  {
    d: "M 820 900 C 900 820 1060 740 1240 680 L 1440 620 L 1440 900 Z",
    fill: "#96d9be",
    opacity: 0.18,
    delay: 0.3,
    fx: -4,
    fy: 5,
    fd: 6,
  },
];

function AngularShapes() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {SHAPES.map((s, i) => (
          /* motion.g handles entry slide-in; motion.path handles continuous float */
          <motion.g
            key={i}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: s.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.path
              d={s.d}
              fill={s.fill}
              fillOpacity={s.opacity}
              animate={
                reduced
                  ? undefined
                  : { x: [0, s.fx, 0], y: [0, s.fy, 0] }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: s.fd,
                      delay: s.delay + 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

interface Slide {
  eyebrow: string;
  headline: string;
  body: string;
  linkLabel: string;
  linkHref: string;
  imageAlt: string;
  imageSrc: string;
}

const slides: Slide[] = [
  {
    eyebrow: "Our Vision",
    headline: "A secure, world-class transportation system.",
    body: "Building the road and rail infrastructure that connects every part of Nigeria.",
    linkLabel: "Our mandate and vision",
    linkHref: "/about",
    imageAlt: "Aerial view of a highway in Lagos, Nigeria",
    imageSrc: "/images/stock/hero-lagos-highway.jpg",
  },
  {
    eyebrow: "National Council on Transportation",
    headline: "Embracing innovation for sustainable transportation.",
    body: "The 18th NCT brought federal and state stakeholders together to tackle the sector's energy and connectivity challenges.",
    linkLabel: "Read the communique",
    linkHref: "/resources/nct-communique",
    imageAlt: "Conference delegates seated around a table in Abuja, Nigeria",
    imageSrc: "/images/stock/hero-abuja-conference.jpg",
  },
  {
    eyebrow: "Rail Transport Services",
    headline: "An intermodal network built for growth.",
    body: "Expanding rail capacity and intermodal terminals to support Nigeria's economic development.",
    linkLabel: "Explore our departments",
    linkHref: "/about/departments",
    imageAlt: "A train arriving at Abuja Metro Station, Nigeria",
    imageSrc: "/images/stock/hero-abuja-metro-rail.jpg",
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
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Deep green gradient — replaces the old black overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#031a0c] via-[#052e15]/80 to-[#073321]/25" />
          {/* Left-side text backing */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031a0c]/70 via-[#031a0c]/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Angular green shapes overlay */}
      <AngularShapes />

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
