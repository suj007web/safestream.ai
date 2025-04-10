import {pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
    email : text("email").notNull().unique(),
    name : varchar("name", {length : 255}).notNull(),
    image : text("image").notNull()
})