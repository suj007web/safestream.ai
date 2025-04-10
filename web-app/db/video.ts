

import { boolean, integer, jsonb, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";

export const videos = pgTable("videos", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    title : text("title").notNull(),
    url : text("url").notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }).unique(),
    timestamps : jsonb("timestamps").notNull(),
    visits : integer("visits").notNull().default(0),
    lastVisited : timestamp("lastVisited", {mode : 'date'}),
    firstVisited : timestamp("firstVisited", {mode : 'date'}).notNull(),
    isBlocked : boolean("isBlocked").notNull().default(false),
    description: text("description").default("No description available."),
    safety_rating : text("safety_rating"),
    explanation : varchar("explanation", { length: 10000 }),
    userEmail: text("userEmail").references(() => users.email, { onDelete: "cascade" }),

},
(t) => [
    unique("user_video_url_unique").on(t.userEmail, t.url),
  ]
)