ALTER TABLE `customer` ADD `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `customer` ADD `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `customer` ADD `deleted` integer;--> statement-breakpoint
ALTER TABLE `customer` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `customer` DROP COLUMN `deletedAt`;--> statement-breakpoint
ALTER TABLE `customer` DROP COLUMN `modifiedAt`;--> statement-breakpoint
ALTER TABLE `gym` ADD `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `gym` ADD `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `gym` ADD `deleted` integer;--> statement-breakpoint
ALTER TABLE `gym` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `gym` DROP COLUMN `deletedAt`;--> statement-breakpoint
ALTER TABLE `gym` DROP COLUMN `modifiedAt`;