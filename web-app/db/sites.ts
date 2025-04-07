import { pgTable, text, boolean,uuid } from "drizzle-orm/pg-core";

export const sites = pgTable("sites", {
  url: text("url").unique(),
  isBlocked: boolean("is_blocked").default(false),
  id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
  
});
