import { boolean, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const urls = pgTable("urls", {
        id : uuid("id").notNull().primaryKey().defaultRandom().unique(),
        url : text("url").notNull(),
        isBlocked : boolean("isBlocked").notNull().default(false),
        safety_rating : text("safety_rating"),
        explanation : text("explanation"),
        userEmail: text("userEmail").references(() => users.email, { onDelete: "cascade" }),
}, 
        (t) => [
                unique("user_url").on(t.userEmail, t.url),
        ]
        
        )