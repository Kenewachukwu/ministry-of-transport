import { Compass, Target, Sparkles } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { InlineLink } from "@/design-system/primitives/Link";
import { HeroB } from "@/components/sections/HeroB";
import { StatCounterBand } from "@/components/sections/StatCounterBand";
import { WelcomeMessageBlock } from "@/components/sections/WelcomeMessageBlock";
import { PillarCards } from "@/components/sections/PillarCards";
import { FeaturedNews } from "@/components/sections/FeaturedNews";
import { CardGrid } from "@/components/sections/CardGrid";
import { TopicDirectory } from "@/components/sections/TopicDirectory";
import { mandate, vision, mission } from "@/content/mandate";
import { getWelcomeMessage, getPillars, getDepartments, getAgencies, getFeaturedNews } from "@/lib/cms";
import { stats } from "@/content/stats";

const basePath = "/direction-b";

const values = [
  { icon: Compass, label: "Our Mandate", text: mandate },
  { icon: Target, label: "Our Vision", text: vision },
  { icon: Sparkles, label: "Our Mission", text: mission },
];

export default function DirectionBHomePage() {
  const welcome = getWelcomeMessage();
  const pillars = getPillars();
  const departments = getDepartments().slice(0, 6);
  const agencies = getAgencies();
  const news = getFeaturedNews(3);

  return (
    <>
      <HeroB basePath={basePath} />

      <section className="py-20">
        <Container>
          <StatCounterBand stats={stats} />
        </Container>
      </section>

      <section className="bg-surface-raised py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: ValueIcon, label, text }) => (
              <div key={label} className="rounded-card border border-border bg-surface p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cta text-white">
                  <ValueIcon size={20} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{label}</h3>
                <p className="mt-2 text-sm text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
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

      <section className="bg-surface-raised py-20">
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

      <section className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Heading as="h2" size="h2">Featured News</Heading>
              <p className="mt-2 max-w-2xl text-ink-muted">
                Stay informed with the latest from across the Ministry.
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

      <section className="bg-surface-raised py-20">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="h2">Explore by Topic</Heading>
            <p className="mx-auto mt-2 max-w-xl text-ink-muted">
              Find what you need — from departments and agencies to e-services and stakeholders.
            </p>
          </div>
          <div className="mt-10">
            <TopicDirectory basePath={basePath} />
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

      <section className="bg-surface-raised py-20">
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
