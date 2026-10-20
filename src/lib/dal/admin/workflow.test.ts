import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "@/test/db";
import type { Db } from "@/db/client";
import { auditLog, newsItems, users } from "@/db/schema";
import { ENTITIES, getEntity } from "@/lib/admin/registry";
import { ForbiddenError, type SessionUser } from "@/lib/auth/permissions";
import {
  approveRow,
  archiveRow,
  countByStatus,
  countWaiting,
  createRow,
  discardChanges,
  effectiveRow,
  getRow,
  listRows,
  listWaiting,
  reorderRows,
  restoreRow,
  returnRow,
  submitForApproval,
  updateRow,
  workflowState,
} from "./crud";
import { ConflictError, ContentError } from "./errors";

const base = { email: "x@example.gov.ng", name: "X" };
const boss: SessionUser = { ...base, id: "00000000-0000-4000-8000-000000000001", role: "super_admin", permissions: [], publishPermissions: [] };
const publisher: SessionUser = { ...base, id: "00000000-0000-4000-8000-000000000002", role: "staff", permissions: ["news"], publishPermissions: ["news"] };
const editor: SessionUser = { ...base, id: "00000000-0000-4000-8000-000000000003", role: "staff", permissions: ["news", "hero"], publishPermissions: [] };
const heroPublisher: SessionUser = { ...base, id: "00000000-0000-4000-8000-000000000004", role: "staff", permissions: ["hero"], publishPermissions: ["hero"] };

const news = getEntity("news")!;
const hero = getEntity("hero")!;

const story = (title: string, extra: Record<string, unknown> = {}) => ({
  kind: "online_news",
  title,
  itemDate: "2026-10-18",
  isPressRelease: false,
  location: null,
  excerpt: `${title} summary`,
  body: "",
  imageUrl: null,
  imageAlt: null,
  gallery: [],
  featured: false,
  ...extra,
});

