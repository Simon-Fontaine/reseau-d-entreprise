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

    const [tutor] = await db
      .insert(users)
      .values({
        fullName: "Sarah Lingua",
        email: "tutor@example.com",
        passwordHash: password,
        role: "tutor",
        bio: "Certified Language Instructor & Polyglot",
      })
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

    const [frenchCourse] = await db
      .insert(courses)
      .values({
        title: "French for Beginners",
        minLevel: "A1",
        maxLevel: "A2",
        themeId: frenchTheme.id,
        tutorId: tutor.id,
        description: "Master the basics of French grammar and vocabulary.",
        estimatedDuration: 600,
        emoji: "🥐",
      })
      .returning();

    const [_spanishCourse] = await db
      .insert(courses)
      .values({
        title: "Spanish Survival Skills",
        minLevel: "A1",
        maxLevel: "B1",
        themeId: spanishTheme.id,
        tutorId: tutor.id,
        description: "Essential Spanish for travelers and beginners.",
        estimatedDuration: 450,
        emoji: "💃",
      })
      .returning();

    console.log("Courses created.");

    const [chapter1] = await db
      .insert(chapters)
      .values({
        courseId: frenchCourse.id,
        title: "Greetings & Introductions",
        contentMarkdown:
          "# Greetings\n\nLearn how to say hello, goodbye, and introduce yourself in French...",
        orderIndex: 1,
      })
      .returning();

    const [_chapter2] = await db
      .insert(chapters)
      .values({
        courseId: frenchCourse.id,
        title: "Numbers & Counting",
        contentMarkdown: "# Numbers\n\nLearn to count from 1 to 100...",
        orderIndex: 2,
      })
      .returning();

    console.log("Chapters created.");

    const [q1] = await db
      .insert(quizQuestions)
      .values({
        chapterId: chapter1.id,
        questionText: "How do you say 'Hello' in French?",
        points: 10,
      })
      .returning();

    await db.insert(quizOptions).values([
      { questionId: q1.id, optionText: "Hola", isCorrect: false },
      { questionId: q1.id, optionText: "Bonjour", isCorrect: true },
      { questionId: q1.id, optionText: "Guten Tag", isCorrect: false },
    ]);

    const [q2] = await db
      .insert(quizQuestions)
      .values({
        chapterId: chapter1.id,
        questionText: "What does 'Merci' mean?",
        points: 10,
      })
      .returning();

    await db.insert(quizOptions).values([
      { questionId: q2.id, optionText: "Please", isCorrect: false },
      { questionId: q2.id, optionText: "Thank you", isCorrect: true },
      { questionId: q2.id, optionText: "Sorry", isCorrect: false },
    ]);

    console.log("Quizzes created.");

    await db.insert(enrollments).values({
      userId: student.id,
      courseId: frenchCourse.id,
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
