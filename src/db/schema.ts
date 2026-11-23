import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const gifts = pgTable("gifts", {
  id: serial("id").primaryKey(),
  list: text("list").notNull(),
  title: text("title").notNull(),
  url: text("url"),
  imageUrl: text("image_url"),
  price: text("price"),
  note: text("note"),
  claimed: boolean("claimed").notNull().default(false),
  claimedBy: text("claimed_by"),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Gift = typeof gifts.$inferSelect;
