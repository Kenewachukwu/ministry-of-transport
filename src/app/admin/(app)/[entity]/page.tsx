import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { Notice, PageTitle, Panel, StatusBadge } from "@/components/admin/ui";
import { ReorderList } from "@/components/admin/ReorderList";
import { RowAction } from "@/components/admin/RowAction";
import { requireSectionPage } from "@/lib/auth/dal";
import { countByStatus, listRows, rowTitle } from "@/lib/dal/admin/crud";
import { ENTITY_GUIDE } from "@/lib/admin/help";
import { getEntity } from "@/lib/admin/registry";
import { cn } from "@/lib/utils";
import { archiveEntityAction, reorderEntityAction, restoreEntityAction } from "./actions";
import { FcssipHeader } from "./FcssipHeader";

export async function generateMetadata({ params }: { params: Promise<{ entity: string }> }): Promise<Metadata> {
  const def = getEntity((await params).entity);
  return { title: def?.plural ?? "Not found" };
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

type SearchParams = { status?: string; filter?: string; archived?: string; q?: string };

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-control px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta",
        active ? "bg-brand-50 text-cta" : "text-ink-muted hover:bg-surface hover:text-cta"
      )}
    >
      {children}
    </Link>
  );
}

export default async function EntityListPage({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<SearchParams> }) {
  const { entity } = await params;
  const def = getEntity(entity);
  if (!def) notFound();
  const user = await requireSectionPage(def.section);
  const sp = await searchParams;
  const status = sp.status === "archived" ? "archived" : "published";
  const filter = def.filter?.options.some((o) => o.value === sp.filter) ? sp.filter : undefined;
  const q = sp.q?.trim().slice(0, 100) || undefined;

  const [rows, counts] = await Promise.all([listRows(def, user, { status, filter, q }), countByStatus(def, user)]);

  const base = `/admin/${def.key}`;
  const qs = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { status: sp.status, filter: sp.filter, q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `${base}?${s}` : base;
  };

  const archive = archiveEntityAction.bind(null, def.key);
  const restore = restoreEntityAction.bind(null, def.key);
  const reorder = reorderEntityAction.bind(null, def.key);

  const reorderable = def.orderable && status === "published" && !filter && !q;
  const items = rows.map((r) => ({
    id: String(r.id),
    title: rowTitle(def, r),
    subtitle: def.subtitle?.(r) ?? null,
    editHref: `${base}/${String(r.id)}`,
    viewHref: def.publicPath?.(r) ?? null,
  }));

  return (
    <>
      <PageTitle
        title={def.plural}
        description={def.description}
        actions={
          <>
            <HelpLink slug={ENTITY_GUIDE[def.key]} />
          <Link href={`${base}/new`} className="inline-flex items-center gap-1.5 rounded-control bg-cta px-4 py-2 text-sm font-semibold text-cta-ink transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
            <Plus size={15} aria-hidden /> Add {def.singular}
          </Link>
          </>
        }
      />

      {def.key === "fcssip" && <FcssipHeader />}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" role="tablist" aria-label="Show">
          <Tab href={qs({ status: undefined })} active={status === "published"}>Published ({counts.published})</Tab>
          <Tab href={qs({ status: "archived" })} active={status === "archived"}>Archived ({counts.archived})</Tab>
        </div>
        {def.filter && (
          <div className="flex flex-wrap items-center gap-1" aria-label={def.filter.label}>
            <Tab href={qs({ filter: undefined })} active={!filter}>All</Tab>
            {def.filter.options.map((o) => (
              <Tab key={o.value} href={qs({ filter: o.value })} active={filter === o.value}>{o.label.split(" (")[0]}</Tab>
            ))}
          </div>
        )}
      </div>

      <form method="get" role="search" className="mb-4 flex flex-wrap items-center gap-2">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {filter && <input type="hidden" name="filter" value={filter} />}
        <label htmlFor="list-search" className="sr-only">
          Search {def.plural.toLowerCase()}
        </label>
        <input
          id="list-search"
          type="search"
          name="q"
          defaultValue={q ?? ""}
          maxLength={100}
          placeholder={`Search ${def.plural.toLowerCase()}`}
          className="w-full max-w-sm rounded-control border border-border bg-surface-raised px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
        />
        <button type="submit" className="rounded-control border border-border px-3.5 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
          Search
        </button>
        {q && (
          <Link href={qs({ q: undefined })} className="text-sm font-semibold text-cta hover:underline focus-visible:underline">
            Clear search
          </Link>
        )}
      </form>
      {q && (
        <p role="status" className="mb-4 text-sm text-ink-muted">
          {rows.length === 0 ? "Nothing matches" : `${rows.length} found for`} &ldquo;{q}&rdquo; in {status === "archived" ? "Archived" : "Published"}.
        </p>
      )}

      {status === "archived" && counts.archived > 0 && (
        <Notice>Archived items are hidden from the website. Restore one to publish it again; it rejoins at the end of the list.</Notice>
      )}

      {items.length === 0 ? (
        <Panel>
          <p className="text-sm text-ink-muted">
            {q ? "Try a different word, or clear the search." : status === "archived" ? "Nothing has been archived." : `There are no ${def.plural.toLowerCase()} yet.`}
          </p>
        </Panel>
      ) : reorderable ? (
        <ReorderList items={items} reorderAction={reorder} archiveAction={archive} singular={def.singular} />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => {
            const item = items[i];
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-3 rounded-control border border-border bg-surface-raised px-4 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={item.editHref} className="block truncate text-sm font-semibold text-ink hover:text-cta focus-visible:text-cta">
                    {item.title}
                  </Link>
                  <p className="truncate text-xs text-ink-muted">
                    {item.subtitle}
                    {r.updatedAt instanceof Date && <span> · edited {dateFmt.format(r.updatedAt)}</span>}
                  </p>
                </div>
                <StatusBadge status={r.status === "archived" ? "archived" : "published"} />
                <div className="flex items-center gap-2">
                  <Link href={item.editHref} className="rounded-control border border-border px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-cta hover:text-cta">Edit</Link>
                  {r.status === "archived" ? (
                    <RowAction action={restore} id={item.id} label="Restore" />
                  ) : (
                    <RowAction action={archive} id={item.id} label="Archive" tone="danger" confirmMessage={`Archive this ${def.singular}? It will disappear from the website, but you can restore it later.`} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
