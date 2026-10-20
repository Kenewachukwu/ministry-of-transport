import type { Row } from "./registry";

/**
 * Where an item is in the approval workflow. Pure, so pages, badges and tests
 * can all use it.
 *  - draft: never published, still being written;
 *  - waiting: never published, submitted for a publisher's decision;
 *  - live: published, nothing proposed;
 *  - changes-draft / changes-waiting: published, with proposed changes being written / waiting for a decision;
 *  - archived.
 */
export type WorkflowState = "draft" | "waiting" | "changes-draft" | "changes-waiting" | "live" | "archived";

export function workflowState(row: Row): WorkflowState {
  if (row.status === "archived") return "archived";
  if (row.status === "draft") return "draft";
  if (row.status === "pending") return "waiting";
  if (row.pendingState === "submitted") return "changes-waiting";
  if (row.pendingState === "draft") return "changes-draft";
  return "live";
}

/** What someone is looking at when they edit an item: the live values, with any proposed changes laid over them. */
export function effectiveRow(row: Row): Row {
  const pending = row.pendingValues;
  return pending && typeof pending === "object" ? { ...row, ...(pending as Row) } : row;
}

/** Is this item on the public website right now? */
export const isOnWebsite = (state: WorkflowState): boolean => state === "live" || state === "changes-draft" || state === "changes-waiting";

/** Is a publisher's decision needed? */
export const isAwaitingDecision = (state: WorkflowState): boolean => state === "waiting" || state === "changes-waiting";

/** Is the item (or its proposed change) a work in progress that its author can still edit and submit? */
export const isDraftLike = (state: WorkflowState): boolean => state === "draft" || state === "changes-draft";

/** The words used for each state, in lists and on the edit page. */
export const STATE_LABEL: Record<WorkflowState, string> = {
  live: "Published",
  draft: "Draft",
  waiting: "Waiting for approval",
  "changes-draft": "Published · changes in draft",
  "changes-waiting": "Published · changes waiting",
  archived: "Archived",
};

export interface SaveButton {
  label: string;
  /** What the server is told: save (default), submit for approval, or publish now. */
  intent?: "submit" | "publish";
}

/**
 * Which buttons the form offers. The first is the main one (and what Enter does).
 * The wording says what will happen: a publisher's save goes live, an editor's
 * becomes a draft or a proposal that waits for a publisher.
 */
export function saveButtons({ isEdit, publisher, state, singular }: { isEdit: boolean; publisher: boolean; state?: WorkflowState; singular: string }): { buttons: SaveButton[]; hint?: string } {
  if (!isEdit) {
    return publisher
      ? { buttons: [{ label: `Create ${singular}` }], hint: "It goes live on the website as soon as you create it." }
      : { buttons: [{ label: "Save as draft" }, { label: "Submit for approval", intent: "submit" }], hint: "A draft is not on the website. When it is ready, submit it and a publisher will review it." };
  }
  if (state === "archived") return { buttons: [{ label: "Save changes" }], hint: "This is archived, so it is not on the website. Restore it first to publish it again." };
  if (publisher) {
    if (state === "draft" || state === "waiting") {
      return { buttons: [{ label: "Publish now", intent: "publish" }, { label: "Save draft" }], hint: "Publishing puts it on the website straight away." };
    }
    return {
      buttons: [{ label: "Save changes" }],
      hint: state === "changes-draft" || state === "changes-waiting" ? "Saving here puts your version on the website and replaces the proposed changes." : "Changes go live on the website as soon as you save them.",
    };
  }
  switch (state) {
    case "draft":
      return { buttons: [{ label: "Save draft" }, { label: "Submit for approval", intent: "submit" }], hint: "A draft is not on the website until a publisher approves it." };
    case "waiting":
    case "changes-waiting":
      return {
        buttons: [{ label: "Save changes" }, { label: "Save and resubmit for approval", intent: "submit" }],
        hint: "Saving takes this out of the approval queue until you submit it again.",
      };
    default:
      return { buttons: [{ label: "Save proposed changes" }, { label: "Submit for approval", intent: "submit" }], hint: "The website keeps showing the published version until a publisher approves your changes." };
  }
}
