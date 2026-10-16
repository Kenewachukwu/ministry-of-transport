import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";
import type { LeadershipPerson } from "@/content/types";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/** Shown wherever a leadership entry has no name yet. */
export const NAME_PLACEHOLDER = "Name to be announced";

/** Name shown on cards: the real name, or an honest placeholder. Never invented. */
export function leaderName(person: LeadershipPerson): string {
  return person.name ?? NAME_PLACEHOLDER;
}

export function leaderHref(basePath: string, person: LeadershipPerson): string {
  return `${basePath}/about/leadership/${person.id}`;
}

/**
 * Portrait, or the branded placeholder when there is no photo (also used when a
 * named person has asked not to have their photo shown).
 */
export function LeaderPortrait({
  person,
  width,
  height,
  className,
}: {
  person: LeadershipPerson;
  width: number;
  height: number;
  className?: string;
}) {
  if (person.photoUrl) {
    return (
      <Image
        src={person.photoUrl}
        alt={person.name ?? person.title}
        width={width}
        height={height}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return <PlaceholderPhoto label={`${person.title} portrait`} tone="brand" className={cn("h-full w-full", className)} />;
}

/** Whole-card link: lift + border on hover, ring on keyboard focus. */
function CardLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
    >
      {children}
    </Link>
  );
}

const cardShell =
  "rounded-card border border-border bg-surface-raised shadow-card transition-all duration-200 motion-safe:group-hover:-translate-y-1 group-hover:border-cta group-hover:shadow-lg";

function ViewProfile({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-semibold text-cta", className)}>
      View profile
      <ArrowUpRight
        size={14}
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </span>
  );
}

/** Large, featured card for the Minister / Permanent Secretary. */
export function FeaturedLeadershipCard({ person, basePath }: { person: LeadershipPerson; basePath: string }) {
  return (
    <ScrollReveal>
      <CardLink href={leaderHref(basePath, person)} label={`${leaderName(person)}, ${person.title} — view profile`}>
        <div className={cn("grid gap-8 p-8 sm:grid-cols-[220px_1fr] sm:p-10", cardShell)}>
          <div className="aspect-[4/5] w-full overflow-hidden rounded-card">
            <LeaderPortrait person={person} width={420} height={420} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">{person.title}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{leaderName(person)}</h2>
            {!person.name && (
              <p className="mt-2 rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-800">
                The holder of this office will be announced here.
              </p>
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
            <ViewProfile className="mt-5" />
          </div>
        </div>
      </CardLink>
    </ScrollReveal>
  );
}

/**
 * Compact photo + name + title card for the Minister/Permanent Secretary,
 * used on the homepage's "Meet the Leadership" section — no bio dump, just
 * enough to link through to the person's profile page.
 */
export function LeadershipPreviewCard({ person, basePath }: { person: LeadershipPerson; basePath: string }) {
  return (
    <ScrollRevealItem>
      <CardLink href={leaderHref(basePath, person)} label={`${leaderName(person)}, ${person.title} — view profile`}>
        <div className={cn("flex h-full flex-col overflow-hidden", cardShell)}>
          <div className="aspect-square w-full overflow-hidden">
            <LeaderPortrait person={person} width={320} height={320} />
          </div>
          <div className="p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">{person.title}</p>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">{leaderName(person)}</h3>
            <ViewProfile className="mt-3" />
          </div>
        </div>
      </CardLink>
    </ScrollRevealItem>
  );
}

/** Compact grid card for directors — honest about placeholder entries. */
export function LeadershipGridCard({ person, basePath }: { person: LeadershipPerson; basePath: string }) {
  const name = person.name ?? (person.placeholderLabel ? `(${person.placeholderLabel})` : "Name pending");
  return (
    <ScrollRevealItem>
      <CardLink href={leaderHref(basePath, person)} label={`${name}, ${person.title} — view profile`}>
        <div
          className={cn(
            "flex h-full flex-col items-center gap-3 p-6 text-center",
            cardShell,
            person.isPlaceholder && "border-dashed bg-surface shadow-none"
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-cta transition-colors group-hover:bg-cta group-hover:text-white">
            <UserRound size={24} aria-hidden />
          </div>
          <div>
            <p className="font-display font-semibold text-ink">{name}</p>
            <p className="mt-1 text-sm text-ink-muted">{person.title}</p>
          </div>
          {person.isPlaceholder && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
              Pending confirmation
            </span>
          )}
          <ViewProfile className="mt-auto pt-1" />
        </div>
      </CardLink>
    </ScrollRevealItem>
  );
}

export function LeadershipGrid({ people, basePath }: { people: LeadershipPerson[]; basePath: string }) {
  return (
    <ScrollRevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((person) => (
        <LeadershipGridCard key={person.id} person={person} basePath={basePath} />
      ))}
    </ScrollRevealGroup>
  );
}
