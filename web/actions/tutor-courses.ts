"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  chapters,
  courses,
  db,
  quizOptions,
  quizQuestions,
  users,
} from "@/db/schema";
import {
  chapterSchema,
  coursePublishStatusSchema,
  courseSchema,
  quizOptionSchema,
  quizQuestionSchema,
} from "@/validations/course";

async function requireTutor() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "tutor") {
    throw new Error("Unauthorized");
  }
  const tutor = await db.query.users.findFirst({
    where: and(eq(users.id, session.user.id), eq(users.role, "tutor")),
  });
  if (!tutor) {
    throw new Error("Unauthorized");
  }
  return tutor;
}

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return Object.fromEntries(formData);
}

function parseEstimatedDuration(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function shouldRethrowRedirect(error: unknown) {
  return (
    error instanceof Error &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function createTutorCourse(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const validated = courseSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const {
      title,
      description,
      minLevel,
      maxLevel,
      themeId,
      estimatedDuration,
      emoji,
      imageUrl,
      publishStatus,
    } = validated.data;

    const [created] = await db
      .insert(courses)
      .values({
        title,
        description: description || null,
        minLevel,
        maxLevel,
        themeId: themeId || null,
        tutorId: tutor.id,
        estimatedDuration: parseEstimatedDuration(estimatedDuration),
        emoji: emoji || null,
        imageUrl: imageUrl || null,
        publishStatus,
        publishedAt: publishStatus === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/tutor/courses");
    if (created?.id) {
      redirect(`/dashboard/tutor/courses/${created.id}`);
    }
    return { success: true, message: "Course created" };
  } catch (error) {
    if (shouldRethrowRedirect(error)) {
      throw error;
    }
    console.error("Create course error:", error);
    return { success: false, message: "Unable to create course" };
  }
}

export async function updateTutorCourse(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const courseId = rawData.courseId as string | undefined;

    if (!courseId) {
      return { success: false, message: "Missing course id" };
    }

    const validated = courseSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const existing = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.tutorId, tutor.id)),
    });

    if (!existing) {
      return { success: false, message: "Course not found" };
    }

    const {
      title,
      description,
      minLevel,
      maxLevel,
      themeId,
      estimatedDuration,
      emoji,
      imageUrl,
      publishStatus,
    } = validated.data;

    await db
      .update(courses)
      .set({
        title,
        description: description || null,
        minLevel,
        maxLevel,
        themeId: themeId || null,
        estimatedDuration: parseEstimatedDuration(estimatedDuration),
        emoji: emoji || null,
        imageUrl: imageUrl || null,
        publishStatus,
        publishedAt: publishStatus === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId));

    revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    revalidatePath("/dashboard/tutor/courses");
    return { success: true, message: "Course updated successfully" };
  } catch (error) {
    console.error("Update course error:", error);
    return { success: false, message: "Unable to update course" };
  }
}

export async function updateTutorCourseStatus(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const courseId = rawData.courseId as string | undefined;

    if (!courseId) {
      return { success: false, message: "Missing course id" };
    }

    const statusResult = coursePublishStatusSchema.safeParse(
      rawData.publishStatus,
    );
    if (!statusResult.success) {
      return { success: false, message: "Invalid status" };
    }

    const existing = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.tutorId, tutor.id)),
    });

    if (!existing) {
      return { success: false, message: "Course not found" };
    }

    await db
      .update(courses)
      .set({
        publishStatus: statusResult.data,
        publishedAt: statusResult.data === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId));

    revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    revalidatePath("/dashboard/tutor/courses");
    return { success: true, message: "Status updated" };
  } catch (error) {
    console.error("Update course status error:", error);
    return { success: false, message: "Unable to update status" };
  }
}

