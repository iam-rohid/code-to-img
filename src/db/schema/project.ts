import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, id } from "./shared";
import { workspaceTable } from "./workspace";

export const projectTable = pgTable("project", {
  id,
  createdAt,
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export type Project = typeof projectTable.$inferSelect;
