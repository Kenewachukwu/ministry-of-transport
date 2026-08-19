"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { routeTransition } from "./variants";
import { useReducedMotion } from "./useReducedMotion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={routeTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