export async function deleteTutorCourse(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const courseId = rawData.courseId as string | undefined;

    if (!courseId) {
      return { success: false, message: "Missing course id" };
    }

    const existing = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.tutorId, tutor.id)),
    });

    if (!existing) {
      return { success: false, message: "Course not found" };
    }

    await db.delete(courses).where(eq(courses.id, courseId));

    revalidatePath("/dashboard/tutor/courses");
    redirect("/dashboard/tutor/courses");
    return { success: true, message: "Course deleted" };
  } catch (error) {
    if (shouldRethrowRedirect(error)) {
      throw error;
    }
    console.error("Delete course error:", error);
    return { success: false, message: "Unable to delete course" };
  }
}

export async function createChapter(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const courseId = rawData.courseId as string | undefined;

    if (!courseId) {
      return { success: false, message: "Missing course id" };
    }

    const validated = chapterSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.tutorId, tutor.id)),
    });

    if (!course) {
      return { success: false, message: "Course not found" };
    }

    const { title, contentMarkdown, orderIndex } = validated.data;

    await db.insert(chapters).values({
      courseId,
      title,
      contentMarkdown: contentMarkdown || null,
      orderIndex,
    });

    revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    return { success: true, message: "Chapter added" };
  } catch (error) {
    console.error("Create chapter error:", error);
    return { success: false, message: "Unable to add chapter" };
  }
}

export async function updateChapter(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const chapterId = rawData.chapterId as string | undefined;

    if (!chapterId) {
      return { success: false, message: "Missing chapter id" };
    }

    const validated = chapterSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
      with: {
        course: true,
      },
    });

    if (!chapter || chapter.course?.tutorId !== tutor.id) {
      return { success: false, message: "Chapter not found" };
    }

    const { title, contentMarkdown, orderIndex } = validated.data;

    await db
      .update(chapters)
      .set({
        title,
        contentMarkdown: contentMarkdown || null,
        orderIndex,
      })
      .where(eq(chapters.id, chapterId));

    revalidatePath(`/dashboard/tutor/courses/${chapter.courseId}`);
    return { success: true, message: "Chapter updated" };
  } catch (error) {
    console.error("Update chapter error:", error);
    return { success: false, message: "Unable to update chapter" };
  }
}

export async function deleteChapter(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const chapterId = rawData.chapterId as string | undefined;

    if (!chapterId) {
      return { success: false, message: "Missing chapter id" };
    }

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
      with: {
        course: true,
      },
    });

    if (!chapter || chapter.course?.tutorId !== tutor.id) {
      return { success: false, message: "Chapter not found" };
    }

    await db.delete(chapters).where(eq(chapters.id, chapterId));

    revalidatePath(`/dashboard/tutor/courses/${chapter.courseId}`);
    return { success: true, message: "Chapter deleted" };
  } catch (error) {
    console.error("Delete chapter error:", error);
    return { success: false, message: "Unable to delete chapter" };
  }
}

export async function createQuizQuestion(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const chapterId = rawData.chapterId as string | undefined;

    if (!chapterId) {
      return { success: false, message: "Missing chapter id" };
    }

    const validated = quizQuestionSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
      with: {
        course: true,
      },
    });

    if (!chapter || chapter.course?.tutorId !== tutor.id) {
      return { success: false, message: "Chapter not found" };
    }

    const { questionText, points } = validated.data;

    await db.insert(quizQuestions).values({
      chapterId,
      questionText,
      points,
    });

    revalidatePath(`/dashboard/tutor/courses/${chapter.courseId}`);
    return { success: true, message: "Quiz question added" };
  } catch (error) {
    console.error("Create quiz question error:", error);
    return { success: false, message: "Unable to add question" };
  }
}

export async function updateQuizQuestion(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const questionId = rawData.questionId as string | undefined;

    if (!questionId) {
      return { success: false, message: "Missing question id" };
    }

    const validated = quizQuestionSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const question = await db.query.quizQuestions.findFirst({
      where: eq(quizQuestions.id, questionId),
      with: {
        chapter: {
          with: {
            course: true,
          },
        },
      },
    });

    if (!question || question.chapter?.course?.tutorId !== tutor.id) {
      return { success: false, message: "Question not found" };
    }

    const { questionText, points } = validated.data;

    await db
      .update(quizQuestions)
      .set({ questionText, points })
      .where(eq(quizQuestions.id, questionId));

    const courseId = question.chapter?.courseId;
    if (courseId) {
      revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    }
    return { success: true, message: "Question updated" };
  } catch (error) {
    console.error("Update quiz question error:", error);
    return { success: false, message: "Unable to update question" };
  }
}

