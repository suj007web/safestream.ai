ALTER TABLE "videos" ALTER COLUMN "thumbnail" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "thumbnail" DROP NOT NULL;