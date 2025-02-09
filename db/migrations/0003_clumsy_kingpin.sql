CREATE TABLE `holidays` (
	`date` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `holidays_date_idx` ON `holidays` (`date`);