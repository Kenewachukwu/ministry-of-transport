import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "@/test/db";
import type { Db } from "@/db/client";
import { auditLog, enquiries, siteText, users } from "@/db/schema";
import { ForbiddenError, type SessionUser } from "@/lib/auth/permissions";

const send = vi.fn(async () => {});
let providerAvailable = true;
vi.mock("@/lib/email/provider", () => ({ getEmailProvider: () => (providerAvailable ? { name: "test", send } : null) }));

import { EnquiryLimitError, LIMITS, enquiryCounts, enquirySchema, getEnquiry, listEnquiries, newEnquiryCount, recipientFor, setEnquiryStatus, submitEnquiry } from "./enquiries";
import { hashSender, senderIp } from "@/lib/enquiries-public";

const base = { email: "x@example.gov.ng", name: "X", publishPermissions: [] as never[] };
const handler: SessionUser = { ...base, id: "00000000-0000-4000-8000-0000000000a1", role: "staff", permissions: ["enquiries"] };
const outsider: SessionUser = { ...base, id: "00000000-0000-4000-8000-0000000000a2", role: "staff", permissions: ["news"] };
const boss: SessionUser = { ...base, id: "00000000-0000-4000-8000-0000000000a3", role: "super_admin", permissions: [] };

const valid = (over: Record<string, unknown> = {}) =>
  enquirySchema.parse({ topic: "general", name: "Ada Okafor", email: "ada@example.com", phone: "", message: "Please tell me how to renew a licence.", ...over });

