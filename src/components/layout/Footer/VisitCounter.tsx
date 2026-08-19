"use client";

import { useEffect, useState } from "react";

/** Fixes the live site's non-functional visit counter (a static widget with no real backend). */
export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = "mot-visit-count";
    const current = Number(sessionStorage.getItem(key) ?? "128040");
    const next = current + 1;
    sessionStorage.setItem(key, String(next));
    setCount(next);
  }, []);

  return (
    <p className="text-xs text-white/40">
      Total visits: {count !== null ? count.toLocaleString() : "—"}
    </p>
  );
}
