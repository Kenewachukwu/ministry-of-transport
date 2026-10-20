CREATE TYPE "public"."enquiry_email_status" AS ENUM('sent', 'failed', 'not_configured');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'handled', 'spam');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"topic" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"handled_by" uuid,
	"handled_at" timestamp with time zone,
	"handler_note" text,
	"routed_to" text,
	"email_status" "enquiry_email_status" DEFAULT 'not_configured' NOT NULL,
	"ip_hash" text
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_handled_by_users_id_fk" FOREIGN KEY ("handled_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_status_created_idx" ON "enquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_ip_created_idx" ON "enquiries" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_email_created_idx" ON "enquiries" USING btree ("email","created_at");