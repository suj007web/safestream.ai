CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail" varchar(255),
	"timestamps" jsonb NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	"lastVisited" timestamp,
	"firstVisited" timestamp NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	"description" text DEFAULT 'No description available.',
	"safety_rating" text,
	"explanation" varchar(10000),
	"userEmail" text,
	CONSTRAINT "videos_id_unique" UNIQUE("id"),
	CONSTRAINT "videos_thumbnail_unique" UNIQUE("thumbnail"),
	CONSTRAINT "user_video_url_unique" UNIQUE("userEmail","url")
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	"safety_rating" text,
	"explanation" text,
	"userEmail" text,
	CONSTRAINT "urls_id_unique" UNIQUE("id"),
	CONSTRAINT "user_url" UNIQUE("userEmail","url")
);
--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;