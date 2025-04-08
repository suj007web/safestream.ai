import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
        id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
        url : text("url").notNull().unique(),
        isBlocked : boolean("isBlocked").notNull().default(false),
        safety_rating : text("safety_rating"),
        explanation : text("explanation"),
})