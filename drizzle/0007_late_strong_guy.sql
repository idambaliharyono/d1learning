ALTER TABLE `customer` RENAME TO `client`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_client` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`photo_key` text,
	`photo_dtype` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_client`("id", "name", "user_id", "photo_key", "photo_dtype", "created_at", "updated_at", "deleted") SELECT "id", "name", "user_id", "photo_key", "photo_dtype", "created_at", "updated_at", "deleted" FROM `client`;--> statement-breakpoint
DROP TABLE `client`;--> statement-breakpoint
ALTER TABLE `__new_client` RENAME TO `client`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_client_note` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_client_note`("id", "client_id", "content", "created_at", "updated_at", "deleted") SELECT "id", "client_id", "content", "created_at", "updated_at", "deleted" FROM `client_note`;--> statement-breakpoint
DROP TABLE `client_note`;--> statement-breakpoint
ALTER TABLE `__new_client_note` RENAME TO `client_note`;--> statement-breakpoint
CREATE TABLE `__new_routine` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine`("id", "client_id", "name", "created_at", "updated_at", "deleted") SELECT "id", "client_id", "name", "created_at", "updated_at", "deleted" FROM `routine`;--> statement-breakpoint
DROP TABLE `routine`;--> statement-breakpoint
ALTER TABLE `__new_routine` RENAME TO `routine`;--> statement-breakpoint
CREATE TABLE `__new_workout_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`routine_id` text,
	`name` text,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`finished_at` integer,
	`status` text DEFAULT 'ongoing' NOT NULL,
	`note` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`routine_id`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_session`("id", "user_id", "client_id", "routine_id", "name", "started_at", "finished_at", "status", "note") SELECT "id", "user_id", "client_id", "routine_id", "name", "started_at", "finished_at", "status", "note" FROM `workout_session`;--> statement-breakpoint
DROP TABLE `workout_session`;--> statement-breakpoint
ALTER TABLE `__new_workout_session` RENAME TO `workout_session`;