describe("enquiries", () => {
  let db: Db;
  beforeEach(async () => {
    send.mockClear();
    providerAvailable = true;
    db = await createTestDb();
    await db.insert(users).values([handler, outsider, boss].map((u) => ({ id: u.id, email: `${u.id.slice(-2)}@example.gov.ng`, name: u.name, role: u.role, permissions: u.permissions, status: "active" as const })));
  });

  describe("what a visitor may send", () => {
    it("accepts a normal message and tidies it", () => {
      const e = valid({ name: "  Ada Okafor ", email: " ADA@Example.com ", phone: " +234 803 000 0000 " });
      expect(e).toMatchObject({ name: "Ada Okafor", email: "ada@example.com", phone: "+234 803 000 0000" });
      expect(valid({ phone: "" }).phone).toBeNull();
    });
    it("refuses what cannot be answered or abused", () => {
      expect(() => valid({ name: "A" })).toThrow();
      expect(() => valid({ email: "not-an-email" })).toThrow();
      expect(() => valid({ topic: "sell-me-things" })).toThrow();
      expect(() => valid({ message: "hi" })).toThrow();
      expect(() => valid({ message: "x".repeat(4001) })).toThrow();
      expect(() => valid({ phone: "call me maybe" })).toThrow();
    });
  });

  describe("storing and routing", () => {
    it("stores the message first, then emails the desk, with replies going to the sender", async () => {
      const { id, emailStatus } = await submitEnquiry(valid(), { ipHash: "ip-1" });
      expect(emailStatus).toBe("sent");
      const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id));
      expect(row).toMatchObject({ status: "new", topic: "general", name: "Ada Okafor", emailStatus: "sent" });
      expect(send).toHaveBeenCalledTimes(1);
      const mail = (send.mock.calls[0] as unknown as [{ to: string; replyTo: string; text: string }])[0];
      expect(mail.replyTo).toBe("ada@example.com");
      expect(mail.text).toContain("Please tell me how to renew a licence.");
      expect(mail.to).toBe(row.routedTo);
    });

    it("never emails the sender: only the Ministry's desk", async () => {
      await submitEnquiry(valid({ email: "stranger@example.com" }), { ipHash: null });
      const recipients = send.mock.calls.map((c) => (c as unknown as [{ to: string }])[0].to);
      expect(recipients).not.toContain("stranger@example.com");
    });

    it("keeps the message even when email is not configured or fails", async () => {
      providerAvailable = false;
      const a = await submitEnquiry(valid(), { ipHash: null });
      expect(a.emailStatus).toBe("not_configured");
      providerAvailable = true;
      send.mockRejectedValueOnce(new Error("Resend is down"));
      const b = await submitEnquiry(valid({ email: "bee@example.com" }), { ipHash: null });
      expect(b.emailStatus).toBe("failed");
      const rows = await db.select().from(enquiries);
      expect(rows).toHaveLength(2);
      expect(rows.map((r) => r.emailStatus).sort()).toEqual(["failed", "not_configured"]);
    });

    it("sends each topic to its desk, and falls back to the main address", async () => {
      expect(await recipientFor("general")).toBe("info@transportation.gov.ng");
      await db.insert(siteText).values([
        { key: "contact.email", value: "main@ministry.gov.ng" },
        { key: "enquiries.desk.media", value: "press@ministry.gov.ng" },
        { key: "enquiries.desk.foi", value: "not an address" },
      ]);
      expect(await recipientFor("media")).toBe("press@ministry.gov.ng");
      expect(await recipientFor("foi")).toBe("main@ministry.gov.ng"); // an invalid desk is ignored, never trusted
      expect(await recipientFor("general")).toBe("main@ministry.gov.ng");
    });
  });

  describe("floods", () => {
    it("limits one sender, then one email address, per hour", async () => {
      for (let i = 0; i < LIMITS.perSenderPerHour; i++) await submitEnquiry(valid({ email: `p${i}@example.com` }), { ipHash: "same-sender" });
      await expect(submitEnquiry(valid({ email: "p-new@example.com" }), { ipHash: "same-sender" })).rejects.toThrow(EnquiryLimitError);
      await expect(submitEnquiry(valid({ email: "p-new@example.com" }), { ipHash: "someone-else" })).resolves.toBeDefined(); // a different sender is fine

      for (let i = 0; i < LIMITS.perEmailPerHour - 1; i++) await submitEnquiry(valid({ email: "same@example.com" }), { ipHash: `s${i}` });
      await submitEnquiry(valid({ email: "same@example.com" }), { ipHash: "s-last" });
      await expect(submitEnquiry(valid({ email: "same@example.com" }), { ipHash: "s-more" })).rejects.toThrow(EnquiryLimitError);
    });

    it("does not count messages older than an hour", async () => {
      const old = new Date(Date.now() - 2 * 60 * 60 * 1000);
      for (let i = 0; i < LIMITS.perSenderPerHour; i++) {
        await db.insert(enquiries).values({ topic: "general", name: "Old", email: `old${i}@example.com`, message: "An old message here.", ipHash: "old-sender", createdAt: old });
      }
      await expect(submitEnquiry(valid(), { ipHash: "old-sender" })).resolves.toBeDefined();
    });

    it("stores only a one-way hash of the network address", () => {
      const a = hashSender("203.0.113.9");
      expect(a).toMatch(/^[0-9a-f]{64}$/);
      expect(a).not.toContain("203");
      expect(hashSender("203.0.113.9")).toBe(a);
      expect(hashSender("203.0.113.10")).not.toBe(a);
      expect(hashSender(null)).toBeNull();
      expect(senderIp(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    });
  });

  describe("the admin inbox", () => {
    it("is for people with the Enquiries permission only", async () => {
      await expect(listEnquiries(outsider)).rejects.toThrow(ForbiddenError);
      await expect(getEnquiry(outsider, "00000000-0000-4000-8000-000000000001")).rejects.toThrow(ForbiddenError);
      await expect(setEnquiryStatus(outsider, "00000000-0000-4000-8000-000000000001", "handled")).rejects.toThrow(ForbiddenError);
      await expect(listEnquiries(handler)).resolves.toEqual([]);
      await expect(listEnquiries(boss)).resolves.toEqual([]);
    });

    it("only offers the menu badge to people who have access", async () => {
      await submitEnquiry(valid(), { ipHash: null });
      expect(await newEnquiryCount(outsider)).toBeNull();
      expect(await newEnquiryCount(handler)).toBe(1);
      expect(await newEnquiryCount(boss)).toBe(1);
    });

    it("moves a message between new, handled and spam, recording who and why, and never deletes", async () => {
      const { id } = await submitEnquiry(valid(), { ipHash: null });
      await setEnquiryStatus(handler, id, "handled", "Replied by email on 21 October.");
      let row = (await getEnquiry(handler, id))!;
      expect(row).toMatchObject({ status: "handled", handledBy: handler.id, handlerNote: "Replied by email on 21 October." });
      expect(row.handledAt).toBeInstanceOf(Date);
      expect(await enquiryCounts(handler)).toEqual({ new: 0, handled: 1, spam: 0 });
      expect(await listEnquiries(handler, { status: "handled" })).toHaveLength(1);

      await setEnquiryStatus(handler, id, "new");
      row = (await getEnquiry(handler, id))!;
      expect(row).toMatchObject({ status: "new", handledBy: null, handledAt: null, handlerNote: null });

      await setEnquiryStatus(handler, id, "spam");
      expect(await enquiryCounts(handler)).toEqual({ new: 0, handled: 0, spam: 1 });
      expect(await db.select().from(enquiries)).toHaveLength(1);

      const actions = (await db.select().from(auditLog)).map((r) => r.action).filter((a) => a.startsWith("enquiry."));
      expect(actions).toEqual(["enquiry.handle", "enquiry.reopen", "enquiry.spam"]);
    });

    it("keeps the sender's words and address out of the audit log", async () => {
      const { id } = await submitEnquiry(valid({ message: "My private account number is 123456." }), { ipHash: null });
      await setEnquiryStatus(handler, id, "handled");
      const log = JSON.stringify(await db.select().from(auditLog));
      expect(log).not.toContain("123456");
      expect(log).not.toContain("ada@example.com");
    });

    it("searches by name, email and message, and lists new ones oldest first", async () => {
      await submitEnquiry(valid({ name: "Zanele Mwangi", email: "z@example.com", message: "About the zebra crossing consultation." }), { ipHash: null });
      await submitEnquiry(valid({ name: "Bola Ade", email: "b@example.com", message: "Something entirely different here." }), { ipHash: null });
      expect((await listEnquiries(handler, { q: "zebra" })).map((r) => r.name)).toEqual(["Zanele Mwangi"]);
      expect((await listEnquiries(handler, { q: "b@example" })).map((r) => r.name)).toEqual(["Bola Ade"]);
      expect((await listEnquiries(handler, { q: "100%_" })).length).toBe(0); // wildcards are not special
      expect((await listEnquiries(handler)).map((r) => r.name)).toEqual(["Zanele Mwangi", "Bola Ade"]);
    });
  });
});
