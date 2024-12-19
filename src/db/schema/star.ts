import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { projectTable } from "./project";
import { createdAt } from "./shared";
import { snippetTable } from "./snippet";

export const snippetStarTable = pgTable(
  "snippet_star",
  {
    createdAt,
    snippetId: uuid("snippet_id")
      .notNull()
      .references(() => snippetTable.id, { onDelete: "cascade" }),
    workspaceId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.snippetId] })],
);

export const projectStarTable = pgTable(
  "project_star",
  {
    createdAt,
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    workspaceId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.projectId] })],
);
