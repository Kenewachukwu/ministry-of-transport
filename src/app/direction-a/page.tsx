import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { WavyGreenBg } from "@/design-system/primitives/WavyGreenBg";
import { HeroA } from "@/components/sections/HeroA";
import { StatCounterBand } from "@/components/sections/StatCounterBand";
import { WelcomeMessageBlock } from "@/components/sections/WelcomeMessageBlock";
import { PillarCards } from "@/components/sections/PillarCards";
import { TabbedNewsSection } from "@/components/sections/TabbedNewsSection";
import { TopicDirectory } from "@/components/sections/TopicDirectory";
import { CardGrid } from "@/components/sections/CardGrid";
import { mandate, vision, mission } from "@/content/mandate";
import { getWelcomeMessage, getPillars, getDepartments, getAgencies, getNews, getEvents } from "@/lib/cms";
import { stats } from "@/content/stats";

const basePath = "/direction-a";

export default function DirectionAHomePage() {
  const welcome = getWelcomeMessage();
  const pillars = getPillars();
  const departments = getDepartments().slice(0, 6);
  const agencies = getAgencies();
  const news = getNews();
  const events = getEvents();

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

      <section className="relative overflow-hidden border-t border-border bg-surface-raised py-20">
        <WavyGreenBg intensity="subtle" />
        <Container className="relative z-10">

          {/* ── Mandate ── */}
          <div className="pb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cta">Our Mandate</p>
            <div className="mt-2 h-0.5 w-10 bg-cta" />
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Why we exist
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted">
              {mandate}
            </p>
          </div>

          {/* ── Vision + Mission ── */}
          <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cta">Our Vision</p>
              <div className="mt-2 h-0.5 w-10 bg-cta" />
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Where we are headed
              </h3>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{vision}</p>
            </div>

            <div className="sm:border-l sm:border-border sm:pl-10 lg:pl-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cta">Our Mission</p>
              <div className="mt-2 h-0.5 w-10 bg-cta" />
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                How we get there
              </h3>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{mission}</p>
            </div>
          </div>

        </Container>
      </section>

      <section className="relative overflow-hidden py-20">
        <WavyGreenBg intensity="medium" />
        <Container className="relative z-10">
          <Heading as="h2" size="h2">The Road Ahead</Heading>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Our key goals, translated into measurable targets across the sector.
          </p>
          <div className="mt-10">
            <PillarCards pillars={pillars} />
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-surface-raised py-20">
        <WavyGreenBg intensity="bold" />
        <Container className="relative z-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <Heading as="h2" size="h2">Latest News &amp; Events</Heading>
            <InlineLink href={`${basePath}/news`} chevron>
              View all news
            </InlineLink>
          </div>
          <TabbedNewsSection news={news} events={events} basePath={basePath} />
        </Container>
      </section>

      <section className="border-t border-border py-20">
        <Container>
          <div className="mb-10 text-center">
            <Heading as="h2" size="h2">Explore by Topic</Heading>
            <p className="mx-auto mt-2 max-w-xl text-ink-muted">
              Find what you need — from departments and agencies to e-services and key documents.
            </p>
          </div>
          <TopicDirectory basePath={basePath} />
        </Container>
      </section>

      <section className="relative overflow-hidden py-20">
        <WavyGreenBg intensity="medium" />
        <Container className="relative z-10">
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

      <section className="relative overflow-hidden border-t border-border bg-surface-raised py-20">
        <WavyGreenBg intensity="bold" />
        <Container className="relative z-10">
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
