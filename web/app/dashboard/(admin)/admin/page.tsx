import {
  BookOpen,
  ChevronRight,
  Eye,
  FileEdit,
  Globe,
  GraduationCap,
  Layers,
  Palette,
  Settings,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/schema";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Fetch all stats
  const allUsers = await db.query.users.findMany();
  const allCourses = await db.query.courses.findMany({
    with: {
      tutor: true,
      theme: true,
      chapters: true,
      enrollments: true,
    },
    orderBy: (course, { desc }) => [desc(course.updatedAt)],
  });
  const allThemes = await db.query.themes.findMany();
  const allEnrollments = await db.query.enrollments.findMany();

  // Calculate user stats
  const studentCount = allUsers.filter((u) => u.role === "student").length;
  const tutorCount = allUsers.filter((u) => u.role === "tutor").length;
  const adminCount = allUsers.filter((u) => u.role === "admin").length;

  // Calculate course stats
  const publishedCourses = allCourses.filter(
    (c) => c.publishStatus === "published",
  );
  const draftCourses = allCourses.filter((c) => c.publishStatus === "draft");
  const totalChapters = allCourses.reduce(
    (sum, c) => sum + c.chapters.length,
    0,
  );

  // Recent courses (last 5)
  const recentCourses = allCourses.slice(0, 5);

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
        heading={`${greeting}, ${session?.user?.name?.split(" ")[0] ?? "Admin"}!`}
        text="Manage users, courses, and platform settings."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allUsers.length}</p>
              <p className="text-xs text-muted-foreground">Total users</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {publishedCourses.length}
                <span className="text-sm font-normal text-muted-foreground">
                  /{allCourses.length}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Published courses</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allEnrollments.length}</p>
              <p className="text-xs text-muted-foreground">Enrollments</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Palette className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allThemes.length}</p>
              <p className="text-xs text-muted-foreground">Themes</p>
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
              Recent courses
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/admin/courses">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No courses yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentCourses.map((course) => {
                  const status = statusConfig[course.publishStatus];
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">
                          {course.emoji || "📚"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            by {course.tutor?.fullName ?? "Unknown"} •{" "}
                            {course.chapters.length} chapters
                          </p>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="shrink-0">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Breakdown & Quick Links */}
        <div className="space-y-6">
          {/* User Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Students</span>
                <span className="font-medium">{studentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tutors</span>
                <span className="font-medium">{tutorCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Admins</span>
                <span className="font-medium">{adminCount}</span>
              </div>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/dashboard/admin/users">
                  Manage users
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total chapters
                </span>
                <span className="font-medium">{totalChapters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Draft courses
                </span>
                <span className="font-medium">{draftCourses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg. enrollments/course
                </span>
                <span className="font-medium">
                  {allCourses.length > 0
                    ? Math.round(allEnrollments.length / allCourses.length)
                    : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage users
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/admin/themes">
                  <Palette className="mr-2 h-4 w-4" />
                  Manage themes
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/admin/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View all courses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
