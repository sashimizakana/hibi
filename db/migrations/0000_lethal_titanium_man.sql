CREATE TABLE `diaries` (
	`date` text PRIMARY KEY NOT NULL,
	`text` text,
	`marks` text,
	`tasks` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `diaries_date_idx` ON `diaries` (`date`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`task` text,
	`done` integer,
	`date` text
);
--> statement-breakpoint
CREATE INDEX `todos_date_idx` ON `todos` (`date`);