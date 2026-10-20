import type { Metadata } from "next";
import Link from "next/link";
import { HelpLink } from "@/components/admin/help/HelpLink";
import { Notice, PageTitle, Panel, WorkflowBadge } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth/dal";
import { canPublishAnywhere } from "@/lib/auth/permissions";
import { listWaiting, personNames, rowTitle } from "@/lib/dal/admin/crud";
import { ENTITIES } from "@/lib/admin/registry";
import { workflowState } from "@/lib/admin/workflow";

export const metadata: Metadata = { title: "Approvals" };

const whenFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Everything waiting for a decision in the sections this person can publish in, oldest first. */
export default async function ReviewQueuePage() {
  const user = await requireUser();
  const allowed = canPublishAnywhere(user);
  const waiting = allowed ? await listWaiting(user, ENTITIES) : [];
  const names = await personNames(waiting.map((w) => (w.row.pendingBy ?? w.row.createdBy) as string | null));

  return (
    <>
      <PageTitle
        title="Approvals"
        description="Work that colleagues have submitted for your decision. Open an item to see exactly what would change, then approve it or send it back with a note."
        actions={<HelpLink slug="approve-or-return-work" />}
      />
      {!allowed && (
        <Notice tone="warn">Only people who can publish in a section review its submissions. Ask a super administrator if you should have that permission.</Notice>
      )}
      {allowed && waiting.length === 0 && (
        <Panel>
          <p className="text-sm text-ink-muted">Nothing is waiting for your decision. New submissions appear here, and the number shows beside Approvals in the menu.</p>
        </Panel>
      )}
      {waiting.length > 0 && (
        <ul className="flex flex-col gap-2">
          {waiting.map(({ def, row }) => {
            const id = String(row.id);
            const state = workflowState(row);
            const authorId = (row.pendingBy ?? row.createdBy) as string | null;
            const at = row.pendingAt ?? row.updatedAt;
            const title = rowTitle(def, { ...row, ...((row.pendingValues as object | null) ?? {}) });
            return (
              <li key={`${def.key}:${id}`} className="flex flex-wrap items-center gap-3 rounded-control border border-border bg-surface-raised px-4 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/${def.key}/${id}`} className="block truncate text-sm font-semibold text-ink hover:text-cta focus-visible:text-cta">
                    {title}
                  </Link>
                  <p className="truncate text-xs text-ink-muted">
                    {def.plural}
                    {authorId && names.get(authorId) ? ` · from ${names.get(authorId)}` : ""}
                    {at ? ` · ${whenFmt.format(new Date(String(at)))}` : ""}
                  </p>
                </div>
                <WorkflowBadge state={state} />
                <Link
                  href={`/admin/${def.key}/${id}`}
                  className="rounded-control border border-border px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                >
                  Review
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
