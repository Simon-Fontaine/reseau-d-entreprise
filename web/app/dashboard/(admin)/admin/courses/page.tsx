import {
  BookOpen,
  ExternalLink,
  Eye,
  FileEdit,
  Globe,
  Layers,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { DeleteCourseDialog } from "@/components/dashboard/admin/course-dialogs";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/schema";

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "outline" as const,
    icon: FileEdit,
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

export default async function AdminCoursesPage() {
  const allCourses = await db.query.courses.findMany({
    with: {
      tutor: true,
      theme: true,
      chapters: true,
      enrollments: true,
    },
    orderBy: (course, { desc }) => [desc(course.updatedAt)],
  });

  const publishedCount = allCourses.filter(
    (c) => c.publishStatus === "published",
  ).length;
  const totalEnrollments = allCourses.reduce(
    (sum, c) => sum + c.enrollments.length,
    0,
  );
  const totalChapters = allCourses.reduce(
    (sum, c) => sum + c.chapters.length,
    0,
  );

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
        heading="Course Management"
        text="View and manage all courses on the platform."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allCourses.length}</p>
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
              <p className="text-2xl font-bold">{publishedCount}</p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Layers className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalChapters}</p>
              <p className="text-xs text-muted-foreground">Total chapters</p>
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
              <p className="text-xs text-muted-foreground">Enrollments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            All courses ({allCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                No courses yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Chapters</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCourses.map((course) => {
                    const status = statusConfig[course.publishStatus];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg shrink-0">
                              {course.emoji || "📚"}
                            </span>
                            <span className="font-medium truncate max-w-50">
                              {course.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {course.tutor?.fullName ?? "Unknown"}
                        </TableCell>
                        <TableCell>
                          {course.theme ? (
                            <Badge variant="outline">
                              {course.theme.emoji} {course.theme.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {course.minLevel}–{course.maxLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.chapters.length}</TableCell>
                        <TableCell>{course.enrollments.length}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatDate(course.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon-sm"
                              title="View course"
                            >
                              <Link href={`/courses/${course.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeleteCourseDialog course={course}>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Delete course"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteCourseDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
