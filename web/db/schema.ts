import "dotenv/config";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "trainer",
  "admin",
]);
export const courseStatusEnum = pgEnum("course_status", [
  "en_cours",
  "termine",
  "abandonne",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("student"),
});

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  level: varchar("level", { length: 20 }).notNull(),
  themeId: integer("theme_id").references(() => themes.id),
  trainerId: integer("trainer_id").references(() => users.id),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title", { length: 200 }).notNull(),
  contentMarkdown: text("content_markdown"),
  orderIndex: integer("order_index").default(1),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    courseId: integer("course_id").references(() => courses.id),
    status: courseStatusEnum("status").default("en_cours"),
    progressPercent: integer("progress_percent").default(0),
  },
  (t) => ({
    unq: unique().on(t.userId, t.courseId),
  }),
);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  userId: integer("user_id").references(() => users.id),
  messageContent: text("message_content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").references(() => chapters.id),
  questionText: text("question_text").notNull(),
  points: integer("points").default(1),
});

export const quizOptions = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => quizQuestions.id),
  optionText: varchar("option_text", { length: 255 }).notNull(),
  isCorrect: boolean("is_correct").default(false),
});

export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  chapterId: integer("chapter_id").references(() => chapters.id),
  scoreObtained: integer("score_obtained"),
  passed: boolean("passed").default(false),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  trainer: one(users, { fields: [courses.trainerId], references: [users.id] }),
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
  },
});
