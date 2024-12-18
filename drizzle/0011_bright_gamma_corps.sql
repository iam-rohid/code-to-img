ALTER TABLE "snippet" RENAME COLUMN "parent_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "snippet" DROP CONSTRAINT "snippet_parent_id_project_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "snippet" ADD CONSTRAINT "snippet_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
