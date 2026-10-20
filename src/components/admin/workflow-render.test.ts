import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EntityForm } from "./EntityForm";
import { WorkflowPanel } from "./WorkflowPanel";
import { PublishGate, WorkflowBadge } from "./ui";
import { PermissionGrid } from "./PermissionGrid";
import { describeChanges } from "@/lib/admin/diff";
import { getEntity } from "@/lib/admin/registry";
import { STATE_LABEL, type WorkflowState } from "@/lib/admin/workflow";

/**
 * Server-renders the approval screens' pieces and checks what a person would read.
 * It cannot judge layout, but it catches wrong wording, missing controls and
 * components that throw, for every state and for both kinds of person.
 */

const news = getEntity("news")!;
const noop = async () => ({});
const actions = { approve: noop, sendBack: noop, discard: noop };

const liveRow = { status: "published", pendingState: null, pendingValues: null, title: "Live headline", excerpt: "Old summary", body: "", kind: "online_news", featured: false, imageUrl: null, gallery: [] };

function panel(state: WorkflowState, publisher: boolean, extra: Record<string, unknown> = {}) {
  const row =
    state === "draft" ? { ...liveRow, status: "draft" }
    : state === "waiting" ? { ...liveRow, status: "pending" }
    : state === "changes-draft" ? { ...liveRow, pendingState: "draft", pendingValues: { excerpt: "New summary" } }
    : state === "changes-waiting" ? { ...liveRow, pendingState: "submitted", pendingValues: { excerpt: "New summary" } }
    : liveRow;
  const { isNew, changes } = describeChanges(news, { ...row, ...extra });
  return renderToStaticMarkup(
    createElement(WorkflowPanel, {
      state,
      singular: "item",
      id: "00000000-0000-4000-8000-000000000009",
      publisher,
      author: "Ada Okafor",
      submittedAt: new Date("2026-10-18T09:30:00Z"),
      reviewNote: (extra.reviewNote as string | undefined) ?? null,
      reviewer: "Chidi Eze",
      reviewedAt: new Date("2026-10-19T10:00:00Z"),
      changes,
      isNew,
      actions,
    })
  );
}

describe("the Approval panel", () => {
  it("shows nothing for a live or archived item", () => {
    expect(panel("live", true)).toBe("");
    expect(panel("archived", false)).toBe("");
  });

  it("tells an editor their draft is off the website, and lets them discard it", () => {
    const html = panel("draft", false);
    expect(html).toContain("Draft");
    expect(html).toContain("not on the website");
    expect(html).toContain("Discard draft");
    expect(html).not.toContain("Approve and publish");
  });

  it("gives a publisher Approve and Send back (with a required note) on a submitted new item", () => {
    const html = panel("waiting", true);
    expect(html).toContain("Waiting for approval");
    expect(html).toContain("What would be published");
    expect(html).toContain("Approve and publish");
    expect(html).toContain("Send back");
    expect(html).toContain("Note to the author");
    expect(html).toContain("Ada Okafor");
  });

  it("does not let an editor decide on their own submission", () => {
    const html = panel("waiting", false);
    expect(html).toContain("Waiting for approval");
    expect(html).not.toContain("Approve and publish");
    expect(html).not.toContain("Send back");
  });

  it("shows proposed changes as before and after, and lets a publisher decide", () => {
    const html = panel("changes-waiting", true);
    expect(html).toContain("On the website now");
    expect(html).toContain("Old summary");
    expect(html).toContain("New summary");
    expect(html).toContain("1 field");
    expect(html).toContain("Approve and publish");
    expect(html).toContain("Discard proposed changes");
    expect(html).toContain("The website still shows the published version");
  });

  it("lets an editor drop proposed changes while they are still being written", () => {
    const html = panel("changes-draft", false);
    expect(html).toContain("Discard proposed changes");
    expect(html).toContain("leaves the website exactly as it is");
    expect(html).not.toContain("Approve and publish");
  });

  it("shows the reviewer's note when work was sent back", () => {
    const html = panel("draft", false, { reviewNote: "Please add the date." });
    expect(html).toContain("Sent back by Chidi Eze");
    expect(html).toContain("Please add the date.");
  });
});

function form(publisher: boolean, state?: WorkflowState) {
  return renderToStaticMarkup(
    createElement(EntityForm, {
      action: noop,
      fields: news.fields,
      initial: { title: "Hello" },
      id: state ? "00000000-0000-4000-8000-000000000009" : undefined,
      version: state ? 3 : undefined,
      uploadMode: "none",
      singular: "item",
      publisher,
      state,
    })
  );
}

describe("the edit form's buttons", () => {
  const buttons = (html: string) => [...html.matchAll(/<button[^>]*type="submit"[^>]*>(.*?)<\/button>/g)].map((m) => m[1].replace(/<[^>]+>/g, ""));

  it("a publisher creating something gets one Create button", () => {
    expect(buttons(form(true))).toEqual(["Create item"]);
  });
  it("an editor creating something gets draft and submit buttons, and the submit one says which intent it sends", () => {
    const html = form(false);
    expect(buttons(html)).toEqual(["Save as draft", "Submit for approval"]);
    expect(html).toMatch(/name="intent"[^>]*value="submit"|value="submit"[^>]*name="intent"/);
  });
  it("a publisher looking at a draft can publish it directly", () => {
    const html = form(true, "draft");
    expect(buttons(html)).toEqual(["Publish now", "Save draft"]);
    expect(html).toMatch(/name="intent"[^>]*value="publish"|value="publish"[^>]*name="intent"/);
  });
  it("an editor editing a live item proposes changes", () => {
    expect(buttons(form(false, "live"))).toEqual(["Save proposed changes", "Submit for approval"]);
  });
  it("carries the version the form was loaded at, so a stale save is refused", () => {
    expect(form(false, "live")).toContain('name="version"');
  });
});

describe("badges, gates and the permission grid", () => {
  it("every state's badge says its state in words", () => {
    for (const state of Object.keys(STATE_LABEL) as WorkflowState[]) expect(renderToStaticMarkup(createElement(WorkflowBadge, { state }))).toContain(STATE_LABEL[state]);
  });

  it("text that goes live on save is read-only, with the reason, for someone who cannot publish", () => {
    const child = createElement("input", { name: "mandate", defaultValue: "x" });
    const blocked = renderToStaticMarkup(createElement(PublishGate as never, { allowed: false }, child));
    expect(blocked).toContain("<fieldset");
    expect(blocked).toContain("disabled");
    expect(blocked).toContain("only someone who can publish");
    const open = renderToStaticMarkup(createElement(PublishGate as never, { allowed: true }, child));
    expect(open).not.toContain("fieldset");
  });

  it("offers Edit and Publish for list sections, and Publish only for text that goes live on save", () => {
    const html = renderToStaticMarkup(createElement(PermissionGrid, { editSelected: ["news"], publishSelected: ["hero"] }));
    expect(html).toContain('aria-label="Can edit News, Photo News &amp; Events"');
    expect(html).toContain('aria-label="Can publish in Mandate, Mission &amp; Vision"');
    expect(html).not.toContain('aria-label="Can edit Mandate, Mission &amp; Vision"');
    expect(html).not.toContain('aria-label="Can edit Contact details &amp; links"');
    // publishing implies editing, so the edit box is ticked for a publisher
    expect(html).toMatch(/name="permissions" checked="" value="hero"/);
  });
});
