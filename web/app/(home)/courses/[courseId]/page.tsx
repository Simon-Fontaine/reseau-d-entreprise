import { eq } from "drizzle-orm";
import { BookOpen, Clock, Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { courses, db } from "@/db/schema";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;

  const { success } = z.string().uuid().safeParse(courseId);
  if (!success) {
    return notFound();
  }

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      chapters: {
        orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
      },
      tutor: true,
      theme: true,
    },
  });

  if (!course) {
    notFound();
  }

  const estimatedHours = course.estimatedDuration
    ? course.estimatedDuration / 60
    : null;
  const formattedDuration = estimatedHours
    ? `${estimatedHours % 1 === 0 ? estimatedHours : estimatedHours.toFixed(1)} hrs`
    : "N/A";

  return (
    <Page>
      <PageHeader>
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{course.emoji || "📚"}</span>
            <div>
              <PageHeaderHeading>{course.title}</PageHeaderHeading>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  {course.minLevel} - {course.maxLevel}
                </Badge>
                {course.theme && (
                  <Badge variant="outline">{course.theme.name}</Badge>
                )}
              </div>
            </div>
          </div>

          <PageHeaderDescription>{course.description}</PageHeaderDescription>
        </Container>
      </PageHeader>

      <Container className="py-8 grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <div className="space-y-4">
            {course.chapters.length > 0 ? (
              course.chapters.map((chapter, index) => (
                <Card key={chapter.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      {chapter.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">
                No chapters available yet.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
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
                <span>{formattedDuration}</span>
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

          {course.tutor && (
            <Card>
              <CardHeader>
                <CardTitle>Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                    {course.tutor.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{course.tutor.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      Instructor
                    </div>
                  </div>
                </div>
                {course.tutor.bio && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {course.tutor.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </Page>
  );
}
