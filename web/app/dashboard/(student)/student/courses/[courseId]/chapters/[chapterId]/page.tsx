import { and, eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Award, BookCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  ChapterCompleteButton,
  EnrollButton,
} from "@/components/dashboard/student/course-actions";
import { ChapterQuizForm } from "@/components/dashboard/student/quiz-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Separator } from "@/components/ui/separator";
import {
  chapterCompletions,
  chapters,
  courses,
  db,
  enrollments,
  userQuizAttempts,
} from "@/db/schema";

interface ChapterPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function StudentChapterPage({ params }: ChapterPageProps) {
  const { courseId, chapterId } = await params;

  const courseValid = z.string().uuid().safeParse(courseId);
  const chapterValid = z.string().uuid().safeParse(chapterId);
  if (!courseValid.success || !chapterValid.success) {
    return notFound();
  }

  const session = await auth();
  const studentId = session?.user?.id;
  if (!studentId) {
    return notFound();
  }

  const course = await db.query.courses.findFirst({
    where: and(
      eq(courses.id, courseId),
      eq(courses.publishStatus, "published"),
    ),
  });

  if (!course) {
    return notFound();
  }

  const chapter = await db.query.chapters.findFirst({
    where: and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)),
    with: {
      questions: {
        with: {
          options: true,
        },
      },
    },
  });

  if (!chapter) {
    return notFound();
  }

  const orderedChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, courseId),
    orderBy: (chapterTable, { asc }) => [asc(chapterTable.orderIndex)],
  });

  const currentIndex = orderedChapters.findIndex(
    (item) => item.id === chapterId,
  );
  const prevChapter =
    currentIndex > 0 ? orderedChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 ? orderedChapters[currentIndex + 1] : null;

  const enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, studentId),
      eq(enrollments.courseId, courseId),
    ),
  });

  const completion = await db.query.chapterCompletions.findFirst({
    where: and(
      eq(chapterCompletions.userId, studentId),
      eq(chapterCompletions.chapterId, chapterId),
    ),
  });

  const attempts = await db.query.userQuizAttempts.findMany({
    where: and(
      eq(userQuizAttempts.userId, studentId),
      eq(userQuizAttempts.chapterId, chapterId),
    ),
    orderBy: (attempt, { desc }) => [desc(attempt.id)],
  });

  const bestAttempt = attempts.reduce(
    (best, attempt) =>
      (attempt.scoreObtained ?? 0) > (best?.scoreObtained ?? 0)
        ? attempt
        : best,
    attempts[0] ?? null,
  );

  const totalPoints = chapter.questions.reduce(
    (sum, q) => sum + (q.points ?? 1),
    0,
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading={chapter.title}
        text="Review the lesson content and complete the quiz to reinforce learning."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/student/courses/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course
            </Link>
          </Button>
        </div>
      </DashboardPageHeader>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Lesson Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookCheck className="h-5 w-5" />
                Lesson
              </CardTitle>
              {completion ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  Completed
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.contentMarkdown ? (
                <MarkdownContent content={chapter.contentMarkdown} />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No lesson content available yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Chapter Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!enrollment ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Award className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-2">Enroll to take quizzes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to be enrolled in this course to take quizzes and
                    track your progress.
                  </p>
                  <EnrollButton courseId={course.id} />
                </div>
              ) : chapter.questions.length > 0 ? (
                <ChapterQuizForm
                  chapterId={chapter.id}
                  questions={chapter.questions.map((question) => ({
                    id: question.id,
                    questionText: question.questionText,
                    points: question.points ?? 1,
                    options: question.options.map((option) => ({
                      id: option.id,
                      optionText: option.optionText,
                    })),
                  }))}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Award className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No quiz available for this chapter yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chapter Navigation */}
          <div className="flex items-center justify-between pt-4">
            {prevChapter ? (
              <Button asChild variant="outline">
                <Link
                  href={`/dashboard/student/courses/${courseId}/chapters/${prevChapter.id}`}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Button asChild>
                <Link
                  href={`/dashboard/student/courses/${courseId}/chapters/${nextChapter.id}`}
                >
                  Next chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={`/dashboard/student/courses/${courseId}`}>
                  Complete course
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapter Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chapter progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment ? (
                completion ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <BookCheck className="h-5 w-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Marked as done on{" "}
                      {completion.completedAt?.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Mark this chapter as complete when you&apos;re done
                      reviewing the content.
                    </p>
                    <ChapterCompleteButton chapterId={chapter.id} />
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enroll to track your progress through this course.
                  </p>
                  <EnrollButton courseId={course.id} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz Stats */}
          {enrollment && chapter.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quiz stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">
                    {chapter.questions.length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total points</span>
                  <span className="font-medium">{totalPoints}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Attempts</span>
                  <span className="font-medium">{attempts.length}</span>
                </div>
                {bestAttempt && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Best score</span>
                      <Badge
                        variant={bestAttempt.passed ? "default" : "secondary"}
                        className={bestAttempt.passed ? "bg-green-600" : ""}
                      >
                        {bestAttempt.scoreObtained ?? 0} / {totalPoints}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Course</span>
                <span className="font-medium text-foreground">
                  {course.title}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Chapter</span>
                <span className="font-medium text-foreground">
                  {currentIndex + 1} of {orderedChapters.length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Level</span>
                <span className="font-medium text-foreground">
                  {course.minLevel} - {course.maxLevel}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
