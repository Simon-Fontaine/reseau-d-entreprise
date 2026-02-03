import "dotenv/config";
import { hash } from "argon2";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {
  chapters,
  courses,
  enrollments,
  quizOptions,
  quizQuestions,
  themes,
  users,
} from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("🌱 Starting seeding...");

  try {
    console.log("Cleaning existing data...");
    await db.delete(quizOptions);
    await db.delete(quizQuestions);
    await db.delete(chapters);
    await db.delete(enrollments);
    await db.delete(courses);
    await db.delete(themes);
    await db.delete(users);

    const password = await hash("Password123!");

    const [_admin] = await db
      .insert(users)
      .values({
        fullName: "Admin User",
        email: "admin@example.com",
        passwordHash: password,
        role: "admin",
        bio: "System Administrator",
      })
      .returning();

    const [tutorOne, tutorTwo] = await db
      .insert(users)
      .values([
        {
          fullName: "Sarah Lingua",
          email: "tutor.sarah@example.com",
          passwordHash: password,
          role: "tutor",
          bio: "Certified Language Instructor & Polyglot",
        },
        {
          fullName: "Julien Moreau",
          email: "tutor.julien@example.com",
          passwordHash: password,
          role: "tutor",
          bio: "Language Coach specializing in immersive learning",
        },
      ])
      .returning();

    const [student] = await db
      .insert(users)
      .values({
        fullName: "Mike Student",
        email: "student@example.com",
        passwordHash: password,
        role: "student",
        bio: "Eager to learn French and Spanish",
      })
      .returning();

    console.log("Users created.");

    const [frenchTheme] = await db
      .insert(themes)
      .values({
        name: "French",
        emoji: "🇫🇷",
      })
      .returning();

    const [spanishTheme] = await db
      .insert(themes)
      .values({
        name: "Spanish",
        emoji: "🇪🇸",
      })
      .returning();

    const [_germanTheme] = await db
      .insert(themes)
      .values({
        name: "German",
        emoji: "🇩🇪",
      })
      .returning();

    console.log("Themes created.");

    const coursesToCreate: Array<typeof courses.$inferInsert> = [
      {
        title: "French for Beginners",
        minLevel: "A1",
        maxLevel: "A2",
        themeId: frenchTheme.id,
        tutorId: tutorOne.id,
        description: "Master the basics of French grammar and vocabulary.",
        estimatedDuration: 600,
        emoji: "🥐",
        publishStatus: "published",
        publishedAt: new Date(),
      },
      {
        title: "Spanish Survival Skills",
        minLevel: "A1",
        maxLevel: "B1",
        themeId: spanishTheme.id,
        tutorId: tutorTwo.id,
        description: "Essential Spanish for travelers and beginners.",
        estimatedDuration: 450,
        emoji: "💃",
        publishStatus: "published",
        publishedAt: new Date(),
      },
      {
        title: "French Conversation Boost",
        minLevel: "A2",
        maxLevel: "B1",
        themeId: frenchTheme.id,
        tutorId: tutorOne.id,
        description: "Build confidence with everyday French dialogues.",
        estimatedDuration: 520,
        emoji: "🗣️",
        publishStatus: "published",
        publishedAt: new Date(),
      },
      {
        title: "Spanish Grammar Essentials",
        minLevel: "A2",
        maxLevel: "B1",
        themeId: spanishTheme.id,
        tutorId: tutorTwo.id,
        description: "Understand verb conjugations and sentence structure.",
        estimatedDuration: 540,
        emoji: "📘",
        publishStatus: "published",
        publishedAt: new Date(),
      },
      {
        title: "German Starter Pack",
        minLevel: "A1",
        maxLevel: "A2",
        themeId: _germanTheme.id,
        tutorId: tutorOne.id,
        description: "Start speaking German with core phrases and grammar.",
        estimatedDuration: 480,
        emoji: "🍺",
        publishStatus: "published",
        publishedAt: new Date(),
      },
    ];

    const createdCourses = await db
      .insert(courses)
      .values(coursesToCreate)
      .returning();

    console.log("Courses created.");

    for (const course of createdCourses) {
      const [chapterOne] = await db
        .insert(chapters)
        .values({
          courseId: course.id,
          title: "Foundations",
          contentMarkdown:
            "# Foundations\n\nCore phrases, pronunciation tips, and essential vocabulary.",
          orderIndex: 1,
        })
        .returning();

      await db.insert(chapters).values({
        courseId: course.id,
        title: "Practice & Review",
        contentMarkdown:
          "# Practice\n\nGuided exercises to reinforce what you've learned.",
        orderIndex: 2,
      });

      const [questionOne] = await db
        .insert(quizQuestions)
        .values({
          chapterId: chapterOne.id,
          questionText: `Which level range does the course "${course.title}" cover?`,
          points: 10,
        })
        .returning();

      await db.insert(quizOptions).values([
        {
          questionId: questionOne.id,
          optionText: course.minLevel,
          isCorrect: true,
        },
        { questionId: questionOne.id, optionText: "C1", isCorrect: false },
        { questionId: questionOne.id, optionText: "A0", isCorrect: false },
      ]);

      const [questionTwo] = await db
        .insert(quizQuestions)
        .values({
          chapterId: chapterOne.id,
          questionText: `How long is "${course.title}"?`,
          points: 10,
        })
        .returning();

      await db.insert(quizOptions).values([
        {
          questionId: questionTwo.id,
          optionText: `${course.estimatedDuration} minutes`,
          isCorrect: true,
        },
        {
          questionId: questionTwo.id,
          optionText: "120 minutes",
          isCorrect: false,
        },
        {
          questionId: questionTwo.id,
          optionText: "900 minutes",
          isCorrect: false,
        },
      ]);
    }

    console.log("Chapters created.");
    console.log("Quizzes created.");

    await db.insert(enrollments).values({
      userId: student.id,
      courseId: createdCourses[0].id,
      status: "en_cours",
      progressPercent: 15,
    });

    console.log("Enrollments created.");

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
