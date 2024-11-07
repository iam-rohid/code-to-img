import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "./shared";
import { userTable } from "./auth";

export const workspaceTable = pgTable("workspace", {
  createdAt,
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
});

export type Workspace = typeof workspaceTable.$inferSelect;

export const workspaceMemberRole = pgEnum("workspace_member_role", [
  "owner",
  "editor",
  "viewer",
]);

export type WorkspaceMemberRole =
  (typeof workspaceMemberRole.enumValues)[number];

export const workspaceMemberTable = pgTable("workspace_member", {
  createdAt,
  role: workspaceMemberRole("role").notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export type WorkspaceMember = typeof workspaceMemberTable.$inferSelect;
