import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb } from "@/test/db";
import type { Db } from "@/db/client";
import { users } from "@/db/schema";
import { getEntity } from "@/lib/admin/registry";

const send = vi.fn(async (message: unknown) => void message);
let provider: { name: string; send: typeof send } | null = { name: "test", send };
vi.mock("@/lib/email/provider", () => ({ getEmailProvider: () => provider }));

import { notifyPublishers, publishersOf } from "./notify";

const news = getEntity("news")!;
const id = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;

describe("telling publishers that work is waiting", () => {
  let db: Db;
  beforeEach(async () => {
    send.mockClear();
    send.mockImplementation(async () => {});
    provider = { name: "test", send };
    db = await createTestDb();
    await db.insert(users).values([
      { id: id(1), email: "boss@example.gov.ng", name: "Boss", role: "super_admin", status: "active" },
      { id: id(2), email: "pub@example.gov.ng", name: "News Publisher", role: "staff", permissions: ["news"], publishPermissions: ["news"], status: "active" },
      { id: id(3), email: "author@example.gov.ng", name: "Author", role: "staff", permissions: ["news"], publishPermissions: ["news"], status: "active" },
      { id: id(4), email: "editor@example.gov.ng", name: "Editor", role: "staff", permissions: ["news"], status: "active" },
      { id: id(5), email: "hero@example.gov.ng", name: "Hero Publisher", role: "staff", permissions: ["hero"], publishPermissions: ["hero"], status: "active" },
      { id: id(6), email: "gone@example.gov.ng", name: "Deactivated", role: "staff", permissions: ["news"], publishPermissions: ["news"], status: "archived" },
      { id: id(7), email: "invited@example.gov.ng", name: "Invited", role: "staff", permissions: ["news"], publishPermissions: ["news"], status: "invited" },
    ]);
  });

  it("finds the section's publishers and the super administrators, and nobody else", async () => {
    const found = (await publishersOf("news", id(3))).map((p) => p.email).sort();
    expect(found).toEqual(["boss@example.gov.ng", "pub@example.gov.ng"]); // not the author, an editor, another section, or someone inactive
  });

  it("emails each one a link to Approvals, naming the author and the item", async () => {
    const told = await notifyPublishers(news, { id: id(9), title: "A new story" }, { id: id(3), name: "Author" });
    expect(told).toBe(2);
    const messages = send.mock.calls.map((c) => c[0] as { to: string; subject: string; text: string; link?: string });
    expect(messages.map((m) => m.to).sort()).toEqual(["boss@example.gov.ng", "pub@example.gov.ng"]);
    expect(messages[0].subject).toContain("A new story");
    expect(messages[0].text).toContain("Author");
    expect(messages[0].text).toContain("/admin/review");
    expect(JSON.stringify(messages)).not.toContain("editor@example.gov.ng");
  });

  it("never fails the submission: one failed email does not stop the others, and no provider means no emails", async () => {
    send.mockRejectedValueOnce(new Error("mail down"));
    const told = await notifyPublishers(news, { id: id(9), title: "T" }, { id: id(3), name: "Author" });
    expect(told).toBe(1);
    expect(send).toHaveBeenCalledTimes(2);

    provider = null;
    expect(await notifyPublishers(news, { id: id(9), title: "T" }, { id: id(3), name: "Author" })).toBe(0);
  });
});
