import "dotenv/config";
import { hash } from "argon2";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {
  chapterCompletions,
  chapters,
  chatMessages,
  courses,
  enrollments,
  quizOptions,
  quizQuestions,
  themes,
  userQuizAttempts,
  users,
} from "./schema";

// =============================================================================
// 1. TYPE DEFINITIONS (Contract for your Course Files)
// =============================================================================
export type SeedQuizOption = {
  text: string;
  isCorrect: boolean;
};

export type SeedQuiz = {
  question: string;
  points: number;
  options: SeedQuizOption[];
};

export type SeedChapter = {
  title: string;
  orderIndex: number;
  contentMarkdown: string;
  quizzes: SeedQuiz[];
};

export type SeedCourseData = {
  title: string;
  minLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  maxLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  description: string;
  estimatedDuration: number;
  emoji: string;
  chapters: SeedChapter[];
};

// =============================================================================
// 2. IMPORT COURSE DATA (We will uncomment these as we generate them)
// =============================================================================
import { frenchCourse } from "./courses/french";
import { germanCourse } from "./courses/german";
import { japaneseCourse } from "./courses/japanese";
import { klingonCourse } from "./courses/klingon";
import { spanishCourse } from "./courses/spanish";

// Database Setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  console.log("🌱 Starting Seeding Engine...");

  try {
    // -------------------------------------------------------------------------
    // 3. CLEANUP
    // -------------------------------------------------------------------------
    console.log("🧹 Cleaning database...");
    await db.delete(quizOptions);
    await db.delete(chapterCompletions);
    await db.delete(userQuizAttempts);
    await db.delete(chatMessages);
    await db.delete(quizQuestions);
    await db.delete(chapters);
    await db.delete(enrollments);
    await db.delete(courses);
    await db.delete(themes);
    await db.delete(users);

    // -------------------------------------------------------------------------
    // 4. USERS (Admin, Tutors, Students)
    // -------------------------------------------------------------------------
    console.log("👤 Creating users...");
    const password = await hash("Password123!");

    const [_admin] = await db
      .insert(users)
      .values({
        fullName: "Admin User",
        email: "admin@academy.com",
        passwordHash: password,
        role: "admin",
        bio: "System Administrator",
      })
      .returning();

    const [tutorSarah, tutorJulien, tutorHans, tutorAiko, tutorMartok] =
      await db
        .insert(users)
        .values([
          {
            fullName: "Claire Dubois", // French
            email: "claire@academy.com",
            passwordHash: password,
            role: "tutor",
            bio: "Native French speaker with a passion for literature and baguettes.",
          },
          {
            fullName: "Sofía Martínez", // Spanish
            email: "sofia@academy.com",
            passwordHash: password,
            role: "tutor",
            bio: "Travel lover and Spanish conversation expert.",
          },
          {
            fullName: "Hans Müller", // German
            email: "hans@academy.com",
            passwordHash: password,
            role: "tutor",
            bio: "Technical German instructor and engineer.",
          },
          {
            fullName: "Yuki Tanaka", // Japanese
            email: "yuki@academy.com",
            passwordHash: password,
            role: "tutor",
            bio: "Specializing in Japanese grammar and Keigo (polite language).",
          },
          {
            fullName: "Commander Korr", // Klingon
            email: "korr@academy.com",
            passwordHash: password,
            role: "tutor",
            bio: "Teaching the language of warriors. Qapla'!",
          },
        ])
        .returning();

    const [_student] = await db
      .insert(users)
      .values({
        fullName: "Mike Student",
        email: "student@academy.com",
        passwordHash: password,
        role: "student",
        bio: "Polyglot in training.",
      })
      .returning();

    // -------------------------------------------------------------------------
    // 5. THEMES
    // -------------------------------------------------------------------------
    console.log("🎨 Creating themes...");
    const themesData = [
      { name: "French", emoji: "🇫🇷" },
      { name: "Spanish", emoji: "🇪🇸" },
      { name: "German", emoji: "🇩🇪" },
      { name: "Japanese", emoji: "🇯🇵" },
      { name: "Klingon", emoji: "🖖" },
    ];

    const insertedThemes = await db
      .insert(themes)
      .values(themesData)
      .returning();

    const getThemeId = (name: string) => {
      const theme = insertedThemes.find((t) => t.name === name);
      if (!theme) {
        throw new Error(`Theme "${name}" not found`);
      }
      return theme.id;
    };

    // -------------------------------------------------------------------------
    // 6. COURSE INJECTION LOGIC
    // -------------------------------------------------------------------------

    const seedCourse = async (
      data: SeedCourseData,
      themeId: string,
      tutorId: string,
    ) => {
      console.log(`📘 Seeding Course: ${data.title}...`);

      const [course] = await db
        .insert(courses)
        .values({
          title: data.title,
          minLevel: data.minLevel,
          maxLevel: data.maxLevel,
          description: data.description,
          estimatedDuration: data.estimatedDuration,
          emoji: data.emoji,
          publishStatus: "published",
          publishedAt: new Date(),
          themeId: themeId,
          tutorId: tutorId,
        })
        .returning();

      for (const chapter of data.chapters) {
        const [dbChapter] = await db
          .insert(chapters)
          .values({
            courseId: course.id,
            title: chapter.title,
            orderIndex: chapter.orderIndex,
            contentMarkdown: chapter.contentMarkdown,
          })
          .returning();

        for (const quiz of chapter.quizzes) {
          const [dbQuiz] = await db
            .insert(quizQuestions)
            .values({
              chapterId: dbChapter.id,
              questionText: quiz.question,
              points: quiz.points,
            })
            .returning();

          await db.insert(quizOptions).values(
            quiz.options.map((opt) => ({
              questionId: dbQuiz.id,
              optionText: opt.text,
              isCorrect: opt.isCorrect,
            })),
          );
        }
      }
    };

    // -------------------------------------------------------------------------
    // 7. EXECUTION (Uncomment lines below as we generate files)
    // -------------------------------------------------------------------------

    await seedCourse(frenchCourse, getThemeId("French"), tutorSarah.id);
    await seedCourse(germanCourse, getThemeId("German"), tutorHans.id);
    await seedCourse(spanishCourse, getThemeId("Spanish"), tutorJulien.id);
    await seedCourse(japaneseCourse, getThemeId("Japanese"), tutorAiko.id);
    await seedCourse(klingonCourse, getThemeId("Klingon"), tutorMartok.id);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