describe("approval workflow", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb({ seed: true });
    await db.insert(users).values(
      [boss, publisher, editor, heroPublisher].map((u) => ({ id: u.id, email: `${u.id.slice(-1)}@example.gov.ng`, name: u.name, role: u.role, permissions: u.permissions, publishPermissions: u.publishPermissions, status: "active" as const }))
    );
  });

  const publicTitles = async () => (await db.select().from(newsItems).where(eq(newsItems.status, "published"))).map((r) => r.title);
  const stateOf = async (id: string) => workflowState((await getRow(news, boss, id))!);

  describe("who can publish", () => {
    it("a publisher's new item goes live at once, an editor's starts as a draft", async () => {
      const live = await createRow(news, publisher, story("Publisher story"));
      const draft = await createRow(news, editor, story("Editor story"));
      expect(await stateOf(live)).toBe("live");
      expect(await stateOf(draft)).toBe("draft");
      expect(await publicTitles()).toContain("Publisher story");
      expect(await publicTitles()).not.toContain("Editor story");
    });

    it("an editor cannot approve, archive, restore or re-order, in any section they only edit", async () => {
      const id = await createRow(news, editor, story("Draft"));
      await expect(approveRow(news, editor, id)).rejects.toThrow(ForbiddenError);
      await expect(returnRow(news, editor, id, "no")).rejects.toThrow(ForbiddenError);
      const [slide] = await listRows(hero, boss);
      await expect(archiveRow(hero, editor, String(slide.id))).rejects.toThrow(ForbiddenError);
      await expect(restoreRow(hero, editor, String(slide.id))).rejects.toThrow(ForbiddenError);
      await expect(reorderRows(hero, editor, [String(slide.id)])).rejects.toThrow(ForbiddenError);
    });

    it("a publisher in one section is only an editor-level colleague in another", async () => {
      const id = await createRow(news, editor, story("Draft"));
      await expect(approveRow(news, heroPublisher, id)).rejects.toThrow(ForbiddenError); // no access to news at all
      const [slide] = await listRows(hero, heroPublisher);
      await expect(archiveRow(hero, heroPublisher, String(slide.id))).resolves.toBeUndefined();
    });
  });

  describe("a new item: draft -> waiting -> published", () => {
    it("is invisible to the public until a publisher approves it", async () => {
      const id = await createRow(news, editor, story("Fresh story"));
      await submitForApproval(news, editor, id);
      expect(await stateOf(id)).toBe("waiting");
      expect(await publicTitles()).not.toContain("Fresh story");

      await approveRow(news, publisher, id);
      expect(await stateOf(id)).toBe("live");
      expect(await publicTitles()).toContain("Fresh story");
    });

    it("can be sent back with a reason, fixed, resubmitted and approved", async () => {
      const id = await createRow(news, editor, story("Needs work"));
      await submitForApproval(news, editor, id);
      await expect(returnRow(news, publisher, id, " ")).rejects.toThrow(ContentError); // a reason is required
      await returnRow(news, publisher, id, "Please add the date of the event.");
      let row = (await getRow(news, boss, id))!;
      expect(workflowState(row)).toBe("draft");
      expect(row.reviewNote).toBe("Please add the date of the event.");

      await updateRow(news, editor, id, Number(row.version), story("Needs work", { excerpt: "Now with the date." }));
      await submitForApproval(news, editor, id);
      row = (await getRow(news, boss, id))!;
      expect(workflowState(row)).toBe("waiting");
      expect(row.reviewNote).toBeNull(); // cleared on resubmission
      await approveRow(news, publisher, id);
      expect(await publicTitles()).toContain("Needs work");
    });

    it("editing a submitted draft takes it back out of the queue", async () => {
      const id = await createRow(news, editor, story("Draft"));
      await submitForApproval(news, editor, id);
      const row = (await getRow(news, boss, id))!;
      await updateRow(news, editor, id, Number(row.version), story("Draft", { excerpt: "changed" }));
      expect(await stateOf(id)).toBe("draft");
    });

    it("a publisher can publish a draft directly, and approve their own work", async () => {
      const id = await createRow(news, editor, story("Quick"));
      await approveRow(news, publisher, id);
      expect(await publicTitles()).toContain("Quick");
    });

    it("discarding a never-published draft archives it: nothing is deleted", async () => {
      const id = await createRow(news, editor, story("Abandoned"));
      await discardChanges(news, editor, id);
      expect(await stateOf(id)).toBe("archived");
      expect(await publicTitles()).not.toContain("Abandoned");
      expect(await db.select().from(newsItems).where(eq(newsItems.id, id))).toHaveLength(1);
    });
  });

  describe("changes to a live item", () => {
    const liveStory = async () => {
      const id = await createRow(news, publisher, story("Live headline"));
      return { id, row: (await getRow(news, boss, id))! };
    };

    it("an editor's edit is a proposal: the website keeps the published words", async () => {
      const { id, row } = await liveStory();
      const outcome = await updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "A better summary." }));
      expect(outcome).toBe("proposed");

      const after = (await getRow(news, boss, id))!;
      expect(after.excerpt).toBe("Live headline summary"); // live columns untouched
      expect(after.version).toBe(row.version); // and not bumped
      expect(workflowState(after)).toBe("changes-draft");
      expect(effectiveRow(after).excerpt).toBe("A better summary."); // what the editor sees when they come back
      expect((await db.select().from(newsItems).where(eq(newsItems.id, id)))[0].excerpt).toBe("Live headline summary");
    });

    it("approving applies the proposal, bumps the version and clears it", async () => {
      const { id, row } = await liveStory();
      await updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "A better summary." }));
      await submitForApproval(news, editor, id);
      expect(await stateOf(id)).toBe("changes-waiting");

      await approveRow(news, publisher, id);
      const after = (await getRow(news, boss, id))!;
      expect(after.excerpt).toBe("A better summary.");
      expect(Number(after.version)).toBe(Number(row.version) + 1);
      expect(workflowState(after)).toBe("live");
      expect(after.pendingValues).toBeNull();
      expect(after.reviewedBy).toBe(publisher.id);
    });

    it("returning proposed changes keeps the website as it was and carries the note", async () => {
      const { id, row } = await liveStory();
      await updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "Risky claim." }));
      await submitForApproval(news, editor, id);
      await returnRow(news, publisher, id, "Please check this claim.");
      const after = (await getRow(news, boss, id))!;
      expect(workflowState(after)).toBe("changes-draft");
      expect(after.reviewNote).toBe("Please check this claim.");
      expect(after.excerpt).toBe("Live headline summary");
    });

    it("discarding proposed changes leaves the live item exactly as it was", async () => {
      const { id, row } = await liveStory();
      await updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "Never mind." }));
      await discardChanges(news, editor, id);
      const after = (await getRow(news, boss, id))!;
      expect(workflowState(after)).toBe("live");
      expect(after.excerpt).toBe("Live headline summary");
    });

    it("a publisher's own edit goes live at once and supersedes a proposal", async () => {
      const { id, row } = await liveStory();
      await updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "Editor's idea." }));
      const outcome = await updateRow(news, publisher, id, Number(row.version), story("Live headline", { excerpt: "Publisher's final." }));
      expect(outcome).toBe("live");
      const after = (await getRow(news, boss, id))!;
      expect(after.excerpt).toBe("Publisher's final.");
      expect(workflowState(after)).toBe("live");
    });

    it("refuses a stale save, for proposals as for live edits", async () => {
      const { id, row } = await liveStory();
      await updateRow(news, publisher, id, Number(row.version), story("Live headline", { excerpt: "First." }));
      await expect(updateRow(news, editor, id, Number(row.version), story("Live headline", { excerpt: "Second." }))).rejects.toThrow(ConflictError);
    });

    it("there is nothing to submit when nothing has been proposed", async () => {
      const { id } = await liveStory();
      await expect(submitForApproval(news, editor, id)).rejects.toThrow(/nothing to submit/i);
      await expect(approveRow(news, publisher, id)).rejects.toThrow(/nothing waiting/i);
      await expect(discardChanges(news, editor, id)).rejects.toThrow(/nothing to discard/i);
    });
  });

  describe("lists and counts", () => {
    it("separate published, drafts, waiting and archived, and a live item with proposals stays published", async () => {
      const live = await createRow(news, publisher, story("Live one"));
      const proposed = await createRow(news, publisher, story("Live two"));
      const draft = await createRow(news, editor, story("Draft one"));
      const waiting = await createRow(news, editor, story("Waiting one"));
      await submitForApproval(news, editor, waiting);
      const row = (await getRow(news, boss, proposed))!;
      await updateRow(news, editor, proposed, Number(row.version), story("Live two", { excerpt: "new" }));
      const gone = await createRow(news, publisher, story("Gone one"));
      await archiveRow(news, publisher, gone);

      const titles = async (status: "published" | "drafts" | "waiting" | "archived") => (await listRows(news, boss, { status })).map((r) => String(r.title));
      expect(await titles("published")).toEqual(expect.arrayContaining(["Live one", "Live two"]));
      expect(await titles("published")).not.toContain("Draft one");
      expect(await titles("drafts")).toEqual(expect.arrayContaining(["Draft one", "Live two"])); // proposals still being written
      expect(await titles("waiting")).toEqual(["Waiting one"]);
      expect(await titles("archived")).toContain("Gone one");

      const counts = await countByStatus(news, boss);
      expect(counts.waiting).toBe(1);
      expect(counts.drafts).toBe(2);
      void live;
      void draft;
    });

    it("the review queue holds only what the person can decide, oldest first", async () => {
      const a = await createRow(news, editor, story("First waiting"));
      await submitForApproval(news, editor, a);
      const [slide] = await listRows(hero, boss);
      const heroRow = (await getRow(hero, boss, String(slide.id)))!;
      await updateRow(hero, editor, String(slide.id), Number(heroRow.version), {
        eyebrow: "E", headline: "Changed headline", body: "B", ctaLabel: "Go", ctaHref: "/about", imageUrl: "/images/stock/hero-lagos-highway.jpg", imageAlt: "A road",
      });
      await submitForApproval(hero, editor, String(slide.id));

      const forPublisher = await listWaiting(publisher, ENTITIES);
      expect(forPublisher.map((w) => w.def.key)).toEqual(["news"]); // not hero: they cannot publish there
      expect(await countWaiting(publisher, ENTITIES)).toBe(1);
      expect(await countWaiting(heroPublisher, ENTITIES)).toBe(1);
      expect(await countWaiting(boss, ENTITIES)).toBe(2);
      expect(await countWaiting(editor, ENTITIES)).toBe(0); // editors decide nothing
    });
  });

  describe("the audit trail", () => {
    it("records who proposed, submitted, approved and sent back", async () => {
      const id = await createRow(news, editor, story("Audited"));
      await submitForApproval(news, editor, id);
      await returnRow(news, publisher, id, "Fix the title.");
      await submitForApproval(news, editor, id);
      await approveRow(news, publisher, id);
      const actions = (await db.select().from(auditLog)).map((r) => r.action).filter((a) => a.startsWith("news."));
      expect(actions).toEqual(expect.arrayContaining(["news.draft", "news.submit", "news.return", "news.approve"]));
      const approval = (await db.select().from(auditLog)).find((r) => r.action === "news.approve");
      expect(approval?.actorId).toBe(publisher.id);
    });
  });

  describe("guards that already existed still hold", () => {
    it("the last published hero slide cannot be archived, even by a publisher", async () => {
      const slides = await listRows(hero, boss);
      for (const s of slides.slice(1)) await archiveRow(hero, heroPublisher, String(s.id));
      await expect(archiveRow(hero, heroPublisher, String(slides[0].id))).rejects.toThrow(/last published/);
    });

    it("an unsubmitted draft hero slide does not count as the last published one", async () => {
      const slides = await listRows(hero, boss);
      const draft = await createRow(hero, editor, {
        eyebrow: "E", headline: "Draft slide", body: "B", ctaLabel: "Go", ctaHref: "/about", imageUrl: "/images/stock/hero-lagos-highway.jpg", imageAlt: "A road",
      });
      for (const s of slides.slice(1)) await archiveRow(hero, heroPublisher, String(s.id));
      await expect(archiveRow(hero, heroPublisher, String(slides[0].id))).rejects.toThrow(/last published/); // the draft is not live
      void draft;
    });
  });
});
