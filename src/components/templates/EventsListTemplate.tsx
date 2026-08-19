import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/design-system/primitives/Container";
import { PageHeader } from "./PageHeader";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import type { EventItem } from "@/content/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" });

export function EventsListTemplate({ events }: { events: EventItem[] }) {
  return (
    <>
      <PageHeader eyebrow="News & Events" title="Events" description="Council sessions, commissionings, and other Ministry events." />
      <section className="py-16">
        <Container size="narrow">
          <ScrollRevealGroup className="flex flex-col gap-4">
            {events.map((event) => (
              <ScrollRevealItem key={event.id}>
                <div className="rounded-card border border-border bg-surface-raised p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">{event.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} aria-hidden /> {dateFormatter.format(new Date(event.date))}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} aria-hidden /> {event.location}
                    </span>
                  </div>
                  <p className="mt-3 text-ink-muted">{event.summary}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </section>
    </>
  );
}
