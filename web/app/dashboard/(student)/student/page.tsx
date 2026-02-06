import { and, desc, eq, inArray } from "drizzle-orm";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chapterCompletions,
  db,
  enrollments,
  userQuizAttempts,
} from "@/db/schema";
import { cn } from "@/lib/utils";

export default async function StudentDashboardPage() {
  const session = await auth();
  const studentId = session?.user?.id;

  if (!studentId) {
    return null;
  }

  // Fetch enrolled courses with details
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

  // Build chapter ID to course ID mapping and chapter counts
  const chapterIdToCourseId = new Map<string, string>();
  const courseChapterCounts = new Map<string, number>();

  enrolled.forEach((entry) => {
    if (!entry.course?.id) return;
    const courseId = entry.course.id;
    courseChapterCounts.set(courseId, entry.course.chapters.length);
    entry.course.chapters.forEach((chapter) => {
      chapterIdToCourseId.set(chapter.id, courseId);
    });
  });

  const enrolledChapterIds = Array.from(chapterIdToCourseId.keys());

  // Fetch chapter completions
  const completions = enrolledChapterIds.length
    ? await db.query.chapterCompletions.findMany({
        where: and(
          eq(chapterCompletions.userId, studentId),
          inArray(chapterCompletions.chapterId, enrolledChapterIds),
        ),
        orderBy: desc(chapterCompletions.completedAt),
      })
    : [];

  // Count completions by course
  const completedByCourseId = completions.reduce<Record<string, number>>(
    (acc, completion) => {
      if (!completion.chapterId) return acc;
      const courseId = chapterIdToCourseId.get(completion.chapterId);
      if (!courseId) return acc;
      acc[courseId] = (acc[courseId] ?? 0) + 1;
      return acc;
    },
    {},
  );

  // Fetch quiz attempts
  const quizAttempts = enrolledChapterIds.length
    ? await db.query.userQuizAttempts.findMany({
        where: and(
          eq(userQuizAttempts.userId, studentId),
          inArray(userQuizAttempts.chapterId, enrolledChapterIds),
        ),
      })
    : [];

  // Calculate stats
  const totalEnrollments = enrolled.length;
  const totalChaptersCompleted = completions.length;
  const totalChapters = Array.from(courseChapterCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const totalQuizzesPassed = quizAttempts.filter((a) => a.passed).length;
  const totalQuizAttempts = quizAttempts.length;

  // Calculate courses in progress vs completed
  const coursesInProgress = enrolled.filter((e) => e.status === "in_progress");
  const coursesCompleted = enrolled.filter((e) => e.status === "completed");

  const totalActiveCourses = coursesInProgress.length;

  const totalLearningHours = Math.round(
    enrolled.reduce((sum, e) => sum + (e.course?.estimatedDuration ?? 0), 0) /
      60,
  );

  // Calculate average progress across all enrolled courses
  let totalProgressSum = 0;
  enrolled.forEach((e) => {
    if (!e.course) return;
    const courseId = e.course.id;
    const total = courseChapterCounts.get(courseId) ?? 0;
    const completed = completedByCourseId[courseId] ?? 0;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    totalProgressSum += progress;
  });

  const averageProgress =
    enrolled.length > 0 ? Math.round(totalProgressSum / enrolled.length) : 0;

  // Get courses with progress info for display
  const coursesWithProgress = enrolled
    .map((enrollment) => {
      if (!enrollment.course) return null;
      const courseId = enrollment.course.id;
      const totalChapters = courseChapterCounts.get(courseId) ?? 0;
      const completedChapters = completedByCourseId[courseId] ?? 0;
      const progress =
        totalChapters > 0
          ? Math.round((completedChapters / totalChapters) * 100)
          : 0;

      return {
        id: courseId,
        title: enrollment.course.title,
        emoji: enrollment.course.emoji,
        theme: enrollment.course.theme?.name,
        tutor: enrollment.course.tutor?.fullName,
        status: enrollment.status,
        totalChapters,
        completedChapters,
        progress,
        estimatedDuration: enrollment.course.estimatedDuration,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by in-progress first, then by progress percentage
      if (a?.status === "in_progress" && b?.status !== "in_progress") return -1;
      if (a?.status !== "in_progress" && b?.status === "in_progress") return 1;
      return (b?.progress ?? 0) - (a?.progress ?? 0);
    })
    .slice(0, 4);

  // Get recent activity (last 5 chapter completions)
  const recentCompletions = completions.slice(0, 5).map((completion) => {
    const courseId = completion.chapterId
      ? chapterIdToCourseId.get(completion.chapterId)
      : null;
    const enrollment = enrolled.find((e) => e.course?.id === courseId);
    const chapter = enrollment?.course?.chapters.find(
      (c) => c.id === completion.chapterId,
    );

    return {
      id: completion.id,
      chapterTitle: chapter?.title ?? "Unknown chapter",
      courseTitle: enrollment?.course?.title ?? "Unknown course",
      courseId,
      completedAt: completion.completedAt,
    };
  });

  // Welcome message based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        heading={`${greeting}, ${session?.user?.name?.split(" ")[0] ?? "Student"}!`}
        text="Track your learning progress and continue where you left off."
      >
        <Button asChild>
          <Link href="/dashboard/student/courses">
            Browse courses
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </DashboardPageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
              <p className="text-xs text-muted-foreground">Enrolled courses</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {totalChaptersCompleted}
                <span className="text-sm font-normal text-muted-foreground">
                  /{totalChapters}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Chapters completed
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Target className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {totalQuizzesPassed}
                <span className="text-sm font-normal text-muted-foreground">
                  /{totalQuizAttempts}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Quizzes passed</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coursesCompleted.length}</p>
              <p className="text-xs text-muted-foreground">Courses completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Continue Learning */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continue learning
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/student/courses">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {coursesWithProgress.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  Start your learning journey by enrolling in a course.
                </p>
                <Button asChild>
                  <Link href="/dashboard/student/courses">Browse courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {coursesWithProgress.map((course) => (
                  <Link
                    key={course?.id}
                    href={`/dashboard/student/courses/${course?.id}`}
                    className="block"
                  >
                    <div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                        {course?.emoji ?? "📚"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                            {course?.title}
                          </h4>
                          {course?.status === "completed" && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 shrink-0"
                            >
                              <Award className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {course?.theme && <span>{course?.theme}</span>}
                          {course?.tutor && (
                            <>
                              <span>•</span>
                              <span>{course?.tutor}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              {course?.completedChapters} of{" "}
                              {course?.totalChapters} chapters
                            </span>
                            <span className="font-medium">
                              {course?.progress}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all",
                                course?.progress === 100
                                  ? "bg-green-500"
                                  : "bg-primary",
                              )}
                              style={{ width: `${course?.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCompletions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No recent activity yet.
                  <br />
                  Start a course to track your progress!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCompletions.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {activity.chapterTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.courseTitle}
                      </p>
                      {activity.completedAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(activity.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {totalActiveCourses}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Active courses
              </p>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl font-bold text-primary">
                {averageProgress}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Average progress
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {totalLearningHours}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total hours of learning
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
