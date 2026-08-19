import { Container } from "@/design-system/primitives/Container";
import { Heading } from "@/design-system/primitives/Heading";
import { Text } from "@/design-system/primitives/Text";

const directions = [
  {
    id: "a",
    href: "/direction-a",
    name: "Direction A — Institutional",
    inspiration: "Inspired by CIA.gov",
    description:
      "Navy and slate register with the ministry's green reserved for calls to action only. Serif display headlines, full-bleed photographic hero with a header that condenses on scroll, and restrained editorial two-column modules.",
    swatch: ["#0b1524", "#45566b", "#007d53", "#f5f3ee"],
  },
  {
    id: "b",
    href: "/direction-b",
    name: "Direction B — Modern Civic",
    inspiration: "Inspired by Lagos State",
    description:
      "The ministry's green used broadly, paired with a brighter secondary palette. Full-height gradient hero, a stat-counter band, bright card grids, and an on-page services directory.",
    swatch: ["#007d53", "#0ea5e9", "#fdb022", "#fafaf7"],
  },
];

export default function DirectionChooserPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b1524] px-4 py-16 text-white">
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#67c79f]">
            Federal Ministry of Transportation
          </p>
          <Heading as="h1" size="display" className="mt-4 text-white">
            Choose a visual direction
          </Heading>
          <Text size="lg" className="mt-4 text-white/70">
            Both directions share the ministry&rsquo;s green branding, full
            navigation, and content. They differ in typography, layout
            rhythm, and imagery treatment.
          </Text>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {directions.map((d) => (
            <a
              key={d.id}
              href={d.href}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-200 hover:border-[#007d53] hover:bg-white/[0.06]"
            >
              <div className="flex gap-2">
                {d.swatch.map((c) => (
                  <span
                    key={c}
                    className="h-8 w-8 rounded-full border border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                {d.inspiration}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{d.name}</h2>
              <p className="mt-3 text-white/70">{d.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#67c79f] transition-transform duration-200 group-hover:translate-x-1">
                View this direction →
              </span>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}
