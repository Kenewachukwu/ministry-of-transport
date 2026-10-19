import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { z } from "zod";
import { EntityForm } from "@/components/admin/EntityForm";
import { RowAction } from "@/components/admin/RowAction";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { Notice, PageTitle, Panel, StatusBadge } from "@/components/admin/ui";
import { requireSectionPage } from "@/lib/auth/dal";
import { getRow, rowTitle } from "@/lib/dal/admin/crud";
import { ENTITY_GUIDE } from "@/lib/admin/help";
import { getEntity } from "@/lib/admin/registry";
import { toFormValues } from "@/lib/admin/parse";
import { storageMode } from "@/lib/storage/mode";
import { archiveEntityAction, restoreEntityAction, saveEntityAction } from "../actions";

export async function generateMetadata({ params }: { params: Promise<{ entity: string }> }): Promise<Metadata> {
  const def = getEntity((await params).entity);
  return { title: def ? `Edit ${def.singular}` : "Not found" };
}

export default async function EditEntityPage({ params, searchParams }: { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { entity, id } = await params;
  const def = getEntity(entity);
  if (!def || !z.uuid().safeParse(id).success) notFound();
  const user = await requireSectionPage(def.section);
  const row = await getRow(def, user, id);
  if (!row) notFound();
  const { created } = await searchParams;

  const archived = row.status === "archived";
  const initial = toFormValues(def.fields, def.fromRow ? def.fromRow(row) : row);
  const viewHref = def.publicPath?.(row) ?? null;

  return (
    <>
      <PageTitle
        title={rowTitle(def, row)}
        description={def.subtitle?.(row) ?? undefined}
        actions={
          <>
            <HelpLink slug={ENTITY_GUIDE[def.key]} />
            <Link href={`/admin/${def.key}`} className="rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">← Back to the list</Link>
            {viewHref && !archived && (
              <Link href={viewHref} target="_blank" className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-cta hover:text-cta">
                View on website <ExternalLink size={13} aria-hidden />
              </Link>
            )}
          </>
        }
      />
      {created && <Notice tone="success">Created. It&rsquo;s live on the website.</Notice>}
      {archived && (
        <Panel className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <StatusBadge status="archived" /> This {def.singular} is archived, so it isn&rsquo;t shown on the website.
            </p>
            <RowAction action={restoreEntityAction.bind(null, def.key)} id={id} label="Restore" />
          </div>
        </Panel>
      )}

      <Panel>
        <EntityForm
          action={saveEntityAction.bind(null, def.key)}
          fields={def.fields}
          initial={initial}
          id={id}
          version={Number(row.version)}
          uploadMode={storageMode()}
          submitLabel="Save changes"
        />
      </Panel>

      {!archived && (
        <Panel title="Archive" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-ink-muted">Archiving hides this {def.singular} from the website. Nothing is deleted — you can restore it from the Archived tab at any time.</p>
            <RowAction action={archiveEntityAction.bind(null, def.key)} id={id} label={`Archive this ${def.singular}`} tone="danger" confirmMessage={`Archive this ${def.singular}? It will disappear from the website, but you can restore it later.`} />
          </div>
        </Panel>
      )}
    </>
  );
}
