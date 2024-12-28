DROP TABLE "project_star" CASCADE;--> statement-breakpoint
DROP TABLE "snippet_star" CASCADE;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "starred_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "snippet" ADD COLUMN "starred_at" timestamp with time zone;