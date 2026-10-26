DROP VIEW IF EXISTS `exercise_with_author`;--> statement-breakpoint
CREATE VIEW `exercise_with_author` AS select "exercise"."id", "exercise"."name", "user"."name", "exercise"."youtube_url", "exercise"."instruction", "exercise"."created_at" from "exercise" left join "user" on "user"."id" = "exercise"."user_id";
