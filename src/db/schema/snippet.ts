import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { BLANK_SNIPPET_TEMPLATE } from "@/lib/constants/templates";
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
    .default(BLANK_SNIPPET_TEMPLATE.data),
  lastSeenAt: timestamp("last_seen_at", {
    withTimezone: true,
    mode: "date",
  }),
  trashedAt: timestamp("trashed_at", { withTimezone: true, mode: "date" }),
});

export type Snippet = typeof snippetTable.$inferSelect;
