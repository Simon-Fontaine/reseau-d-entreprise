import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  ChapterCompleteButton,
  ChapterQuizForm,
  EnrollButton,
} from "@/components/dashboard/student/course-actions";
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
  });

  const bestScore = attempts.reduce(
    (max, attempt) => Math.max(max, attempt.scoreObtained ?? 0),
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
              Back to course
            </Link>
          </Button>
          {nextChapter ? (
            <Button asChild>
              <Link
                href={`/dashboard/student/courses/${courseId}/chapters/${nextChapter.id}`}
              >
                Next chapter
              </Link>
            </Button>
          ) : null}
        </div>
      </DashboardPageHeader>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lesson</CardTitle>
              {completion ? <Badge variant="secondary">Completed</Badge> : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.contentMarkdown ? (
                <MarkdownContent content={chapter.contentMarkdown} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No content available yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.questions.length > 0 ? (
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
                <p className="text-sm text-muted-foreground">
                  No quiz available for this chapter yet.
                </p>
              )}
              {bestScore > 0 && (
                <p className="text-xs text-muted-foreground">
                  Best score: {bestScore}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment ? (
                completion ? (
                  <p className="text-sm text-muted-foreground">
                    Marked as done on{" "}
                    {completion.completedAt?.toLocaleDateString()}
                  </p>
                ) : (
                  <ChapterCompleteButton chapterId={chapter.id} />
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enroll to track progress and mark lessons as complete.
                  </p>
                  <EnrollButton courseId={course.id} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Course</span>
                <span>{course.title}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Level</span>
                <span>
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
