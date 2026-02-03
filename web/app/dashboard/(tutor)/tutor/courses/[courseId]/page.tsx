import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { updateTutorCourse } from "@/actions/tutor-courses";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  ChapterCreateForm,
  ChapterDeleteForm,
  ChapterEditForm,
  CourseDeleteForm,
  QuizOptionCreateForm,
  QuizOptionDeleteForm,
  QuizOptionEditForm,
  QuizQuestionCreateForm,
  QuizQuestionDeleteForm,
  QuizQuestionEditForm,
} from "@/components/dashboard/tutor/course-content-forms";
import { TutorCourseForm } from "@/components/dashboard/tutor/course-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading={course.title}
        text="Update course details, chapters, and quiz content."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/tutor/courses">Back to courses</Link>
        </Button>
      </DashboardPageHeader>

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

        <Card>
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deleting a course will remove all chapters and quiz content.
            </p>
            <CourseDeleteForm courseId={course.id} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chapters</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Add chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <ChapterCreateForm
              courseId={course.id}
              defaultOrderIndex={nextOrderIndex}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {course.chapters.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No chapters yet. Add your first chapter above.
              </CardContent>
            </Card>
          ) : (
            course.chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader>
                  <CardTitle>{chapter.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <ChapterEditForm
                      chapterId={chapter.id}
                      title={chapter.title}
                      orderIndex={chapter.orderIndex ?? 1}
                      contentMarkdown={chapter.contentMarkdown}
                    />
                    <ChapterDeleteForm chapterId={chapter.id} />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Quiz</h3>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Add question</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuizQuestionCreateForm chapterId={chapter.id} />
                      </CardContent>
                    </Card>

                    {chapter.questions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No questions yet for this chapter.
                      </p>
                    ) : (
                      chapter.questions.map((question) => (
                        <Card key={question.id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Question
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <QuizQuestionEditForm
                                questionId={question.id}
                                questionText={question.questionText}
                                points={question.points ?? 1}
                              />
                              <QuizQuestionDeleteForm
                                questionId={question.id}
                              />
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold">Options</h4>
                              {question.options.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  No options yet.
                                </p>
                              ) : (
                                question.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex flex-col gap-2 rounded-md border p-3"
                                  >
                                    <QuizOptionEditForm
                                      optionId={option.id}
                                      optionText={option.optionText}
                                      isCorrect={option.isCorrect ?? false}
                                    />
                                    <QuizOptionDeleteForm
                                      optionId={option.id}
                                    />
                                  </div>
                                ))
                              )}

                              <QuizOptionCreateForm questionId={question.id} />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
