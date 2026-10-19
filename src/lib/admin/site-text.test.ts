import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/test/db";
import { siteText } from "@/db/schema";
import type { Db } from "@/db/client";
import { changedSince, readSiteTextGroup } from "./site-text";

describe("changedSince (refusing to overwrite someone else's save)", () => {
  const t1 = "2026-10-19T10:00:00.000Z";
  const t2 = "2026-10-19T10:05:00.000Z";

  it("is not a conflict when nothing has been saved or nothing has changed", () => {
    expect(changedSince("", "")).toBe(false); // first save ever
    expect(changedSince(t1, t1)).toBe(false); // untouched since the form loaded
    expect(changedSince(t2, t1)).toBe(false); // form is newer than the data (clock skew): never block
  });

  it("is a conflict when someone saved after the form loaded", () => {
    expect(changedSince(t1, t2)).toBe(true);
    expect(changedSince("", t2)).toBe(true); // the form saw an empty group, but one now exists
  });
});

describe("readSiteTextGroup", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb({ seed: false });
  });

  it("returns only the group's keys, with the time of the newest change", async () => {
    expect(await readSiteTextGroup(["contact.email"])).toEqual({ values: new Map(), loadedAt: "" });
    await db.insert(siteText).values([
      { key: "contact.email", value: "a@b.gov.ng", updatedAt: new Date("2026-10-19T10:00:00Z") },
      { key: "contact.phone", value: "0800", updatedAt: new Date("2026-10-19T10:05:00Z") },
      { key: "mandate", value: "unrelated", updatedAt: new Date("2026-10-19T11:00:00Z") },
    ]);
    const group = await readSiteTextGroup(["contact.email", "contact.phone"]);
    expect([...group.values.keys()].sort()).toEqual(["contact.email", "contact.phone"]);
    expect(group.loadedAt).toBe("2026-10-19T10:05:00.000Z"); // not the later, unrelated mandate edit
  });
});
