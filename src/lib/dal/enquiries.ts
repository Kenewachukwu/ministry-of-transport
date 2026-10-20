import "server-only";
import { and, count, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { enquiries, siteText } from "@/db/schema";
import { siteMeta as fallbackSiteMeta } from "@/content/siteMeta";
import { ENQUIRY_TOPIC_IDS, ENQUIRY_TOPICS, enquiryTopicLabel } from "@/content/enquiryTopics";
import { emailSchema } from "@/lib/admin/action";
import { audit } from "@/lib/auth/audit";
import { assertCan, type SessionUser } from "@/lib/auth/permissions";
import { getEmailProvider } from "@/lib/email/provider";
import { enquiryEmail } from "@/lib/email/templates";
import { ContentError } from "@/lib/dal/admin/errors";

/**
 * Messages from the public contact form. The rules, in one place:
 *  - a message is stored FIRST; email is a notification on top, so a failed or
 *    unconfigured email never loses anything;
 *  - floods are limited by sender address (salted hash, never stored raw), by email
 *    address and overall, because the form is open to anyone;
 *  - no email goes to the sender (an open form that mails arbitrary addresses is a
 *    spam relay): replies are sent by the Ministry, from its own mailbox;
 *  - nothing is deleted: handled and spam messages stay in the inbox's other tabs.
 */

export const LIMITS = { perSenderPerHour: 5, perEmailPerHour: 3, overallPerHour: 200 } as const;
const HOUR_MS = 60 * 60 * 1000;

export class EnquiryLimitError extends Error {
  constructor() {
    super("Too many messages have been sent from here in the last hour. Please try again later, or email the Ministry directly.");
  }
}

const optionalPhone = z
  .string()
  .trim()
  .max(30, "Keep this under 30 characters.")
  .refine((v) => v === "" || /^\+?[0-9][0-9 ()-]{5,}$/.test(v), "Use digits, spaces, + and - only, or leave it empty.")
  .transform((v) => (v === "" ? null : v));

export const enquirySchema = z.object({
  topic: z.enum(ENQUIRY_TOPIC_IDS, "Choose what your message is about."),
  name: z.string().trim().min(2, "Enter your name.").max(120, "Keep this under 120 characters."),
  email: emailSchema,
  phone: optionalPhone,
  message: z.string().trim().min(10, "Write a few words so we know how to help.").max(4000, "Keep this under 4,000 characters."),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

/** The address a topic's messages go to: the desk set under Enquiries settings, else the Ministry's main email. */
export async function recipientFor(topic: string): Promise<string> {
  const db = await getDb();
  const keys = [`enquiries.desk.${topic}`, "contact.email"];
  const rows = await db.select().from(siteText).where(sql`${siteText.key} in (${sql.join(keys.map((k) => sql`${k}`), sql`, `)})`);
  const map = new Map(rows.map((r) => [r.key, r.value.trim()]));
  const valid = (v: string | undefined) => (v && z.email().safeParse(v).success ? v : null);
  return valid(map.get(`enquiries.desk.${topic}`)) ?? valid(map.get("contact.email")) ?? fallbackSiteMeta.email;
}

/** Stores the message, notifies the right desk, and reports how the email went. */
export async function submitEnquiry(input: EnquiryInput, context: { ipHash: string | null }): Promise<{ id: string; emailStatus: "sent" | "failed" | "not_configured" }> {
  const db = await getDb();
  const since = new Date(Date.now() - HOUR_MS);
  const recent = async (...extra: ReturnType<typeof eq>[]) => {
    const [r] = await db.select({ n: count() }).from(enquiries).where(and(gte(enquiries.createdAt, since), ...extra));
    return r?.n ?? 0;
  };
  if ((await recent()) >= LIMITS.overallPerHour) throw new EnquiryLimitError();
  if (context.ipHash && (await recent(eq(enquiries.ipHash, context.ipHash))) >= LIMITS.perSenderPerHour) throw new EnquiryLimitError();
  if ((await recent(eq(enquiries.email, input.email))) >= LIMITS.perEmailPerHour) throw new EnquiryLimitError();

  const routedTo = await recipientFor(input.topic);
  const [row] = await db
    .insert(enquiries)
    .values({ topic: input.topic, name: input.name, email: input.email, phone: input.phone, message: input.message, routedTo, ipHash: context.ipHash })
    .returning();

  let emailStatus: "sent" | "failed" | "not_configured" = "not_configured";
  const provider = getEmailProvider();
  if (provider) {
    try {
      await provider.send(enquiryEmail(routedTo, row, enquiryTopicLabel(row.topic)));
      emailStatus = "sent";
    } catch (error) {
      emailStatus = "failed";
      console.error("[enquiry] notification email failed:", error instanceof Error ? error.message : error);
    }
  }
  await db.update(enquiries).set({ emailStatus }).where(eq(enquiries.id, row.id));
  return { id: row.id, emailStatus };
}

/* ---------- the admin inbox --------------------------------------------------------------------- */

export type EnquiryRow = typeof enquiries.$inferSelect;
export type EnquiryListStatus = "new" | "handled" | "spam";

export async function listEnquiries(user: SessionUser, options: { status?: EnquiryListStatus; q?: string } = {}): Promise<EnquiryRow[]> {
  assertCan(user, "enquiries");
  const db = await getDb();
  const term = options.q?.trim().replace(/[\\%_]/g, "");
  const search = term ? or(ilike(enquiries.name, `%${term}%`), ilike(enquiries.email, `%${term}%`), ilike(enquiries.message, `%${term}%`)) : undefined;
  return db
    .select()
    .from(enquiries)
    .where(and(eq(enquiries.status, options.status ?? "new"), search))
    .orderBy(options.status === "new" || !options.status ? enquiries.createdAt : desc(enquiries.createdAt))
    .limit(500);
}

export async function getEnquiry(user: SessionUser, id: string): Promise<EnquiryRow | undefined> {
  assertCan(user, "enquiries");
  const db = await getDb();
  const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  return row;
}

export async function enquiryCounts(user: SessionUser): Promise<Record<EnquiryListStatus, number>> {
  assertCan(user, "enquiries");
  const db = await getDb();
  const rows = await db.select({ status: enquiries.status, n: count() }).from(enquiries).groupBy(enquiries.status);
  const out = { new: 0, handled: 0, spam: 0 };
  for (const r of rows) out[r.status] = r.n;
  return out;
}

/** Number of new enquiries for the menu badge; 0 when the person has no access (no query is made). */
export async function newEnquiryCount(user: Pick<SessionUser, "role" | "permissions">): Promise<number | null> {
  if (user.role !== "super_admin" && !user.permissions.includes("enquiries")) return null;
  const db = await getDb();
  const [r] = await db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new"));
  return r?.n ?? 0;
}

const ACTION_BY_STATUS = { handled: "enquiry.handle", new: "enquiry.reopen", spam: "enquiry.spam" } as const;

/** Handled, reopened (back to new) or spam. Nothing is deleted. */
export async function setEnquiryStatus(user: SessionUser, id: string, status: EnquiryListStatus, note?: string): Promise<void> {
  assertCan(user, "enquiries");
  const db = await getDb();
  const [current] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!current) throw new ContentError("That enquiry no longer exists.");
  if (current.status === status && status !== "handled") return;
  const cleaned = note?.trim().slice(0, 1000) || null;
  await db
    .update(enquiries)
    .set(status === "new" ? { status, handledBy: null, handledAt: null, handlerNote: null } : { status, handledBy: user.id, handledAt: new Date(), handlerNote: cleaned })
    .where(eq(enquiries.id, id));
  await audit({ id: user.id, label: user.email }, ACTION_BY_STATUS[status], {
    entity: "enquiry",
    entityId: id,
    summary: `${status === "handled" ? "Marked as handled" : status === "spam" ? "Marked as spam" : "Reopened"}: ${enquiryTopicLabel(current.topic)} enquiry`,
  });
}

export const TOPIC_OPTIONS = ENQUIRY_TOPICS.map((t) => ({ value: t.id as string, label: t.label as string }));