export async function deleteQuizQuestion(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const questionId = rawData.questionId as string | undefined;

    if (!questionId) {
      return { success: false, message: "Missing question id" };
    }

    const question = await db.query.quizQuestions.findFirst({
      where: eq(quizQuestions.id, questionId),
      with: {
        chapter: {
          with: {
            course: true,
          },
        },
      },
    });

    if (!question || question.chapter?.course?.tutorId !== tutor.id) {
      return { success: false, message: "Question not found" };
    }

    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));

    const courseId = question.chapter?.courseId;
    if (courseId) {
      revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    }
    return { success: true, message: "Question deleted" };
  } catch (error) {
    console.error("Delete quiz question error:", error);
    return { success: false, message: "Unable to delete question" };
  }
}

export async function createQuizOption(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const questionId = rawData.questionId as string | undefined;

    if (!questionId) {
      return { success: false, message: "Missing question id" };
    }

    const validated = quizOptionSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const question = await db.query.quizQuestions.findFirst({
      where: eq(quizQuestions.id, questionId),
      with: {
        chapter: {
          with: {
            course: true,
          },
        },
      },
    });

    if (!question || question.chapter?.course?.tutorId !== tutor.id) {
      return { success: false, message: "Question not found" };
    }

    await db.insert(quizOptions).values({
      questionId,
      optionText: validated.data.optionText,
      isCorrect: validated.data.isCorrect ?? false,
    });

    revalidatePath(`/dashboard/tutor/courses/${question.chapterId}`);
    return { success: true, message: "Option added" };
  } catch (error) {
    console.error("Create quiz option error:", error);
    return { success: false, message: "Unable to add option" };
  }
}

export async function updateQuizOption(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const optionId = rawData.optionId as string | undefined;

    if (!optionId) {
      return { success: false, message: "Missing option id" };
    }

    const validated = quizOptionSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const option = await db.query.quizOptions.findFirst({
      where: eq(quizOptions.id, optionId),
      with: {
        question: {
          with: {
            chapter: {
              with: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!option || option.question?.chapter?.course?.tutorId !== tutor.id) {
      return { success: false, message: "Option not found" };
    }

    await db
      .update(quizOptions)
      .set({
        optionText: validated.data.optionText,
        isCorrect: validated.data.isCorrect ?? false,
      })
      .where(eq(quizOptions.id, optionId));

    const courseId = option.question?.chapter?.courseId;
    if (courseId) {
      revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    }
    return { success: true, message: "Option updated" };
  } catch (error) {
    console.error("Update quiz option error:", error);
    return { success: false, message: "Unable to update option" };
  }
}

export async function deleteQuizOption(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tutor = await requireTutor();
    const rawData = parseFormData(formData);
    const optionId = rawData.optionId as string | undefined;

    if (!optionId) {
      return { success: false, message: "Missing option id" };
    }

    const option = await db.query.quizOptions.findFirst({
      where: eq(quizOptions.id, optionId),
      with: {
        question: {
          with: {
            chapter: {
              with: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!option || option.question?.chapter?.course?.tutorId !== tutor.id) {
      return { success: false, message: "Option not found" };
    }

    await db.delete(quizOptions).where(eq(quizOptions.id, optionId));

    const courseId = option.question?.chapter?.courseId;
    if (courseId) {
      revalidatePath(`/dashboard/tutor/courses/${courseId}`);
    }
    return { success: true, message: "Option deleted" };
  } catch (error) {
    console.error("Delete quiz option error:", error);
    return { success: false, message: "Unable to delete option" };
  }
}
