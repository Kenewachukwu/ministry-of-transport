import { integer, jsonb, pgEnum, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * published: on the website. archived: hidden, never deleted.
 * draft / pending: a NEW item that has never been published (being written / waiting for approval).
 * A published item being changed stays "published" with its proposed changes in `pending_values`.
 */
export const contentStatus = pgEnum("content_status", ["published", "archived", "draft", "pending"]);

/**
 * Columns shared by every piece of editable content.
 *
 * - `status` + `archived_*`: content is ARCHIVED, never deleted (a Ministry
 *   requirement); the public site only ever reads `published` rows.
 * - `pending_values` / `pending_state`: changes proposed to a PUBLISHED item by someone who may
 *   edit but not publish. The live columns are untouched until a publisher approves
 *   ("draft" = still being written, "submitted" = waiting for approval).
 * - `version`: optimistic concurrency. Updates run `WHERE version = $expected`
 *   and bump it, so two editors can't silently overwrite each other.
 */
export const contentColumns = () => ({
  id: uuid("id").primaryKey().defaultRandom(),
  status: contentStatus("status").notNull().default("published"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  archivedBy: uuid("archived_by").references(() => users.id, { onDelete: "set null" }),
  version: integer("version").notNull().default(1),
  pendingValues: jsonb("pending_values").$type<Record<string, unknown>>(),
  pendingState: text("pending_state").$type<"draft" | "submitted">(),
  pendingBy: uuid("pending_by").references(() => users.id, { onDelete: "set null" }),
  pendingAt: timestamp("pending_at", { withTimezone: true }),
  /** Why a publisher sent the work back (cleared on the next submission). */
  reviewNote: text("review_note"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});

/** Manual display order (lower first) for content the Ministry can re-arrange. */
export const orderColumn = () => ({
  sortOrder: integer("sort_order").notNull().default(0),
});
