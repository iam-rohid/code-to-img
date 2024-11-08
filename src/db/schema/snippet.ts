import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "./shared";
import { workspaceTable } from "./workspace";

export const snippetTable = pgTable("snippet", {
  id,
  createdAt,
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  data: jsonb("data").notNull().default({}),
});

export type Snippet = typeof snippetTable.$inferSelect;
