import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { HeroA } from "@/components/sections/HeroA";
import { StatCounterBand } from "@/components/sections/StatCounterBand";
import { WelcomeMessageBlock } from "@/components/sections/WelcomeMessageBlock";
import { EditorialModule } from "@/components/sections/EditorialModule";
import { PillarCards } from "@/components/sections/PillarCards";
import { FeaturedNews } from "@/components/sections/FeaturedNews";
import { CardGrid } from "@/components/sections/CardGrid";
import { mandate, vision, mission } from "@/content/mandate";
import { getWelcomeMessage, getPillars, getDepartments, getAgencies, getFeaturedNews } from "@/lib/cms";
import { stats } from "@/content/stats";

const basePath = "/direction-a";

export default function DirectionAHomePage() {
  const welcome = getWelcomeMessage();
  const pillars = getPillars();
  const departments = getDepartments().slice(0, 6);
  const agencies = getAgencies();
  const news = getFeaturedNews(3);

  return (
    <>
      <HeroA basePath={basePath} />

      <section className="border-b border-border bg-surface-raised py-10">
        <Container>
          <StatCounterBand stats={stats} />
        </Container>
      </section>

      <section className="py-20">
        <Container size="narrow">
          <WelcomeMessageBlock
            title={welcome.title}
            signOff={welcome.signOff}
            body={welcome.body}
            photoUrl={welcome.photoUrl}
          />
        </Container>
      </section>

      <section className="py-4">
        <Container className="flex flex-col gap-16">
          <EditorialModule eyebrow="Our Mandate" heading="Why we exist">
            <p>{mandate}</p>
          </EditorialModule>
          <EditorialModule eyebrow="Vision &amp; Mission" heading="Where we are headed" reversed>
            <p>{vision}</p>
            <p className="mt-3">{mission}</p>
          </EditorialModule>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Heading as="h2" size="h2">The Road Ahead</Heading>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Our key goals, translated into measurable targets across the sector.
          </p>
          <div className="mt-10">
            <PillarCards pillars={pillars} />
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-raised py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Heading as="h2" size="h2">Latest News &amp; Events</Heading>
              <p className="mt-2 max-w-2xl text-ink-muted">
                Press releases, online news reports, and photo news from across the Ministry.
              </p>
            </div>
            <InlineLink href={`${basePath}/news`} chevron>
              View all news
            </InlineLink>
          </div>
          <div className="mt-10">
            <FeaturedNews items={news} basePath={basePath} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading as="h2" size="h2">Our Departments</Heading>
            <InlineLink href={`${basePath}/about/departments`} chevron>
              View all departments
            </InlineLink>
          </div>
          <div className="mt-10">
            <CardGrid
              items={departments.map((d) => ({ id: d.id, title: d.name, description: d.summary, imageUrl: d.photoUrl }))}
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-raised py-20">
        <Container>
          <Heading as="h2" size="h2">Agencies Under the Ministry</Heading>
          <div className="mt-10">
            <CardGrid
              columns={2}
              items={agencies.map((a) => ({
                id: a.id,
                title: a.name,
                description: a.description,
                href: a.href,
                external: true,
                badge: a.shortName,
                imageUrl: a.photoUrl,
              }))}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
