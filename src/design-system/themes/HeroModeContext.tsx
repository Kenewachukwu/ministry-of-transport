"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const HeroModeContext = createContext<{
  hasHero: boolean;
  setHasHero: (value: boolean) => void;
}>({
  hasHero: false,
  setHasHero: () => {},
});

export function HeroModeProvider({ children }: { children: ReactNode }) {
  const [hasHero, setHasHero] = useState(false);
  return (
    <HeroModeContext.Provider value={{ hasHero, setHasHero }}>{children}</HeroModeContext.Provider>
  );
}

export function useHeroMode() {
  return useContext(HeroModeContext).hasHero;
}

/**
 * Rendered once by a page with a full-bleed dark hero (currently just
 * Direction A's homepage) to opt HeaderA into transparent-over-hero mode
 * while mounted. Without this, the header defaults to solid — correct for
 * every inner page, which has no dark backdrop behind it.
 */
export function DarkHeroFlag() {
  const { setHasHero } = useContext(HeroModeContext);
  useEffect(() => {
    setHasHero(true);
    return () => setHasHero(false);
  }, [setHasHero]);
  return null;
}
