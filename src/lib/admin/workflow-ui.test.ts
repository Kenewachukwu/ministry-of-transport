import { describe, expect, it } from "vitest";
import { describeChanges, describeValue } from "./diff";
import { getEntity } from "./registry";
import { effectiveRow, isAwaitingDecision, isOnWebsite, saveButtons, STATE_LABEL, workflowState, type WorkflowState } from "./workflow";
import { DIRECT_SECTIONS, SECTIONS, canPublish, canPublishAnywhere } from "@/lib/auth/permissions";
import { normaliseGrants } from "@/lib/auth/users";

const news = getEntity("news")!;
const hero = getEntity("hero")!;

const liveRow = {
  status: "published",
  pendingState: null,
  pendingValues: null,
  title: "Live headline",
  excerpt: "Old summary",
  body: "",
  kind: "online_news",
  featured: false,
  imageUrl: null,
  gallery: [],
};

describe("workflowState", () => {
  it("names every combination of status and proposal", () => {
    expect(workflowState({ status: "draft" })).toBe("draft");
    expect(workflowState({ status: "pending" })).toBe("waiting");
    expect(workflowState({ status: "published", pendingState: "draft" })).toBe("changes-draft");
    expect(workflowState({ status: "published", pendingState: "submitted" })).toBe("changes-waiting");
    expect(workflowState({ status: "published", pendingState: null })).toBe("live");
    expect(workflowState({ status: "archived", pendingState: "draft" })).toBe("archived");
  });

  it("knows what is on the website and what needs a decision", () => {
    const onSite = (["live", "changes-draft", "changes-waiting"] as WorkflowState[]).every(isOnWebsite);
    const offSite = (["draft", "waiting", "archived"] as WorkflowState[]).some(isOnWebsite);
    expect(onSite).toBe(true);
    expect(offSite).toBe(false);
    expect((["waiting", "changes-waiting"] as WorkflowState[]).every(isAwaitingDecision)).toBe(true);
    expect((["draft", "changes-draft", "live", "archived"] as WorkflowState[]).some(isAwaitingDecision)).toBe(false);
  });

  it("every state has a label that is not just a colour", () => {
    for (const s of ["live", "draft", "waiting", "changes-draft", "changes-waiting", "archived"] as WorkflowState[]) expect(STATE_LABEL[s].length).toBeGreaterThan(3);
  });
});

describe("describeChanges (what a publisher reviews)", () => {
  it("shows only the fields that differ, with before and after", () => {
    const row = { ...liveRow, pendingState: "submitted", pendingValues: { excerpt: "New summary", featured: true } };
    const { isNew, changes } = describeChanges(news, row);
    expect(isNew).toBe(false);
    expect(changes.map((c) => c.name).sort()).toEqual(["excerpt", "featured"]);
    const excerpt = changes.find((c) => c.name === "excerpt")!;
    expect(excerpt.before).toBe("Old summary");
    expect(excerpt.after).toBe("New summary");
    expect(changes.find((c) => c.name === "featured")).toMatchObject({ before: "No", after: "Yes" });
  });

  it("reports nothing when the proposal equals what is live", () => {
    const row = { ...liveRow, pendingState: "submitted", pendingValues: { excerpt: "Old summary" } };
    expect(describeChanges(news, row).changes).toEqual([]);
  });

  it("for a new item lists every filled-in field as content", () => {
    const row = { ...liveRow, status: "pending", title: "Brand new", excerpt: "Summary", featured: false };
    const { isNew, changes } = describeChanges(news, row);
    expect(isNew).toBe(true);
    const names = changes.map((c) => c.name);
    expect(names).toContain("title");
    expect(names).toContain("excerpt");
    expect(names).not.toContain("body"); // empty fields are left out
    expect(changes.every((c) => c.before === "(empty)")).toBe(true);
  });

  it("carries picture links so the reviewer can see the picture", () => {
    const row = { status: "published", pendingState: "submitted", pendingValues: { imageUrl: "/images/new.jpg" }, imageUrl: "/images/old.jpg", headline: "H", eyebrow: "E", body: "B", ctaLabel: "Go", ctaHref: "/about", imageAlt: "Road" };
    const change = describeChanges(hero, row).changes.find((c) => c.name === "imageUrl")!;
    expect(change.beforeImage).toBe("/images/old.jpg");
    expect(change.afterImage).toBe("/images/new.jpg");
  });

  it("effectiveRow lays proposed values over the live ones", () => {
    expect(effectiveRow({ a: 1, b: 2, pendingValues: { b: 3 } })).toMatchObject({ a: 1, b: 3 });
    expect(effectiveRow({ a: 1, pendingValues: null })).toMatchObject({ a: 1 });
  });
});

