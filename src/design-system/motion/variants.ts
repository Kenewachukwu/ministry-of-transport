import type { Variants } from "motion/react";
import { easeStandard } from "@/design-system/tokens";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeStandard } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: easeStandard } },
};

export const staggerContainer = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeStandard } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeStandard } },
};

export const routeTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeStandard } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: easeStandard } },
};
