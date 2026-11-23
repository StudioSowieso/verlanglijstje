CREATE TABLE "gifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"list" text NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"image_url" text,
	"price" text,
	"note" text,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by" text,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
