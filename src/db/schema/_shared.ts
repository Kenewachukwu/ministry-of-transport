import { integer, pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const contentStatus = pgEnum("content_status", ["published", "archived"]);

/**
 * Columns shared by every piece of editable content.
 *
 * - `status` + `archived_*`: content is ARCHIVED, never deleted (a Ministry
 *   requirement); the public site only ever reads `published` rows.
 * - `version`: optimistic concurrency. Updates run `WHERE version = $expected`
 *   and bump it, so two editors can't silently overwrite each other.
 */
export const contentColumns = () => ({
  id: uuid("id").primaryKey().defaultRandom(),
  status: contentStatus("status").notNull().default("published"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  archivedBy: uuid("archived_by").references(() => users.id, { onDelete: "set null" }),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});

/** Manual display order (lower first) for content the Ministry can re-arrange. */
export const orderColumn = () => ({
  sortOrder: integer("sort_order").notNull().default(0),
});
