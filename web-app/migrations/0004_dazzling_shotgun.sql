CREATE TABLE "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	"safety_rating" text,
	"explanation" text,
	CONSTRAINT "urls_id_unique" UNIQUE("id"),
	CONSTRAINT "urls_url_unique" UNIQUE("url")
);
