import { and, eq } from "drizzle-orm";
import { BookOpen, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { EnrollButton } from "@/components/dashboard/student/course-actions";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { courses, db, enrollments } from "@/db/schema";

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
    where: and(
      eq(courses.id, courseId),
      eq(courses.publishStatus, "published"),
    ),
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

  const session = await auth();
  const studentId = session?.user?.role === "student" ? session.user.id : null;
  const enrollment = studentId
    ? await db.query.enrollments.findFirst({
        where: and(
          eq(enrollments.userId, studentId),
          eq(enrollments.courseId, course.id),
        ),
      })
    : null;

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
          <div className="w-full">
            {session?.user?.role === "student" ? (
              enrollment ? (
                <Button asChild className="w-full">
                  <Link href={`/dashboard/student/courses/${course.id}`}>
                    Study course
                  </Link>
                </Button>
              ) : (
                <EnrollButton
                  courseId={course.id}
                  className="w-full"
                  buttonClassName="w-full"
                />
              )
            ) : (
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Sign in to enroll</Link>
              </Button>
            )}
          </div>

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
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  Published
                </span>
                <span>
                  {course.publishedAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(course.publishedAt)
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  Last updated
                </span>
                <span>
                  {course.updatedAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(course.updatedAt)
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {course.tutor && (
            <Link href={`/tutors/${course.tutor.id}`} className="group block">
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(
                          course.tutor.fullName,
                        )}`}
                        alt={`Avatar of ${course.tutor.fullName}`}
                      />
                      <AvatarFallback>
                        {course.tutor.fullName
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {course.tutor.fullName}
                      </div>
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
            </Link>
          )}
        </div>
      </Container>
    </Page>
  );
}
