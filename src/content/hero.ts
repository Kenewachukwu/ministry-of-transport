import type { HeroSlide } from "./types";

/**
 * Home-page hero carousel, in display order. Lived inside HeroA.tsx until the
 * Ministry's Oct 2026 review asked for an editable hero (background picture,
 * heading, paragraph and call-to-action), so it is now content like any other.
 */
export const heroSlides: HeroSlide[] = [
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
    imageAlt: "Engineers reviewing infrastructure blueprints on site",
    imageSrc: "/images/stock/hero-engineering-team.jpg",
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
