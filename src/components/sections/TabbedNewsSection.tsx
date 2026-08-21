"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { NewsItem, EventItem } from "@/content/types";
import { getNewsImage } from "@/lib/newsImage";
import { cn } from "@/lib/utils";

const TABS = ["News", "Press Releases", "Events"] as const;
type Tab = (typeof TABS)[number];

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function NewsCard({ item, basePath }: { item: NewsItem; basePath: string }) {
  return (
    <Link
      href={`${basePath}/news/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-card transition-all duration-200 hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <Image
          src={getNewsImage(item)}
          alt=""
          width={506}
          height={316}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-cta">
          {item.category}
        </span>
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-ink">
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-ink-muted">{item.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
          <span>{dateFmt.format(new Date(item.date))}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden />
            {item.readTimeMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ item }: { item: EventItem }) {
  const d = new Date(item.date);
  const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.toLocaleDateString("en-GB", { year: "numeric" });

  return (
    <div className="flex gap-5 rounded-card border border-border bg-surface-raised p-5 shadow-card">
      <div className="flex w-14 shrink-0 flex-col items-center justify-start rounded bg-cta py-2 text-cta-ink">
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">
          {month}
        </span>
        <span className="mt-0.5 text-[10px] opacity-70">{year}</span>
      </div>
      <div className="flex flex-col">
        <h3 className="font-display text-base font-semibold leading-snug text-ink">
          {item.title}
        </h3>
        <span className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin size={11} aria-hidden />
          {item.location}
        </span>
        <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>
      </div>
    </div>
  );
}

export function TabbedNewsSection({
  news,
  events,
  basePath,
}: {
  news: NewsItem[];
  events: EventItem[];
  basePath: string;
}) {
  const [active, setActive] = useState<Tab>("News");

  const items = {
    News: news.slice(0, 3),
    "Press Releases": news.filter((n) => n.category === "Press Release").slice(0, 3),
    Events: events.slice(0, 3),
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-8 border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative pb-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2",
              active === tab ? "text-ink" : "text-ink-muted hover:text-ink"
            )}
          >
            {tab}
            {active === tab && (
              <motion.div
                layoutId="news-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="mt-8" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {active === "Events" ? (
              <div className="flex flex-col gap-4">
                {items.Events.length > 0 ? (
                  items.Events.map((e) => <EventCard key={e.id} item={e} />)
                ) : (
                  <p className="text-ink-muted">No upcoming events.</p>
                )}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {items[active].length > 0 ? (
                  items[active].map((item) => (
                    <NewsCard key={item.id} item={item as NewsItem} basePath={basePath} />
                  ))
                ) : (
                  <p className="text-ink-muted col-span-3">No items in this category yet.</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
