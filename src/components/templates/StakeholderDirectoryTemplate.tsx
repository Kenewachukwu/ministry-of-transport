"use client";

import { useState } from "react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import type { StakeholderGroup } from "@/content/types";
import { cn } from "@/lib/utils";

export function StakeholderDirectoryTemplate({ groups }: { groups: StakeholderGroup[] }) {
  const [active, setActive] = useState(groups[0]?.category);
  const activeGroup = groups.find((g) => g.category === active) ?? groups[0];

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Stakeholders"
        description="Federal and state agencies, professional bodies, and unions the Ministry works with."
      />
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group.category}
                onClick={() => setActive(group.category)}
                className={cn(
                  "rounded-control border px-4 py-2 text-sm font-semibold transition-colors",
                  active === group.category
                    ? "border-cta bg-cta text-cta-ink"
                    : "border-border bg-surface-raised text-ink-muted hover:border-cta hover:text-cta"
                )}
              >
                {group.category}
              </button>
            ))}
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeGroup?.items.map((item) => (
              <li
                key={item}
                className="rounded-card border border-border bg-surface-raised px-4 py-3 text-sm text-ink shadow-card"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
