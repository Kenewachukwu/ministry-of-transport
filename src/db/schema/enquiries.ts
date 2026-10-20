import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";

/** new = nobody has dealt with it; handled = answered or otherwise closed; spam = not a real enquiry. Nothing is ever deleted. */
export const enquiryStatus = pgEnum("enquiry_status", ["new", "handled", "spam"]);

/** What email delivery did with it: it is always stored first, so a failed or unconfigured email never loses a message. */
export const enquiryEmailStatus = pgEnum("enquiry_email_status", ["sent", "failed", "not_configured"]);

/** Messages sent through the contact form on the public site. */
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    topic: text("topic").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    status: enquiryStatus("status").notNull().default("new"),
    /** Who dealt with it, when, and what they noted (for example "Replied on 21 Oct"). */
    handledBy: uuid("handled_by").references(() => users.id, { onDelete: "set null" }),
    handledAt: timestamp("handled_at", { withTimezone: true }),
    handlerNote: text("handler_note"),
    /** The desk address the notification email was sent to, and how that went. */
    routedTo: text("routed_to"),
    emailStatus: enquiryEmailStatus("email_status").notNull().default("not_configured"),
    /** A salted hash of the sender's network address, only to limit floods. The address itself is never stored. */
    ipHash: text("ip_hash"),
  },
  (t) => [index("enquiries_status_created_idx").on(t.status, t.createdAt), index("enquiries_ip_created_idx").on(t.ipHash, t.createdAt), index("enquiries_email_created_idx").on(t.email, t.createdAt)]
);
