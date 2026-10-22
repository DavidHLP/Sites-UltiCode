CREATE TABLE `contact_rate` (
	`user_id` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`count` integer NOT NULL,
	CONSTRAINT "contact_rate_count_check" CHECK("contact_rate"."count" BETWEEN 1 AND 3)
);
--> statement-breakpoint
CREATE TABLE `cta_daily` (
	`day` text NOT NULL,
	`event` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`day`, `event`),
	CONSTRAINT "cta_daily_event_check" CHECK("cta_daily"."event" IN ('hero_get_started', 'hero_showcase', 'pilot_open', 'review_download', 'github', 'contact_saved')),
	CONSTRAINT "cta_daily_count_check" CHECK("cta_daily"."count" > 0)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`topic` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`consent_at` text NOT NULL,
	CONSTRAINT "enquiries_topic_check" CHECK("enquiries"."topic" IN ('pilot', 'deployment', 'support', 'contribution')),
	CONSTRAINT "enquiries_name_length" CHECK(length("enquiries"."name") BETWEEN 1 AND 100),
	CONSTRAINT "enquiries_email_length" CHECK(length("enquiries"."email") BETWEEN 3 AND 254),
	CONSTRAINT "enquiries_organization_length" CHECK(length("enquiries"."organization") <= 160),
	CONSTRAINT "enquiries_message_length" CHECK(length("enquiries"."message") BETWEEN 20 AND 4000)
);
--> statement-breakpoint
CREATE INDEX `enquiries_user_created_idx` ON `enquiries` (`user_id`,`created_at`);