describe("describeValue", () => {
  const field = (name: string) => news.fields.find((f) => f.name === name)!;
  it("reads each kind of value in plain words", () => {
    expect(describeValue(field("featured"), true)).toBe("Yes");
    expect(describeValue(field("kind"), "online_news")).not.toBe("online_news"); // the option's label, not the stored value
    expect(describeValue(field("gallery"), [{ src: "/a/one.jpg", alt: "A road", caption: "Opening" }])).toContain("1 picture");
    expect(describeValue(field("gallery"), [])).toBe("(empty)");
    expect(describeValue(field("excerpt"), "")).toBe("(empty)");
    expect(describeValue(field("excerpt"), null)).toBe("(empty)");
  });
});

describe("the buttons the form offers", () => {
  const labels = (args: Parameters<typeof saveButtons>[0]) => saveButtons(args).buttons.map((b) => `${b.label}${b.intent ? `:${b.intent}` : ""}`);

  it("a publisher creates straight away", () => {
    expect(labels({ isEdit: false, publisher: true, singular: "story" })).toEqual(["Create story"]);
  });
  it("an editor starts a draft and can submit it", () => {
    expect(labels({ isEdit: false, publisher: false, singular: "story" })).toEqual(["Save as draft", "Submit for approval:submit"]);
  });
  it("a publisher can publish a draft or a waiting item directly", () => {
    expect(labels({ isEdit: true, publisher: true, state: "draft", singular: "story" })).toEqual(["Publish now:publish", "Save draft"]);
    expect(labels({ isEdit: true, publisher: true, state: "waiting", singular: "story" })).toEqual(["Publish now:publish", "Save draft"]);
  });
  it("a publisher editing a live item saves live, even over a proposal", () => {
    for (const state of ["live", "changes-draft", "changes-waiting"] as WorkflowState[]) {
      expect(labels({ isEdit: true, publisher: true, state, singular: "story" })).toEqual(["Save changes"]);
    }
  });
  it("an editor proposes changes to a live item rather than saving them live", () => {
    expect(labels({ isEdit: true, publisher: false, state: "live", singular: "story" })).toEqual(["Save proposed changes", "Submit for approval:submit"]);
    expect(labels({ isEdit: true, publisher: false, state: "changes-draft", singular: "story" })).toEqual(["Save proposed changes", "Submit for approval:submit"]);
  });
  it("an editor is told that saving a waiting item withdraws it", () => {
    const { buttons, hint } = saveButtons({ isEdit: true, publisher: false, state: "waiting", singular: "story" });
    expect(buttons.map((b) => b.label)).toContain("Save and resubmit for approval");
    expect(hint).toMatch(/out of the approval queue/);
  });
  it("nobody is offered an approve button inside the edit form", () => {
    for (const publisher of [true, false]) for (const state of ["live", "draft", "waiting", "changes-draft", "changes-waiting", "archived"] as WorkflowState[]) {
      expect(saveButtons({ isEdit: true, publisher, state, singular: "story" }).buttons.some((b) => /approve/i.test(b.label))).toBe(false);
    }
  });
});

describe("grants", () => {
  it("publishing a section always includes editing it", () => {
    expect(normaliseGrants("staff", ["news"], ["hero"])).toEqual({ permissions: ["news", "hero"], publishPermissions: ["hero"] });
  });
  it("ignores unknown sections and duplicates", () => {
    const g = normaliseGrants("staff", ["news", "news", "bogus" as never], ["news", "nope" as never]);
    expect(g.permissions).toEqual(["news"]);
    expect(g.publishPermissions).toEqual(["news"]);
  });
  it("a super administrator holds nothing explicitly: they can do everything", () => {
    expect(normaliseGrants("super_admin", ["news"], ["news"])).toEqual({ permissions: [], publishPermissions: [] });
    expect(canPublish({ role: "super_admin", publishPermissions: [] }, "news")).toBe(true);
    expect(canPublishAnywhere({ role: "super_admin", publishPermissions: [] })).toBe(true);
  });
  it("editing alone is not publishing", () => {
    const editor = { role: "staff" as const, publishPermissions: [] as never[] };
    expect(canPublish(editor, "news")).toBe(false);
    expect(canPublishAnywhere(editor)).toBe(false);
  });
  it("the sections that go live on save are real sections", () => {
    for (const s of DIRECT_SECTIONS) expect(SECTIONS).toContain(s);
  });
});
