import { RowAction } from "./RowAction";
import { ActionForm, SubmitButton, TextArea } from "./form";
import { Panel, WorkflowBadge } from "./ui";
import type { FieldChange } from "@/lib/admin/diff";
import { isAwaitingDecision, type WorkflowState } from "@/lib/admin/workflow";
import type { ActionState } from "@/lib/admin/action";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

const whenFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const when = (value: unknown) => (value instanceof Date ? whenFmt.format(value) : value ? whenFmt.format(new Date(String(value))) : null);

/** The values a publisher is being asked to approve: before/after for proposed changes, or the whole item when it is new. */
export function ChangeList({ changes, isNew }: { changes: FieldChange[]; isNew: boolean }) {
  if (changes.length === 0) return <p className="text-sm text-ink-muted">No differences from what is on the website.</p>;
  return (
    <dl className="flex flex-col gap-4">
      {changes.map((c) => (
        <div key={c.name} className="rounded-control border border-border p-3">
          <dt className="text-sm font-semibold text-ink">{c.label}</dt>
          <dd className="mt-2 grid gap-3 sm:grid-cols-2">
            {!isNew && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">On the website now</p>
                <Value text={c.before} image={c.beforeImage} />
              </div>
            )}
            <div className={isNew ? "sm:col-span-2" : undefined}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{isNew ? "Content" : "Proposed"}</p>
              <Value text={c.after} image={c.afterImage} emphasise={!isNew} />
            </div>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Value({ text, image, emphasise }: { text: string; image?: string; emphasise?: boolean }) {
  return (
    <div className="flex gap-3">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded picture
        <img src={image} alt="" className="h-16 w-24 shrink-0 rounded-control border border-border bg-brand-50 object-cover" />
      )}
      <p className={emphasise ? "whitespace-pre-wrap break-words rounded-control bg-brand-50 px-2 py-1 text-sm text-ink" : "whitespace-pre-wrap break-words text-sm text-ink"}>{text}</p>
    </div>
  );
}

/**
 * Everything about an item's approval status on its edit page: what state it is in
 * and what that means for the website, any note a publisher sent back, the changes
 * under review, and the controls that person may use (approve, send back, discard).
 */
export function WorkflowPanel({
  state,
  singular,
  id,
  publisher,
  author,
  submittedAt,
  reviewNote,
  reviewer,
  reviewedAt,
  changes,
  isNew,
  actions,
}: {
  state: WorkflowState;
  singular: string;
  id: string;
  publisher: boolean;
  author: string | null;
  submittedAt: unknown;
  reviewNote: string | null;
  reviewer: string | null;
  reviewedAt: unknown;
  changes: FieldChange[];
  isNew: boolean;
  actions: { approve: Action; sendBack: Action; discard: Action };
}) {
  if (state === "live" || state === "archived") return null;
  const waiting = isAwaitingDecision(state);
  const proposal = state === "changes-draft" || state === "changes-waiting";
  const by = author ? ` by ${author}` : "";
  const at = when(submittedAt);

  const sentence = {
    draft: `This ${singular} is a draft${by}. It is not on the website.`,
    waiting: `Submitted for approval${by}${at ? ` on ${at}` : ""}. It is not on the website until a publisher approves it.`,
    "changes-draft": `Changes to this ${singular} are being written${by}. The website still shows the published version.`,
    "changes-waiting": `Changes to this ${singular} were submitted for approval${by}${at ? ` on ${at}` : ""}. The website still shows the published version.`,
  }[state];

  return (
    <Panel className="mb-6" title="Approval">
      <div className="flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-2 text-sm text-ink">
          <WorkflowBadge state={state} /> <span>{sentence}</span>
        </p>

        {reviewNote && (
          <div role="note" className="rounded-control border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">
              Sent back{reviewer ? ` by ${reviewer}` : ""}
              {when(reviewedAt) ? ` on ${when(reviewedAt)}` : ""}
            </p>
            <p className="mt-1 whitespace-pre-wrap">{reviewNote}</p>
          </div>
        )}

        {(waiting || proposal) && changes.length > 0 && (
          <details open={waiting && publisher} className="rounded-control border border-border">
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-ink">
              {isNew ? "What would be published" : `What would change (${changes.length} ${changes.length === 1 ? "field" : "fields"})`}
            </summary>
            <div className="border-t border-border p-3">
              <ChangeList changes={changes} isNew={isNew} />
            </div>
          </details>
        )}

        {waiting && publisher && (
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div className="flex flex-wrap items-start gap-3">
              <RowAction action={actions.approve} id={id} label="Approve and publish" tone="primary" />
              <p className="max-w-md pt-1.5 text-xs text-ink-muted">{isNew ? `Puts this ${singular} on the website straight away.` : "Replaces the published version with these changes straight away."}</p>
            </div>
            <ActionForm action={actions.sendBack}>
              <input type="hidden" name="id" value={id} />
              <TextArea name="note" label="Note to the author" rows={3} required maxLength={1000} help="Say what needs to change. They will see this when they open the item." />
              <div>
                <SubmitButton variant="secondary">Send back</SubmitButton>
              </div>
            </ActionForm>
          </div>
        )}

        {(publisher || !waiting) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="max-w-xl text-xs text-ink-muted">
              {proposal ? "Dropping the proposed changes leaves the website exactly as it is." : `Discarding hides this ${singular} (it is archived, not deleted).`}
            </p>
            <RowAction
              action={actions.discard}
              id={id}
              label={proposal ? "Discard proposed changes" : "Discard draft"}
              tone="danger"
              confirmMessage={proposal ? "Discard the proposed changes? The website is not affected." : `Discard this draft? It will be archived, and a publisher can restore it.`}
            />
          </div>
        )}
      </div>
    </Panel>
  );
}
