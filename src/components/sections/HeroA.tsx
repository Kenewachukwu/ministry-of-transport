"use client";

import { useEffect, useState, type FocusEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { DarkHeroFlag } from "@/design-system/themes/HeroModeContext";
import { Container } from "@/design-system/primitives/Container";
import { InlineLink } from "@/design-system/primitives/Link";
import type { HeroSlide } from "@/content/types";
import { resolveHref } from "@/lib/links";
import { cn } from "@/lib/utils";

/** How long each slide stays before the carousel advances on its own. */
const SLIDE_INTERVAL_MS = 6000;

// Fill opacities were roughly halved in Oct 2026 (Ministry review: "the hero
// background should be brighter") so the photograph reads through the shapes.
const SHAPES = [
  {
    d: "M 1440 0 C 1180 80 900 240 760 460 C 640 660 720 820 940 900 L 1440 900 Z",
    fill: "#04573a",
    opacity: 0.34,
    delay: 0,
    fx: 6,
    fy: 4,
    fd: 7,
  },
  {
    d: "M 1440 120 C 1220 180 980 340 840 540 C 760 670 800 810 960 870 L 1160 900 L 1440 720 Z",
    fill: "#007d53",
    opacity: 0.22,
    delay: 0.1,
    fx: -5,
    fy: 6,
    fd: 8,
  },
  {
    d: "M 1440 350 C 1300 390 1100 480 940 600 C 840 680 800 800 900 880 L 1180 900 L 1440 820 Z",
    fill: "#3aae83",
    opacity: 0.15,
    delay: 0.2,
    fx: 8,
    fy: -4,
    fd: 9,
  },
  {
    d: "M 820 900 C 900 820 1060 740 1240 680 L 1440 620 L 1440 900 Z",
    fill: "#96d9be",
    opacity: 0.1,
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

export function HeroA({ slides, basePath }: { slides: HeroSlide[]; basePath: string }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  // Pointer over the text/controls, or keyboard focus inside them, holds the
  // slide still so it can't change under someone who is about to click.
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reducedMotion = useReducedMotion(); // motion's hook: boolean | null (null = not yet known)

  const count = slides.length;
  const canAutoplay = count > 1 && reducedMotion !== true;
  const autoplaying = canAutoplay && !userPaused && !interacting && !tabHidden;

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // A fresh timeout per slide (note `index` in the deps): clicking a dot or
  // arrow restarts the full interval instead of advancing again a moment later.
  useEffect(() => {
    if (!autoplaying) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplaying, index, count]);

  if (count === 0) return null;
  const slide = slides[index] ?? slides[0];
  const cta = resolveHref(basePath, slide.linkHref);

  const holdHandlers = {
    onMouseEnter: () => setInteracting(true),
    onMouseLeave: () => setInteracting(false),
    onFocus: () => setInteracting(true),
    onBlur: (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false);
    },
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative -mt-20 flex min-h-dvh items-center overflow-hidden bg-surface-inverse text-white lg:-mt-28"
    >
      <DarkHeroFlag />

      {/*
        All slide photographs are stacked and cross-faded with a CSS opacity
        transition: no dark dip between slides, and the first slide is visible
        in the server-rendered HTML without any JS having to run first (an
        earlier mount-triggered JS animation got stuck invisible after client
        route changes on the live site).
      */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <Image
            key={s.imageSrc}
            src={s.imageSrc}
            alt={i === index ? s.imageAlt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {/* Light green tint, deepest at the foot (where the controls sit) and
            fading out toward the top; plus a left-hand backing for the copy. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031a0c]/70 via-[#052e15]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031a0c]/70 via-[#031a0c]/42 to-transparent" />
        {/* Keeps the white header text readable over bright sky/road. */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#031a0c]/55 to-transparent" />
      </div>

      {/* Angular green shapes overlay */}
      <AngularShapes />

      <Container className="relative z-10 pt-40 pb-32 lg:pt-48">
        <div
          className="max-w-2xl [text-shadow:0_1px_14px_rgba(3,26,12,0.55)]"
          {...holdHandlers}
          aria-live={autoplaying ? "off" : "polite"}
        >
          {/*
            Plain elements + CSS `animate-count-fade` instead of Framer Motion
            initial/animate here: on the live site, this exact mount-triggered
            JS animation pattern was observed getting permanently stuck at its
            `initial` (invisible) state after a client-side route change,
            taking the hero text down with it. A CSS animation runs on the
            style engine as soon as the element exists — no React effect or
            rAF callback has to fire first — so it can't get stuck hidden the
            same way, and prefers-reduced-motion already neutralizes it globally.
          */}
          <p
            key={`eyebrow-${index}`}
            className="animate-count-fade text-sm font-semibold uppercase tracking-[0.2em] text-brand-200"
          >
            {slide.eyebrow}
          </p>
          <h1
            key={`headline-${index}`}
            className="animate-count-fade mt-4 font-display text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl"
            style={{ animationDelay: "70ms" }}
          >
            {slide.headline}
          </h1>
          <p
            key={`body-${index}`}
            className="animate-count-fade mt-5 max-w-lg text-base text-white/90"
            style={{ animationDelay: "140ms" }}
          >
            {slide.body}
          </p>
          <div className="mt-7">
            <InlineLink href={cta.href} external={cta.external} chevron className="text-white hover:text-white focus-visible:text-white">
              {slide.linkLabel}
            </InlineLink>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2" {...holdHandlers}>
            {slides.map((s, i) => (
              <button
                key={s.imageSrc}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                  i === index ? "w-8 bg-brand-300" : "w-4 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
            {canAutoplay && (
              <button
                type="button"
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                onClick={() => setUserPaused((p) => !p)}
                className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {userPaused ? <Play size={12} aria-hidden /> : <Pause size={12} aria-hidden />}
              </button>
            )}
          </div>
          <div className="flex gap-2" {...holdHandlers}>
            <button
              aria-label="Previous slide"
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setIndex((i) => (i + 1) % count)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
