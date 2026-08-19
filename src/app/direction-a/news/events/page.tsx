import type { Metadata } from "next";
import { EventsListTemplate } from "@/components/templates/EventsListTemplate";
import { getEvents } from "@/lib/cms";

export const metadata: Metadata = { title: "Events" };

export default function Page() {
  return <EventsListTemplate events={getEvents()} />;
}
