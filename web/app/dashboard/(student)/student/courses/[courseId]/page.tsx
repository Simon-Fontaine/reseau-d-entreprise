import { and, eq, inArray } from "drizzle-orm";
import { BookOpen, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EnrollButton } from "@/components/dashboard/student/course-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { chapterCompletions, courses, db, enrollments } from "@/db/schema";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

function formatHours(totalMinutes: number | null) {
  if (!totalMinutes) {
    return "N/A";
  }

  const hours = totalMinutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
}

export default async function StudentCoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const { success } = z.string().uuid().safeParse(courseId);
  if (!success) {
    return notFound();
  }

  const session = await auth();
  const studentId = session?.user?.id;
  if (!studentId) {
    return notFound();
  }

  const enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, studentId),
      eq(enrollments.courseId, courseId),
    ),
  });

  const course = await db.query.courses.findFirst({
    where: and(
      eq(courses.id, courseId),
      eq(courses.publishStatus, "published"),
    ),
    with: {
      theme: true,
      tutor: true,
      chapters: {
        orderBy: (chapter, { asc }) => [asc(chapter.orderIndex)],
        with: {
          questions: {
            with: {
              options: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const chapterIds = course.chapters.map((chapter) => chapter.id);
  const completions = chapterIds.length
    ? await db.query.chapterCompletions.findMany({
        where: and(
          eq(chapterCompletions.userId, studentId),
          inArray(chapterCompletions.chapterId, chapterIds),
        ),
      })
    : [];

  const completedIds = new Set(
    completions
      .map((completion) => completion.chapterId)
      .filter(Boolean) as string[],
  );

  const progressPercent = course.chapters.length
    ? Math.round((completedIds.size / course.chapters.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading={course.title}
        text="Review chapters, track progress, and complete quizzes."
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {course.chapters.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No chapters available yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {course.chapters.map((chapter, index) => (
                <Link
                  key={chapter.id}
                  href={`/dashboard/student/courses/${course.id}/chapters/${chapter.id}`}
                  className="group transition-transform hover:scale-[1.01]"
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {index + 1}. {chapter.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {chapter.questions.length} quiz question
                          {chapter.questions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      {completedIds.has(chapter.id) ? (
                        <Badge variant="secondary">Completed</Badge>
                      ) : (
                        <Badge variant="outline">In progress</Badge>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  Chapters
                </span>
                <span>{course.chapters.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Duration
                </span>
                <span>{formatHours(course.estimatedDuration ?? null)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  Level
                </span>
                <span>
                  {course.minLevel} - {course.maxLevel}
                </span>
              </div>
            </CardContent>
          </Card>

          {enrollment ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {progressPercent}% complete
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions? Chat with your tutor directly.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/student/messages">Open Chat</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Join this course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enroll to start tracking progress and accessing quizzes.
                </p>
                <EnrollButton courseId={course.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
