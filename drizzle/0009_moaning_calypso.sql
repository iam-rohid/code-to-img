ALTER TABLE "folder" RENAME TO "project";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "folder_workspace_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "folder_parent_id_folder_id_fk";
--> statement-breakpoint
ALTER TABLE "snippet" DROP CONSTRAINT "snippet_parent_id_folder_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_parent_id_project_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "snippet" ADD CONSTRAINT "snippet_parent_id_project_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
