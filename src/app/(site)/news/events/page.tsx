import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { EventsListTemplate } from "@/components/templates/EventsListTemplate";
import { getEvents } from "@/lib/cms";

export const metadata: Metadata = pageMetadata("Events", "Upcoming and past events of the Federal Ministry of Transportation.", "/news/events");

export default async function Page() {
  return <EventsListTemplate events={await getEvents()} />;
}
