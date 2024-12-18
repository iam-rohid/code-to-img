import { AnyPgColumn, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, id } from "./shared";
import { workspaceTable } from "./workspace";

export const folderTable = pgTable("folder", {
  id,
  createdAt,
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  parentId: uuid("parent_id").references((): AnyPgColumn => folderTable.id, {
    onDelete: "cascade",
  }),
});

export type Folder = typeof folderTable.$inferSelect;
