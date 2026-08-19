"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Direction B only — Lagos State's dynamic time-of-day greeting. Client
 * component, single fade-in on mount, no continuous animation, no PII.
 */
export function GreetingBanner() {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  if (!greeting) return null;

  return (
    <p className="animate-count-fade text-sm font-medium text-white/70">
      {greeting}, and welcome to the Ministry.
    </p>
  );
}
