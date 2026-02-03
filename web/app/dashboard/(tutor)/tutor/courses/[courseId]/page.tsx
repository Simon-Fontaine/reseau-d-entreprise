import { and, eq } from "drizzle-orm";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Clock,
  Eye,
  Globe,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { updateTutorCourse } from "@/actions/tutor-courses";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  ChapterCard,
  CreateChapterDialog,
  EmptyChaptersState,
} from "@/components/dashboard/tutor/chapter-editor";
import { CourseDeleteForm } from "@/components/dashboard/tutor/course-content-forms";
import { TutorCourseForm } from "@/components/dashboard/tutor/course-form";
import { QuizBuilder } from "@/components/dashboard/tutor/quiz-builder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses, db } from "@/db/schema";

interface TutorCourseManagePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function TutorCourseManagePage({
  params,
}: TutorCourseManagePageProps) {
  const { courseId } = await params;

  const { success } = z.string().uuid().safeParse(courseId);
  if (!success) {
    return notFound();
  }

  const session = await auth();
  const tutorId = session?.user?.id;
  if (!tutorId) {
    return notFound();
  }

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, courseId), eq(courses.tutorId, tutorId)),
    with: {
      theme: true,
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

  const themes = await db.query.themes.findMany();

  const nextOrderIndex =
    course.chapters.length === 0
      ? 1
      : Math.max(...course.chapters.map((chapter) => chapter.orderIndex ?? 1)) +
        1;

  // Calculate course stats
  const totalQuestions = course.chapters.reduce(
    (sum, ch) => sum + ch.questions.length,
    0,
  );
  const chaptersWithoutQuestions = course.chapters.filter(
    (ch) => ch.questions.length === 0,
  );
  const questionsWithoutCorrectAnswer = course.chapters.flatMap((ch) =>
    ch.questions.filter((q) => !q.options.some((o) => o.isCorrect)),
  );
  const hasValidationIssues =
    chaptersWithoutQuestions.length > 0 ||
    questionsWithoutCorrectAnswer.length > 0;

  // Status badge
  const statusConfig = {
    draft: {
      label: "Draft",
      variant: "outline" as const,
      icon: Settings,
    },
    published: {
      label: "Published",
      variant: "default" as const,
      icon: Globe,
    },
    unpublished: {
      label: "Unpublished",
      variant: "secondary" as const,
      icon: Eye,
    },
  };
  const status = statusConfig[course.publishStatus];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        heading={course.title}
        text="Manage your course content, chapters, and quizzes."
      >
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
          <Button asChild variant="outline">
            <Link href="/dashboard/tutor/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to courses
            </Link>
          </Button>
        </div>
      </DashboardPageHeader>

      {/* Validation Warnings */}
      {hasValidationIssues && course.publishStatus === "published" && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="flex items-start gap-3 pt-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                This published course has issues that may affect student
                experience
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-0.5">
                {chaptersWithoutQuestions.length > 0 && (
                  <li>
                    • {chaptersWithoutQuestions.length} chapter
                    {chaptersWithoutQuestions.length !== 1 ? "s" : ""} without
                    quiz questions
                  </li>
                )}
                {questionsWithoutCorrectAnswer.length > 0 && (
                  <li>
                    • {questionsWithoutCorrectAnswer.length} question
                    {questionsWithoutCorrectAnswer.length !== 1 ? "s" : ""}{" "}
                    without a correct answer marked
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{course.chapters.length}</p>
              <p className="text-xs text-muted-foreground">Chapters</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Quiz questions</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {course.estimatedDuration ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {course.minLevel} - {course.maxLevel}
              </p>
              <p className="text-xs text-muted-foreground">Level range</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="chapters" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chapters">
            <BookOpen className="mr-2 h-4 w-4" />
            Chapters & Quizzes
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Course Settings
          </TabsTrigger>
        </TabsList>

        {/* Chapters & Quizzes Tab */}
        <TabsContent value="chapters" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Course content</h2>
              <p className="text-sm text-muted-foreground">
                Organize your chapters and create quizzes for each section.
              </p>
            </div>
            <CreateChapterDialog
              courseId={course.id}
              defaultOrderIndex={nextOrderIndex}
            />
          </div>

          {course.chapters.length === 0 ? (
            <EmptyChaptersState
              courseId={course.id}
              defaultOrderIndex={nextOrderIndex}
            />
          ) : (
            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={{
                    id: chapter.id,
                    title: chapter.title,
                    orderIndex: chapter.orderIndex,
                    contentMarkdown: chapter.contentMarkdown,
                    questions: chapter.questions.map((q) => ({
                      id: q.id,
                      questionText: q.questionText,
                      points: q.points,
                      options: q.options.map((o) => ({
                        id: o.id,
                        optionText: o.optionText,
                        isCorrect: o.isCorrect,
                      })),
                    })),
                  }}
                  index={index}
                  quizBuilder={
                    <QuizBuilder
                      chapterId={chapter.id}
                      questions={chapter.questions.map((q) => ({
                        id: q.id,
                        questionText: q.questionText,
                        points: q.points,
                        options: q.options.map((o) => ({
                          id: o.id,
                          optionText: o.optionText,
                          isCorrect: o.isCorrect,
                        })),
                      }))}
                    />
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <TutorCourseForm
              title="Course details"
              action={updateTutorCourse}
              themes={themes}
              submitLabel="Save changes"
              defaultValues={{
                courseId: course.id,
                title: course.title,
                description: course.description,
                minLevel: course.minLevel,
                maxLevel: course.maxLevel,
                themeId: course.themeId,
                estimatedDuration: course.estimatedDuration,
                emoji: course.emoji,
                imageUrl: course.imageUrl,
                publishStatus: course.publishStatus,
              }}
            />

            <div className="space-y-6">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this course and all its content including
                    chapters, quiz questions, and student progress data.
                  </p>
                  <CourseDeleteForm courseId={course.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
