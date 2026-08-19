"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import type { Stat } from "@/content/types";
import { useReducedMotion } from "@/design-system/motion/useReducedMotion";
import { cn } from "@/lib/utils";

function Counter({ value, reduced }: { value: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.max(0, Math.min((now - start) / duration, 1));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value) || 0);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function StatCounterBand({
  stats,
  className,
  tone = "light",
}: {
  stats: Stat[];
  className?: string;
  tone?: "light" | "dark";
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-8 sm:grid-cols-4",
        tone === "dark" ? "text-white" : "text-ink",
        className
      )}
    >
      {stats.map((stat) => (
        <div key={stat.id} className="text-center sm:text-left">
          <p className="font-display text-3xl font-bold sm:text-4xl">
            <Counter value={stat.value} reduced={reduced} />
            {stat.suffix ? <span className="text-2xl"> {stat.suffix}</span> : null}
          </p>
          <p className={cn("mt-1 text-sm", tone === "dark" ? "text-white/60" : "text-ink-muted")}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
