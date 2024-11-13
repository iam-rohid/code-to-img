import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { getDefaultSnippetData } from "@/lib/utils/editor";
import { iSnippetData } from "@/lib/validator/snippet";

import { createdAt, id } from "./shared";
import { workspaceTable } from "./workspace";

export const snippetTable = pgTable("snippet", {
  id,
  createdAt,
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  data: jsonb("data")
    .notNull()
    .$type<iSnippetData>()
    .$defaultFn(() => getDefaultSnippetData()),
});

export type Snippet = typeof snippetTable.$inferSelect;
