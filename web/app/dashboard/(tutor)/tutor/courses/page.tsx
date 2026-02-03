import { eq } from "drizzle-orm";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses, db } from "@/db/schema";

function formatHours(totalMinutes: number | null) {
  if (!totalMinutes) {
    return "N/A";
  }

  const hours = totalMinutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
}

export default async function TutorCoursesPage() {
  const session = await auth();

  const tutorId = session?.user?.id;
  if (!tutorId) {
    return null;
  }

  const tutorCourses = await db.query.courses.findMany({
    where: eq(courses.tutorId, tutorId),
    with: {
      theme: true,
      chapters: true,
    },
    orderBy: (course, { desc }) => [desc(course.title)],
  });

  const formatDate = (value?: Date | null) =>
    value
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(value)
      : "—";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Manage Courses"
        text="Create, publish, and organize your courses, chapters, and quizzes."
      >
        <Button asChild>
          <Link href="/dashboard/tutor/courses/new">New Course</Link>
        </Button>
      </DashboardPageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {tutorCourses.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No courses yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create your first course to start building your curriculum.
            </CardContent>
          </Card>
        ) : (
          tutorCourses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/tutor/courses/${course.id}`}
              className="group flex h-full transition-transform hover:scale-[1.01]"
            >
              <Card className="flex min-h-[240px] w-full flex-col cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex h-full flex-col space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {course.theme ? course.theme.name : "No theme"} · Level{" "}
                        {course.minLevel} - {course.maxLevel}
                      </p>
                    </div>
                    <Badge
                      variant={
                        course.publishStatus === "published"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {course.publishStatus}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.chapters.length} chapter
                      {course.chapters.length === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatHours(course.estimatedDuration ?? null)}
                    </span>
                  </div>
                  <div className="mt-auto text-xs text-muted-foreground">
                    Published {formatDate(course.publishedAt)} · Updated{" "}
                    {formatDate(course.updatedAt)}
                  </div>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
