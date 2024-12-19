CREATE TABLE IF NOT EXISTS "project_star" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "project_star_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "snippet_star" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"snippet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "snippet_star_user_id_snippet_id_pk" PRIMARY KEY("user_id","snippet_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_star" ADD CONSTRAINT "project_star_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_star" ADD CONSTRAINT "project_star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "snippet_star" ADD CONSTRAINT "snippet_star_snippet_id_snippet_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "snippet_star" ADD CONSTRAINT "snippet_star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
