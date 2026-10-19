"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AREA_ORDER, HELP_AREAS, searchEntries, type GuideIndexEntry } from "@/lib/admin/help/client";

function GuideRow({ entry }: { entry: GuideIndexEntry }) {
  return (
    <li>
      <Link
        href={`/admin/help/${entry.slug}`}
        className="block rounded-control border border-border bg-surface-raised px-4 py-3 transition-colors hover:border-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
      >
        <span className="block text-sm font-semibold text-ink">{entry.title}</span>
        <span className="mt-0.5 block text-xs text-ink-muted">
          {entry.summary}
          {entry.time ? ` · ${entry.time}` : ""}
        </span>
      </Link>
    </li>
  );
}

function ByArea({ entries }: { entries: GuideIndexEntry[] }) {
  return (
    <div className="flex flex-col gap-8">
      {AREA_ORDER.map((area) => {
        const inArea = entries.filter((e) => e.area === area);
        if (inArea.length === 0) return null;
        return (
          <section key={area} aria-labelledby={`area-${area}`}>
            <h3 id={`area-${area}`} className="font-display text-lg font-semibold text-ink">
              {HELP_AREAS[area].title}
            </h3>
            <p className="mb-3 mt-0.5 text-sm text-ink-muted">{HELP_AREAS[area].blurb}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {inArea.map((e) => (
                <GuideRow key={e.slug} entry={e} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/**
 * The Help home: a search box over every guide, then the guides for what the
 * person can do, then the rest. Search is instant and runs in the browser.
 */
export function HelpIndex({ entries }: { entries: GuideIndexEntry[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const mine = useMemo(() => entries.filter((e) => e.mine), [entries]);
  const others = useMemo(() => entries.filter((e) => !e.mine), [entries]);
  const results = useMemo(() => searchEntries(entries, query), [entries, query]);
  const searching = query.trim().length > 0;

  return (
    <div>
      <div role="search" className="relative max-w-xl">
        <label htmlFor={inputId} className="sr-only">
          Search the guides
        </label>
        <Search size={16} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search, for example: picture, archive, password"
          className="w-full rounded-control border border-border bg-surface-raised py-3 pl-10 pr-4 text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
        />
      </div>

      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-ink-muted">
        {searching ? (results.length === 0 ? "No guides match that. Try a shorter or different word." : `${results.length} guide${results.length === 1 ? "" : "s"} found`) : ""}
      </p>

      {searching ? (
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {results.map((e) => (
            <GuideRow key={e.slug} entry={e} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col gap-12">
          <div>
            <h2 className="mb-5 font-display text-xl font-semibold text-ink">For you</h2>
            <ByArea entries={mine} />
          </div>
          {others.length > 0 && (
            <details className="rounded-card border border-border bg-surface-raised p-5">
              <summary className="cursor-pointer font-display text-lg font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
                Guides for other sections and roles ({others.length})
              </summary>
              <p className="mb-5 mt-2 text-sm text-ink-muted">You do not have access to these yet, but you can read what they involve.</p>
              <ByArea entries={others} />
            </details>
          )}
        </div>
      )}
    </div>
  );
}
