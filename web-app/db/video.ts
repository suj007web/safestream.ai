
import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    title : text("title").notNull(),
    url : text("url").notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }),
    timestamps : jsonb("timestamps").notNull(),
    visits : integer("visits").notNull().default(0),
    lastVisited : timestamp("lastVisited", {mode : 'date'}),
    firstVisited : timestamp("firstVisited", {mode : 'date'}).notNull()

})