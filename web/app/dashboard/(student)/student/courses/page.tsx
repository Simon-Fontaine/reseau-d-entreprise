import { and, eq, inArray, not } from "drizzle-orm";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EnrollButton } from "@/components/dashboard/student/course-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chapterCompletions, courses, db, enrollments } from "@/db/schema";

function formatHours(totalMinutes: number | null) {
  if (!totalMinutes) {
    return "N/A";
  }

  const hours = totalMinutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
}

function formatEnrollmentStatus(status: string | null) {
  if (!status) {
    return "Unknown";
  }

  const labels: Record<string, string> = {
    en_cours: "In progress",
    termine: "Completed",
    abandonne: "Abandoned",
    in_progress: "In progress",
    completed: "Completed",
    abandoned: "Abandoned",
  };

  return labels[status] ?? status;
}

export default async function StudentCoursesPage() {
  const session = await auth();
  const studentId = session?.user?.id;

  if (!studentId) {
    return null;
  }

  const enrolled = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, studentId),
    with: {
      course: {
        with: {
          theme: true,
          chapters: true,
          tutor: true,
        },
      },
    },
  });

  const chapterIdToCourseId = new Map<string, string>();
  const courseChapterCounts = new Map<string, number>();

  enrolled.forEach((entry) => {
    if (!entry.course?.id) {
      return;
    }
    const courseId = entry.course.id;
    courseChapterCounts.set(courseId, entry.course.chapters.length);
    entry.course.chapters.forEach((chapter) => {
      chapterIdToCourseId.set(chapter.id, courseId);
    });
  });

  const enrolledChapterIds = Array.from(chapterIdToCourseId.keys());
  const completions = enrolledChapterIds.length
    ? await db.query.chapterCompletions.findMany({
        where: and(
          eq(chapterCompletions.userId, studentId),
          inArray(chapterCompletions.chapterId, enrolledChapterIds),
        ),
      })
    : [];

  const completedByCourseId = completions.reduce<Record<string, number>>(
    (acc, completion) => {
      if (!completion.chapterId) {
        return acc;
      }
      const courseId = chapterIdToCourseId.get(completion.chapterId);
      if (!courseId) {
        return acc;
      }
      acc[courseId] = (acc[courseId] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const enrolledCourseIds = enrolled
    .map((entry) => entry.courseId)
    .filter(Boolean) as string[];

  const availableCourses = await db.query.courses.findMany({
    where: and(
      eq(courses.publishStatus, "published"),
      enrolledCourseIds.length
        ? not(inArray(courses.id, enrolledCourseIds))
        : undefined,
    ),
    with: {
      theme: true,
      chapters: true,
      tutor: true,
    },
  });

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        heading="My Courses"
        text="Track your enrollments, progress, and upcoming lessons."
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Enrolled courses</h2>
        {enrolled.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              You are not enrolled in any courses yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {enrolled.map((entry) => {
              const totalChapters = entry.course?.id
                ? (courseChapterCounts.get(entry.course.id) ?? 0)
                : 0;
              const completedChapters = entry.course?.id
                ? (completedByCourseId[entry.course.id] ?? 0)
                : 0;
              const progressPercent = totalChapters
                ? Math.round((completedChapters / totalChapters) * 100)
                : 0;

              return (
                <Link
                  key={entry.id}
                  href={`/dashboard/student/courses/${entry.courseId}`}
                  className="group transition-transform hover:scale-[1.01]"
                >
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">
                            {entry.course?.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {entry.course?.theme?.name ?? "No theme"} · Level{" "}
                            {entry.course?.minLevel} - {entry.course?.maxLevel}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {formatEnrollmentStatus(entry.status ?? null)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {entry.course?.chapters.length ?? 0} chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatHours(entry.course?.estimatedDuration ?? null)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Progress: {progressPercent}%
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Explore new courses</h2>
        {availableCourses.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              No new courses available right now.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {availableCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {course.theme?.name ?? "No theme"} · Level{" "}
                        {course.minLevel} - {course.maxLevel}
                      </p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.chapters.length} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatHours(course.estimatedDuration ?? null)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  <EnrollButton courseId={course.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
