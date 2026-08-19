CREATE TABLE "important_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	CONSTRAINT "uniq_event_contact_order" UNIQUE("event_id","order")
);
--> statement-breakpoint
ALTER TABLE "pub_events" ADD COLUMN "revenue_goal" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "pub_events" ADD COLUMN "last_known_revenue" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "pub_events" ADD COLUMN "last_known_costs" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "timeline_stages" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "important_contacts" ADD CONSTRAINT "important_contacts_event_id_pub_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "pub_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "timeline_stages" ADD CONSTRAINT "enforce_start_within_event" CHECK ("start_time" >= (SELECT "start_time" FROM "pub_events" WHERE "id" = "event_id") AND "start_time" <= (SELECT "end_time" FROM "pub_events" WHERE "id" = "event_id"));