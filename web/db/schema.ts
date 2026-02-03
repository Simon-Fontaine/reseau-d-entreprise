import "dotenv/config";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["student", "tutor", "admin"]);

export const courseStatusEnum = pgEnum("course_status", [
  "en_cours",
  "termine",
  "abandonne",
]);

export const coursePublishStatusEnum = pgEnum("course_publish_status", [
  "draft",
  "published",
  "unpublished",
]);

export const courseLevelEnum = pgEnum("course_level", [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("student"),
  bio: text("bio"),
});

export const themes = pgTable("themes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  emoji: text("emoji"),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  minLevel: courseLevelEnum("min_level").notNull(),
  maxLevel: courseLevelEnum("max_level").notNull(),
  themeId: uuid("theme_id").references(() => themes.id),
  tutorId: uuid("tutor_id").references(() => users.id),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 255 }),
  estimatedDuration: integer("estimated_duration"),
  emoji: text("emoji"),
  publishStatus: coursePublishStatusEnum("publish_status")
    .default("draft")
    .notNull(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id),
  title: varchar("title", { length: 200 }).notNull(),
  contentMarkdown: text("content_markdown"),
  orderIndex: integer("order_index").default(1),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    courseId: uuid("course_id").references(() => courses.id),
    status: courseStatusEnum("status").default("en_cours"),
    progressPercent: integer("progress_percent").default(0),
  },
  (t) => [unique("enrollments_user_course_uniq").on(t.userId, t.courseId)],
);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id),
  userId: uuid("user_id").references(() => users.id),
  messageContent: text("message_content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  chapterId: uuid("chapter_id").references(() => chapters.id),
  questionText: text("question_text").notNull(),
  points: integer("points").default(1),
});

export const quizOptions = pgTable("quiz_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => quizQuestions.id),
  optionText: varchar("option_text", { length: 255 }).notNull(),
  isCorrect: boolean("is_correct").default(false),
});

export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  chapterId: uuid("chapter_id").references(() => chapters.id),
  scoreObtained: integer("score_obtained"),
  passed: boolean("passed").default(false),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  tutor: one(users, { fields: [courses.tutorId], references: [users.id] }),
  theme: one(themes, { fields: [courses.themeId], references: [themes.id] }),
  chapters: many(chapters),
  enrollments: many(enrollments),
  messages: many(chatMessages),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  questions: many(quizQuestions),
}));

export const quizQuestionsRelations = relations(
  quizQuestions,
  ({ one, many }) => ({
    chapter: one(chapters, {
      fields: [quizQuestions.chapterId],
      references: [chapters.id],
    }),
    options: many(quizOptions),
  }),
);

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  course: one(courses, {
    fields: [chatMessages.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id],
  }),
}));

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: {
    users,
    themes,
    courses,
    chapters,
    enrollments,
    chatMessages,
    quizQuestions,
    quizOptions,
    userQuizAttempts,
    coursesRelations,
    chaptersRelations,
    quizQuestionsRelations,
    enrollmentsRelations,
    chatMessagesRelations,
    quizOptionsRelations,
  },
});
