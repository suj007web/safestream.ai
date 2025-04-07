CREATE TABLE "sites" (
	"url" text,
	"is_blocked" boolean DEFAULT false,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "sites_url_unique" UNIQUE("url"),
	CONSTRAINT "sites_id_unique" UNIQUE("id")
);
