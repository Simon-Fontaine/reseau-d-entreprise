CREATE TYPE "public"."course_publish_status" AS ENUM('draft', 'published', 'unpublished');--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "publish_status" "course_publish_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "published_at" timestamp;