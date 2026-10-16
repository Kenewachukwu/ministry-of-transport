import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { LeaderPortrait, leaderName } from "@/components/sections/LeadershipCard";
import { PageHeader } from "./PageHeader";
import type { LeadershipPerson } from "@/content/types";

/**
 * Profile page for one leader: portrait (or the branded placeholder), name,
 * title and, when the Ministry has supplied it, biographical details. Entries
 * without a name or biography say so plainly instead of inventing content.
 */
export function LeadershipDetailTemplate({ person, basePath }: { person: LeadershipPerson; basePath: string }) {
  return (
    <>
      <PageHeader eyebrow={person.title} title={leaderName(person)}>
        <div className="mt-6">
          <InlineLink href={`${basePath}/about/leadership`} className="text-white/80 hover:text-white focus-visible:text-white">
            ← Back to Leadership
          </InlineLink>
        </div>
      </PageHeader>

      <section className="py-16">
        <Container className="grid gap-10 sm:grid-cols-[260px_1fr] lg:gap-14">
          <div className="aspect-[4/5] w-full max-w-xs overflow-hidden rounded-card border border-border shadow-card">
            <LeaderPortrait person={person} width={520} height={650} />
          </div>

          <div>
            <Heading as="h2" size="h3">
              Profile
            </Heading>
            {person.bio?.length ? (
              <dl className="mt-5 flex flex-col gap-4 border-t border-border pt-5">
                {person.bio.map((item) => (
                  <div key={item.label} className="grid gap-1 text-base sm:grid-cols-[160px_1fr] sm:gap-4">
                    <dt className="font-semibold text-ink-muted">{item.label}</dt>
                    <dd className="text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 max-w-xl text-ink-muted">
                {person.name
                  ? "A full profile for this office-holder will be published here."
                  : "The holder of this office will be announced here."}
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
