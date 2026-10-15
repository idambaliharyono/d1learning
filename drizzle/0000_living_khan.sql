CREATE TABLE `gym` (
	`id` text PRIMARY KEY NOT NULL,
	`location` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	`modifiedAt` text
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`priority` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`gymId` text,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	`modifiedAt` text,
	FOREIGN KEY (`gymId`) REFERENCES `gym`(`id`) ON UPDATE no action ON DELETE no action
);
