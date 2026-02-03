ALTER TABLE "chapter_completions" DROP CONSTRAINT "chapter_completions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chapter_completions" DROP CONSTRAINT "chapter_completions_chapter_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_tutor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_chapter_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "user_quiz_attempts" DROP CONSTRAINT "user_quiz_attempts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_quiz_attempts" DROP CONSTRAINT "user_quiz_attempts_chapter_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "chapter_completions" ADD CONSTRAINT "chapter_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_completions" ADD CONSTRAINT "chapter_completions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_attempts" ADD CONSTRAINT "user_quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_attempts" ADD CONSTRAINT "user_quiz_attempts_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;