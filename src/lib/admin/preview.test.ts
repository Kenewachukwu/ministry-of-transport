import { describe, expect, it } from "vitest";
import { getEntity } from "./registry";
import { PREVIEWABLE, previewModel } from "./preview";

const news = getEntity("news")!;
const departments = getEntity("departments")!;
const leadership = getEntity("leadership")!;
const hero = getEntity("hero")!;

const newsRow = {
  id: "n1", slug: "a-story", status: "published", kind: "online_news", isPressRelease: false, title: "Live title", excerpt: "Live summary", body: "One.\n\nTwo.", itemDate: "2026-10-18",
  imageUrl: null, imageAlt: null, gallery: [], featured: false, location: null, pendingValues: null,
};

describe("preview", () => {
  it("shows a live story as it is", () => {
    const m = previewModel(news, newsRow);
    expect(m).toMatchObject({ kind: "news", item: { title: "Live title", slug: "a-story", category: "Online News Report" } });
  });

  it("shows proposed changes laid over the live values, not the live ones", () => {
    const m = previewModel(news, { ...newsRow, pendingState: "draft", pendingValues: { title: "Proposed title", isPressRelease: true } });
    expect(m).toMatchObject({ kind: "news", item: { title: "Proposed title", category: "Press Release", excerpt: "Live summary" } });
  });

  it("shows a draft that has never been published", () => {
    const m = previewModel(news, { ...newsRow, status: "draft", title: "Unpublished draft" });
    expect(m).toMatchObject({ kind: "news", item: { title: "Unpublished draft" } });
  });

  it("has no page to preview for an event, which only appears in a list, or for a hero slide", () => {
    expect(previewModel(news, { ...newsRow, kind: "event" })).toBeNull();
    expect(previewModel(hero, { id: "h", status: "draft" })).toBeNull();
  });

  it("maps a department and a leader the way the public site does", () => {
    const dept = previewModel(departments, { slug: "rail", name: "Rail", summary: "S", description: ["d"], sections: [], photoUrl: null, pendingValues: { name: "Rail Services" } });
    expect(dept).toMatchObject({ kind: "department", department: { id: "rail", name: "Rail Services" } });
    const person = previewModel(leadership, { slug: "dir-1", tier: "director", name: null, placeholderLabel: "DLS", title: "Director", photoUrl: null, bio: [], lastVerifiedDate: null, internalNote: null });
    expect(person).toMatchObject({ kind: "leader", person: { id: "dir-1", isPlaceholder: true, placeholderLabel: "DLS" } });
  });

  it("is offered for exactly the content that has a page of its own", () => {
    expect([...PREVIEWABLE].sort()).toEqual(["departments", "leadership", "news"]);
  });
});
