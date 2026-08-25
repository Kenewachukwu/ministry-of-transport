import Image from "next/image";
import { UserRound } from "lucide-react";
import type { LeadershipPerson } from "@/content/types";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/** Large, featured card for the Minister / Permanent Secretary. */
export function FeaturedLeadershipCard({ person }: { person: LeadershipPerson }) {
  return (
    <ScrollReveal>
      <div className="grid gap-8 rounded-card border border-border bg-surface-raised p-8 shadow-card sm:grid-cols-[220px_1fr] sm:p-10">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-card">
          {person.photoUrl ? (
            <Image
              src={person.photoUrl}
              alt={person.name ?? person.title}
              width={420}
              height={420}
              className="h-full w-full object-cover"
            />
          ) : person.name ? (
            <PlaceholderPhoto label={`${person.title} portrait`} tone="brand" className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-surface text-ink-muted">
              <UserRound size={32} aria-hidden />
              <span className="text-xs">Photo pending</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">{person.title}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            {person.name ?? "Name pending confirmation"}
          </h2>
          {!person.name && person.sourceNote && (
            <p className="mt-2 rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-800">{person.sourceNote}</p>
          )}
          {person.bio && (
            <dl className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
              {person.bio.map((item) => (
                <div key={item.label} className="grid grid-cols-[120px_1fr] gap-3 text-sm">
                  <dt className="font-semibold text-ink-muted">{item.label}</dt>
                  <dd className="text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

/**
 * Compact photo + name + title card for the Minister/Permanent Secretary,
 * used on the homepage's "Meet the Leadership" section (mirrors the live
 * site's own homepage pattern) — no bio dump, just enough to link through
 * to the full Leadership page.
 */
export function LeadershipPreviewCard({ person }: { person: LeadershipPerson }) {
  return (
    <ScrollRevealItem>
      <div className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-card">
        <div className="aspect-square w-full overflow-hidden">
          {person.photoUrl ? (
            <Image
              src={person.photoUrl}
              alt={person.name ?? person.title}
              width={320}
              height={320}
              className="h-full w-full object-cover"
            />
          ) : person.name ? (
            <PlaceholderPhoto label={`${person.title} portrait`} tone="brand" className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-surface text-ink-muted">
              <UserRound size={28} aria-hidden />
              <span className="text-xs">Photo pending</span>
            </div>
          )}
        </div>
        <div className="p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">{person.title}</p>
          <h3 className="mt-2 font-display text-lg font-semibold text-ink">
            {person.name ?? "Name pending confirmation"}
          </h3>
        </div>
      </div>
    </ScrollRevealItem>
  );
}

/** Compact grid card for directors — honest about placeholder entries. */
export function LeadershipGridCard({ person }: { person: LeadershipPerson }) {
  return (
    <ScrollRevealItem>
      <div
        className={cn(
          "flex h-full flex-col items-center gap-3 rounded-card border p-6 text-center",
          person.isPlaceholder
            ? "border-dashed border-border bg-surface"
            : "border-border bg-surface-raised shadow-card"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-cta">
          <UserRound size={24} aria-hidden />
        </div>
        <div>
          <p className="font-display font-semibold text-ink">
            {person.name ?? (person.placeholderLabel ? `(${person.placeholderLabel})` : "Name pending")}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{person.title}</p>
        </div>
        {person.isPlaceholder && (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            Pending confirmation
          </span>
        )}
      </div>
    </ScrollRevealItem>
  );
}

export function LeadershipGrid({ people }: { people: LeadershipPerson[] }) {
  return (
    <ScrollRevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((person) => (
        <LeadershipGridCard key={person.id} person={person} />
      ))}
    </ScrollRevealGroup>
  );
}
