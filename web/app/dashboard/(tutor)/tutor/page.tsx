import { eq } from "drizzle-orm";
import {
  BookOpen,
  ChevronRight,
  Eye,
  FileEdit,
  Globe,
  GraduationCap,
  HelpCircle,
  Layers,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses, db } from "@/db/schema";

export default async function TutorDashboardPage() {
  const session = await auth();
  const tutorId = session?.user?.id;

  if (!tutorId) {
    return null;
  }

  // Fetch tutor's courses with details
  const tutorCourses = await db.query.courses.findMany({
    where: eq(courses.tutorId, tutorId),
    with: {
      theme: true,
      chapters: {
        with: {
          questions: true,
        },
      },
      enrollments: true,
    },
    orderBy: (course, { desc }) => [desc(course.updatedAt)],
  });

  // Calculate stats
  const totalCourses = tutorCourses.length;
  const publishedCourses = tutorCourses.filter(
    (c) => c.publishStatus === "published",
  );
  const _draftCourses = tutorCourses.filter((c) => c.publishStatus === "draft");

  const totalChapters = tutorCourses.reduce(
    (sum, c) => sum + c.chapters.length,
    0,
  );
  const totalQuestions = tutorCourses.reduce(
    (sum, c) =>
      sum + c.chapters.reduce((chSum, ch) => chSum + ch.questions.length, 0),
    0,
  );
  const totalEnrollments = tutorCourses.reduce(
    (sum, c) => sum + c.enrollments.length,
    0,
  );

  const totalDurationMinutes = tutorCourses.reduce(
    (sum, c) => sum + (c.estimatedDuration || 0),
    0,
  );

  const uniqueThemes = new Set(
    tutorCourses.map((c) => c.themeId).filter(Boolean),
  ).size;

  // Get courses that need attention (drafts, no chapters, or unpublished with content)
  const coursesNeedingAttention = tutorCourses.filter((course) => {
    const hasNoChapters = course.chapters.length === 0;
    const hasChaptersWithoutQuestions = course.chapters.some(
      (ch) => ch.questions.length === 0,
    );
    const isDraft = course.publishStatus === "draft";
    return isDraft || hasNoChapters || hasChaptersWithoutQuestions;
  });

  // Get recent courses for quick access
  const recentCourses = tutorCourses.slice(0, 4);

  // Status badge config
  const statusConfig = {
    draft: {
      label: "Draft",
      variant: "outline" as const,
      icon: FileEdit,
      className: "text-muted-foreground",
    },
    published: {
      label: "Published",
      variant: "default" as const,
      icon: Globe,
      className: "text-green-600",
    },
    unpublished: {
      label: "Unpublished",
      variant: "secondary" as const,
      icon: Eye,
      className: "text-amber-600",
    },
  };

  // Welcome message based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        heading={`${greeting}, ${session?.user?.name?.split(" ")[0] ?? "Tutor"}!`}
        text="Manage your courses and track student engagement."
      >
        <Button asChild>
          <Link href="/dashboard/tutor/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            New course
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
              <p className="text-2xl font-bold">{totalCourses}</p>
              <p className="text-xs text-muted-foreground">Total courses</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {publishedCourses.length}
                <span className="text-sm font-normal text-muted-foreground">
                  /{totalCourses}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
              <p className="text-xs text-muted-foreground">Total students</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <HelpCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Quiz questions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Recent Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Your courses
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/tutor/courses">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  Create your first course to start teaching.
                </p>
                <Button asChild>
                  <Link href="/dashboard/tutor/courses/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create course
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((course) => {
                  const status = statusConfig[course.publishStatus];
                  const StatusIcon = status.icon;
                  const chapterCount = course.chapters.length;
                  const questionCount = course.chapters.reduce(
                    (sum, ch) => sum + ch.questions.length,
                    0,
                  );
                  const studentCount = course.enrollments.length;

                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/tutor/courses/${course.id}`}
                      className="block"
                    >
                      <div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                          {course.emoji ?? "📚"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                            <Badge
                              variant={status.variant}
                              className="shrink-0"
                            >
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            {course.theme && <span>{course.theme.name}</span>}
                            <span>•</span>
                            <span>
                              {course.minLevel} - {course.maxLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Layers className="h-3.5 w-3.5" />
                              {chapterCount} chapter
                              {chapterCount !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-3.5 w-3.5" />
                              {questionCount} question
                              {questionCount !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {studentCount} student
                              {studentCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coursesNeedingAttention.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium mb-1">All caught up!</h3>
                <p className="text-xs text-muted-foreground">
                  All your courses are in good shape.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {coursesNeedingAttention.slice(0, 5).map((course) => {
                  const issues: string[] = [];
                  if (course.publishStatus === "draft") {
                    issues.push("Draft");
                  }
                  if (course.chapters.length === 0) {
                    issues.push("No chapters");
                  } else if (
                    course.chapters.some((ch) => ch.questions.length === 0)
                  ) {
                    issues.push("Missing quizzes");
                  }

                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/tutor/courses/${course.id}`}
                      className="block"
                    >
                      <div className="group flex items-start gap-3 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-3 transition-colors hover:bg-amber-100/50 dark:hover:bg-amber-950/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/50 text-lg">
                          {course.emoji ?? "📚"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {issues.map((issue) => (
                              <Badge
                                key={issue}
                                variant="outline"
                                className="text-xs border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                              >
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Settings className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      </div>
                    </Link>
                  );
                })}
                {coursesNeedingAttention.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{coursesNeedingAttention.length - 5} more courses need
                    attention
                  </p>
                )}
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
                {totalChapters}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total chapters created
              </p>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl font-bold text-primary">
                {Math.round(totalDurationMinutes / 60)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total hours of content
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {uniqueThemes}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Active themes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
