CREATE TYPE "public"."note_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"status" "note_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "notes_status_published_at_idx" ON "notes" USING btree ("status","published_at");