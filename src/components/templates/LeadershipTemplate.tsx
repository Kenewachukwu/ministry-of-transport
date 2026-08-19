import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { PageHeader } from "./PageHeader";
import { FeaturedLeadershipCard, LeadershipGrid } from "@/components/sections/LeadershipCard";
import { getLeadership } from "@/lib/cms";

/**
 * Shared across both directions — proves the placeholder-safe leadership
 * pattern (LeadershipPerson.name: null renders honestly, never invented).
 */
export function LeadershipTemplate() {
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
          {minister && <FeaturedLeadershipCard person={minister} />}
          {permSec && <FeaturedLeadershipCard person={permSec} />}
        </Container>
      </section>
      <section className="border-t border-border bg-surface-raised py-16">
        <Container>
          <Heading as="h2" size="h2">Directors</Heading>
          <p className="mt-2 max-w-2xl text-ink-muted">
            A small number of entries are shown as pending because the live site does not
            yet list a confirmed name for that role.
          </p>
          <div className="mt-10">
            <LeadershipGrid people={directors} />
          </div>
        </Container>
      </section>
    </>
  );
}
