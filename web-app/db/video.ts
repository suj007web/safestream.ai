
import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    title : text("title").notNull(),
    url : text("url").notNull(),
    thumbnail : text("thumbnail").notNull(),
    timestamps : jsonb("timestamps").notNull(),
    visits : integer("visits").notNull().default(0),
    lastVisited : timestamp("lastVisited", {mode : 'date'}),
    firstVisited : timestamp("firstVisited", {mode : 'date'}).notNull()

})