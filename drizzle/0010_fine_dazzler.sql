ALTER TABLE "project" DROP CONSTRAINT "project_parent_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "parent_id";