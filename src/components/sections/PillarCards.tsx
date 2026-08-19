import { Target } from "lucide-react";
import type { Pillar } from "@/content/types";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";

/**
 * fmmbe.gov.ng's "The Road Ahead" pattern — pillar cards with bullet KPIs
 * and target years — adapted to this ministry's own Key Goals.
 */
export function PillarCards({ pillars }: { pillars: Pillar[] }) {
  return (
    <ScrollRevealGroup className="grid gap-5 sm:grid-cols-2">
      {pillars.map((pillar) => (
        <ScrollRevealItem key={pillar.id}>
          <div className="h-full rounded-card border border-border bg-surface-raised p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-ink">{pillar.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{pillar.description}</p>
            <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              {pillar.kpis.map((kpi) => (
                <li key={kpi.label} className="flex items-start gap-2 text-sm text-ink">
                  <Target size={14} className="mt-0.5 shrink-0 text-cta" aria-hidden />
                  <span>
                    {kpi.label} <span className="text-ink-muted">— target {kpi.targetYear}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}
