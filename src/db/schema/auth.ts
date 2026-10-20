import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["super_admin", "staff"]);
// "archived" = deactivated. Users are archived like everything else, never deleted.
export const userStatus = pgEnum("user_status", ["invited", "active", "archived"]);
export const tokenPurpose = pgEnum("token_purpose", ["invite", "reset"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    /** Null until the invitation is accepted. argon2id PHC string. */
    passwordHash: text("password_hash"),
    role: userRole("role").notNull().default("staff"),
    /** Section keys a `staff` user may manage (see src/lib/auth/permissions.ts). */
    permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
    /** Sections where this person may PUBLISH: approve other people's work, archive and re-order. Always a subset of `permissions`. */
    publishPermissions: text("publish_permissions").array().notNull().default(sql`'{}'::text[]`),
    status: userStatus("status").notNull().default("invited"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_lower_uq").on(sql`lower(${t.email})`)]
);

/** Server-side session rows: the cookie only carries the id, so sessions can be revoked. */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ip: text("ip"),
    userAgent: text("user_agent"),
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
);

/** One-time invite / password-reset tokens. Only the SHA-256 hash is stored. */
export const authTokens = pgTable(
  "auth_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: tokenPurpose("purpose").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  },
  (t) => [index("auth_tokens_user_idx").on(t.userId, t.purpose)]
);

/** Fixed-window counters for brute-force protection (login, reset, uploads). */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

/** Who did what, when. Never stores secrets or full content bodies. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    /** Email snapshot, so the trail survives a user being archived. */
    actorLabel: text("actor_label").notNull(),
    action: text("action").notNull(),
    entity: text("entity"),
    entityId: text("entity_id"),
    summary: text("summary"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
  },
  (t) => [index("audit_log_at_idx").on(t.at)]
);

export const appMeta = pgTable("app_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
