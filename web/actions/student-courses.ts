"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import {
  chapterCompletions,
  chapters,
  courses,
  db,
  enrollments,
  quizOptions,
  quizQuestions,
  userQuizAttempts,
  users,
} from "@/db/schema";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type QuizResult = {
  questionId: string;
  questionText: string;
  points: number;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  isCorrect: boolean;
  correctOptionId: string;
  correctOptionText: string;
  explanation?: string;
};

export type QuizActionState = ActionState & {
  results?: QuizResult[];
  score?: number;
  totalPoints?: number;
  passed?: boolean;
  percentage?: number;
};

async function requireStudent() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    throw new Error("Unauthorized");
  }

  const student = await db.query.users.findFirst({
    where: and(eq(users.id, session.user.id), eq(users.role, "student")),
  });

  if (!student) {
    throw new Error("Unauthorized");
  }

  return student;
}

const enrollSchema = z.object({
  courseId: z.string().uuid(),
});

const quizSchema = z.object({
  chapterId: z.string().uuid(),
});

export async function enrollInCourse(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const student = await requireStudent();
    const rawData = Object.fromEntries(formData);
    const validated = enrollSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid course",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { courseId } = validated.data;

    const course = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, courseId),
        eq(courses.publishStatus, "published"),
      ),
    });

    if (!course) {
      return { success: false, message: "Course not available" };
    }

    const existing = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, student.id),
        eq(enrollments.courseId, courseId),
      ),
    });

    if (existing) {
      return { success: true, message: "You are already enrolled" };
    }

    await db.insert(enrollments).values({
      userId: student.id,
      courseId,
      status: "in_progress",
    });

    revalidatePath("/dashboard/student/courses");
    revalidatePath(`/dashboard/student/courses/${courseId}`);
    return { success: true, message: "Enrollment successful" };
  } catch (error) {
    console.error("Enroll error:", error);
    return { success: false, message: "Unable to enroll" };
  }
}

export async function submitChapterQuiz(
  _prevState: QuizActionState | null,
  formData: FormData,
): Promise<QuizActionState> {
  try {
    const student = await requireStudent();
    const rawData = Object.fromEntries(formData);
    const validated = quizSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid quiz",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { chapterId } = validated.data;

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
      with: {
        course: true,
      },
    });

    if (!chapter?.courseId) {
      return { success: false, message: "Chapter not found" };
    }

    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, student.id),
        eq(enrollments.courseId, chapter.courseId),
      ),
    });

    if (!enrollment) {
      return { success: false, message: "Enroll in the course first" };
    }

    const questions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.chapterId, chapterId),
    });

    if (questions.length === 0) {
      return { success: false, message: "No quiz questions available" };
    }

    const questionIds = questions.map((question) => question.id);
    const options = await db.query.quizOptions.findMany({
      where: inArray(quizOptions.questionId, questionIds),
    });

    const optionsByQuestion = options.reduce<Record<string, typeof options>>(
      (acc, option) => {
        if (!option.questionId) {
          return acc;
        }
        acc[option.questionId] ??= [];
        acc[option.questionId].push(option);
        return acc;
      },
      {},
    );

    let totalPoints = 0;
    let score = 0;
    const results: QuizResult[] = [];

    questions.forEach((question) => {
      const questionPoints = question.points ?? 1;
      totalPoints += questionPoints;

      const selectedOptionId = formData.get(`question-${question.id}`) as
        | string
        | null;
      const questionOptions = optionsByQuestion[question.id] ?? [];
      const selectedOption = selectedOptionId
        ? questionOptions.find((opt) => opt.id === selectedOptionId)
        : null;
      const correctOption = questionOptions.find((opt) => opt.isCorrect);

      const isCorrect = selectedOption?.isCorrect ?? false;
      if (isCorrect) {
        score += questionPoints;
      }

      results.push({
        questionId: question.id,
        questionText: question.questionText,
        points: questionPoints,
        selectedOptionId: selectedOptionId,
        selectedOptionText: selectedOption?.optionText ?? null,
        isCorrect,
        correctOptionId: correctOption?.id ?? "",
        correctOptionText:
          correctOption?.optionText ?? "No correct answer defined",
      });
    });

    const passed = totalPoints > 0 ? score / totalPoints >= 0.7 : false;
    const percentage =
      totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    await db.insert(userQuizAttempts).values({
      userId: student.id,
      chapterId,
      scoreObtained: score,
      passed,
    });

    revalidatePath(`/dashboard/student/courses/${chapter.courseId}`);
    return {
      success: true,
      message: passed
        ? `Great job! You scored ${percentage}% and passed the quiz!`
        : `You scored ${percentage}%. Keep studying and try again!`,
      results,
      score,
      totalPoints,
      passed,
      percentage,
    };
  } catch (error) {
    console.error("Quiz submit error:", error);
    return { success: false, message: "Unable to submit quiz" };
  }
}

export async function markChapterComplete(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const student = await requireStudent();
    const rawData = Object.fromEntries(formData);
    const validated = quizSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid chapter",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { chapterId } = validated.data;
    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
      with: { course: true },
    });

    if (!chapter?.courseId) {
      return { success: false, message: "Chapter not found" };
    }

    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, student.id),
        eq(enrollments.courseId, chapter.courseId),
      ),
    });

    if (!enrollment) {
      return { success: false, message: "Enroll in the course first" };
    }

    const existingCompletion = await db.query.chapterCompletions.findFirst({
      where: and(
        eq(chapterCompletions.userId, student.id),
        eq(chapterCompletions.chapterId, chapterId),
      ),
    });

    if (!existingCompletion) {
      await db.insert(chapterCompletions).values({
        userId: student.id,
        chapterId,
      });
    }

    const courseChapters = await db.query.chapters.findMany({
      where: eq(chapters.courseId, chapter.courseId),
    });

    const chapterIds = courseChapters.map((item) => item.id);
    const completions = chapterIds.length
      ? await db.query.chapterCompletions.findMany({
          where: and(
            eq(chapterCompletions.userId, student.id),
            inArray(chapterCompletions.chapterId, chapterIds),
          ),
        })
      : [];

    const completedIds = new Set(
      completions
        .map((completion) => completion.chapterId)
        .filter(Boolean) as string[],
    );

    const progressPercent = chapterIds.length
      ? Math.round((completedIds.size / chapterIds.length) * 100)
      : 0;

    await db
      .update(enrollments)
      .set({
        status: progressPercent >= 100 ? "completed" : "in_progress",
      })
      .where(eq(enrollments.id, enrollment.id));

    revalidatePath(`/dashboard/student/courses/${chapter.courseId}`);
    revalidatePath(
      `/dashboard/student/courses/${chapter.courseId}/chapters/${chapterId}`,
    );
    return { success: true, message: "Chapter marked as done" };
  } catch (error) {
    console.error("Mark chapter complete error:", error);
    return { success: false, message: "Unable to mark chapter" };
  }
}
