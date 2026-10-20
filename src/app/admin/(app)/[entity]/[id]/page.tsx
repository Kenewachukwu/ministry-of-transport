import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { z } from "zod";
import { EntityForm } from "@/components/admin/EntityForm";
import { RowAction } from "@/components/admin/RowAction";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { WorkflowPanel } from "@/components/admin/WorkflowPanel";
import { Notice, PageTitle, Panel, StatusBadge } from "@/components/admin/ui";
import { requireSectionPage } from "@/lib/auth/dal";
import { canPublish } from "@/lib/auth/permissions";
import { getRow, personNames, rowTitle } from "@/lib/dal/admin/crud";
import { describeChanges } from "@/lib/admin/diff";
import { effectiveRow, isOnWebsite, workflowState } from "@/lib/admin/workflow";
import { ENTITY_GUIDE } from "@/lib/admin/help";
import { getEntity } from "@/lib/admin/registry";
import { toFormValues } from "@/lib/admin/parse";
import { storageMode } from "@/lib/storage/mode";
import { approveEntityAction, archiveEntityAction, discardEntityAction, restoreEntityAction, returnEntityAction, saveEntityAction } from "../actions";

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

  const state = workflowState(row);
  const archived = state === "archived";
  const publisher = canPublish(user, def.section);
  // What the form shows: the live values, with any proposed changes laid over them.
  const shown = effectiveRow(row);
  const initial = toFormValues(def.fields, def.fromRow ? def.fromRow(shown) : shown);
  const viewHref = isOnWebsite(state) ? (def.publicPath?.(row) ?? null) : null;
  const names = await personNames([row.pendingBy as string | null, row.createdBy as string | null, row.reviewedBy as string | null]);
  const { isNew, changes } = describeChanges(def, row);
  const authorId = (row.pendingBy ?? row.createdBy) as string | null;

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
      {created === "live" && <Notice tone="success">Created. It&rsquo;s live on the website.</Notice>}
      {created === "draft" && <Notice tone="success">Draft saved. It is not on the website yet. When it is ready, press &ldquo;Submit for approval&rdquo;.</Notice>}
      {created === "submitted" && <Notice tone="success">Submitted for approval. A publisher will review it; it is not on the website until they approve it.</Notice>}
      {archived && (
        <Panel className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <StatusBadge status="archived" /> This {def.singular} is archived, so it isn&rsquo;t shown on the website.
            </p>
            {publisher ? <RowAction action={restoreEntityAction.bind(null, def.key)} id={id} label="Restore" /> : <span className="text-xs text-ink-muted">A publisher can restore it.</span>}
          </div>
        </Panel>
      )}

      <WorkflowPanel
        state={state}
        singular={def.singular}
        id={id}
        publisher={publisher}
        author={authorId ? (names.get(authorId) ?? null) : null}
        submittedAt={row.pendingAt}
        reviewNote={(row.reviewNote as string | null) ?? null}
        reviewer={row.reviewedBy ? (names.get(String(row.reviewedBy)) ?? null) : null}
        reviewedAt={row.reviewedAt}
        changes={changes}
        isNew={isNew}
        actions={{
          approve: approveEntityAction.bind(null, def.key),
          sendBack: returnEntityAction.bind(null, def.key),
          discard: discardEntityAction.bind(null, def.key),
        }}
      />

      <Panel>
        <EntityForm
          action={saveEntityAction.bind(null, def.key)}
          fields={def.fields}
          initial={initial}
          id={id}
          version={Number(row.version)}
          uploadMode={storageMode()}
          singular={def.singular}
          publisher={publisher}
          state={state}
        />
      </Panel>

      {!archived && publisher && (
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
