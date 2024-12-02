-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."friend_request_status" AS ENUM('REQ_UID1', 'REQ_UID2', 'friend');--> statement-breakpoint
CREATE TYPE "public"."user_details_relationship_status" AS ENUM('single', 'taken', 'married', 'complicated');--> statement-breakpoint
CREATE TYPE "public"."user_details_sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kysely_migrations" (
	"name" varchar(255) PRIMARY KEY NOT NULL,
	"timestamp" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kysely_migrations_lock" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_locked" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"profile_picture" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT '',
	"date" date,
	"location" varchar(255) DEFAULT '',
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"image_url" varchar(255),
	"organizer_id" integer,
	"description" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_friend" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid1" integer NOT NULL,
	"uid2" integer NOT NULL,
	"status" "friend_request_status" NOT NULL,
	CONSTRAINT "user_friend_uid1_uid2_key" UNIQUE("uid1","uid2"),
	CONSTRAINT "user_friend_uid2_uid1_key" UNIQUE("uid1","uid2")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"sex" "user_details_sex",
	"relationship_status" "user_details_relationship_status",
	"age" integer,
	"birthday" varchar(100) DEFAULT NULL,
	"hometown" varchar(80) DEFAULT NULL,
	"interests" varchar(100) DEFAULT NULL,
	"favorite_music" varchar(100) DEFAULT NULL,
	"favorite_movies" varchar(100) DEFAULT NULL,
	"favorite_books" varchar(100) DEFAULT NULL,
	"about_me" varchar(50) DEFAULT NULL,
	"school" varchar(50) DEFAULT NULL,
	"work" varchar(50) DEFAULT NULL,
	CONSTRAINT "user_details_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"content" text NOT NULL,
	CONSTRAINT "posts_id_user_id_key" UNIQUE("id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "post_likes_post_id_user_id_key" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"content" text NOT NULL,
	CONSTRAINT "post_comments_post_id_user_id_key" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "new_events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_uid1_fkey" FOREIGN KEY ("uid1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_uid2_fkey" FOREIGN KEY ("uid2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
