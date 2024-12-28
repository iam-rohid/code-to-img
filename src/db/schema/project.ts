import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createdAt, id } from "./shared";
import { workspaceTable } from "./workspace";

export const projectTable = pgTable("project", {
  id,
  createdAt,
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  trashedAt: timestamp("trashed_at", { withTimezone: true, mode: "date" }),
  starredAt: timestamp("starred_at", { withTimezone: true, mode: "date" }),
});

export type Project = typeof projectTable.$inferSelect;
