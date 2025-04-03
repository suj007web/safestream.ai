ALTER TABLE "videos" ADD COLUMN "description" text DEFAULT 'No description available.';--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "safety_rating" text;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "explanation" varchar(1000);