"use client";

import { useEffect, useState } from "react";

/**
 * Fixes the live site's non-functional visit counter (a static widget with
 * no real backend). Uses sessionStorage so it's honest about being a
 * client-side demo counter rather than pretending to be real analytics.
 */
export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = "mot-demo-visit-count";
    const current = Number(sessionStorage.getItem(key) ?? "128040");
    const next = current + 1;
    sessionStorage.setItem(key, String(next));
    setCount(next);
  }, []);

  return (
    <p className="text-xs text-white/40">
      Total visits (session demo): {count !== null ? count.toLocaleString() : "—"}
    </p>
  );
}
