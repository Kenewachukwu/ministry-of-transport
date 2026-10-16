import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { PageHeader } from "./PageHeader";
import { FeaturedLeadershipCard, LeadershipGrid } from "@/components/sections/LeadershipCard";
import { getLeadership } from "@/lib/cms";

/**
 * Leadership hub. Entries with `name: null` render as honest placeholders
 * (never an invented name); every card links to that person's profile page.
 */
export function LeadershipTemplate({ basePath }: { basePath: string }) {
  const people = getLeadership();
  const minister = people.find((p) => p.role === "minister");
  const permSec = people.find((p) => p.role === "permanent-secretary");
  const directors = people.filter((p) => p.id !== minister?.id && p.id !== permSec?.id);

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Leadership"
        description="The Minister, Permanent Secretary, and directors leading the Federal Ministry of Transportation."
      />
      <section className="py-16">
        <Container className="flex flex-col gap-8">
          {minister && <FeaturedLeadershipCard person={minister} basePath={basePath} />}
          {permSec && <FeaturedLeadershipCard person={permSec} basePath={basePath} />}
        </Container>
      </section>
      <section className="border-t border-border bg-surface-raised py-16">
        <Container>
          <Heading as="h2" size="h2">Directors</Heading>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Some entries are shown as pending until the Ministry confirms the name of the
            office-holder.
          </p>
          <div className="mt-10">
            <LeadershipGrid people={directors} basePath={basePath} />
          </div>
        </Container>
      </section>
    </>
  );
}
