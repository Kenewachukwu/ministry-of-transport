ALTER TYPE "public"."content_status" ADD VALUE 'draft';--> statement-breakpoint
ALTER TYPE "public"."content_status" ADD VALUE 'pending';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "publish_permissions" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "e_services" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "leadership" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "news_items" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "pillars" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "pending_values" jsonb;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "pending_state" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "pending_by" uuid;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "pending_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "e_services" ADD CONSTRAINT "e_services_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "e_services" ADD CONSTRAINT "e_services_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadership" ADD CONSTRAINT "leadership_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadership" ADD CONSTRAINT "leadership_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_items" ADD CONSTRAINT "news_items_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_items" ADD CONSTRAINT "news_items_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pillars" ADD CONSTRAINT "pillars_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pillars" ADD CONSTRAINT "pillars_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_pending_by_users_id_fk" FOREIGN KEY ("pending_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
-- Until now every edit went live, so each editor could effectively publish in their sections. Keep that: a super administrator can tighten it later.
UPDATE "users" SET "publish_permissions" = "permissions" WHERE "role" = 'staff';
