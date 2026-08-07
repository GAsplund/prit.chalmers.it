CREATE TABLE "pub_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enforce_start_before_end" CHECK ("start_time" < "end_time")
);
--> statement-breakpoint
CREATE TABLE "staff_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"section_id" uuid NOT NULL,
	"role_label" text,
	"order" integer NOT NULL,
	CONSTRAINT "uniq_section_row_order" UNIQUE("section_id","order")
);
--> statement-breakpoint
CREATE TABLE "staff_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "uniq_event_section_order" UNIQUE("event_id","order")
);
--> statement-breakpoint
CREATE TABLE "staff_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"row_id" uuid NOT NULL,
	"slot_time" timestamp with time zone NOT NULL,
	"gamma_user_id" uuid,
	"name" text,
	CONSTRAINT "uniq_row_time_slot" UNIQUE("row_id","slot_time"),
	CONSTRAINT "enforce_top_of_hour" CHECK (date_trunc('hour', "slot_time") = "slot_time"),
	CONSTRAINT "mutually_exclusive_gamma_or_anonymous" CHECK ("gamma_user_id" IS NULL OR "name" IS NULL)
);
--> statement-breakpoint
CREATE TABLE "timeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL,
	"label" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_slots_gamma_user" ON "staff_slots" ("gamma_user_id") WHERE "gamma_user_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_timeline_stages_event" ON "timeline_stages" ("event_id");--> statement-breakpoint
ALTER TABLE "staff_rows" ADD CONSTRAINT "staff_rows_section_id_staff_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "staff_sections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "staff_sections" ADD CONSTRAINT "staff_sections_event_id_pub_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "pub_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "staff_slots" ADD CONSTRAINT "staff_slots_row_id_staff_rows_id_fkey" FOREIGN KEY ("row_id") REFERENCES "staff_rows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "timeline_stages" ADD CONSTRAINT "timeline_stages_event_id_pub_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "pub_events"("id") ON DELETE CASCADE;