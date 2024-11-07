import { jsonb } from "drizzle-orm/pg-core";
import { primaryKey } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "./shared";

export const userTable = pgTable("user", {
  createdAt,
  id,
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "date",
  }),
  name: text("name"),
  image: text("image"),
  passwordHash: text("password_hash"),
});

export type User = typeof userTable.$inferSelect;

export const accountTable = pgTable(
  "account",
  {
    createdAt,
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    raw: jsonb("raw").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
);

export const sessionTable = pgTable("session", {
  createdAt,
  token: text("token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
