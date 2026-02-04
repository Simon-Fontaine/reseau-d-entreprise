import { BookOpen, Palette, Pencil, Plus, Trash2 } from "lucide-react";
import {
  CreateThemeDialog,
  DeleteThemeDialog,
  EditThemeDialog,
} from "@/components/dashboard/admin/theme-dialogs";
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

export default async function AdminThemesPage() {
  const allThemes = await db.query.themes.findMany({
    orderBy: (theme, { asc }) => [asc(theme.name)],
  });

  // Get course counts per theme
  const allCourses = await db.query.courses.findMany({
    columns: { themeId: true },
  });

  const themeCourseCount = allCourses.reduce(
    (acc, course) => {
      if (course.themeId) {
        acc[course.themeId] = (acc[course.themeId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Theme Management"
        text="Create and manage themes for categorizing courses."
      >
        <CreateThemeDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New theme
          </Button>
        </CreateThemeDialog>
      </DashboardPageHeader>

      {/* Stats Card */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allThemes.length}</p>
              <p className="text-xs text-muted-foreground">Total themes</p>
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
                {allThemes.filter((t) => themeCourseCount[t.id]).length}
              </p>
              <p className="text-xs text-muted-foreground">
                Themes with courses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Themes Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            All themes ({allThemes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allThemes.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                No themes yet. Create your first theme to get started.
              </p>
              <CreateThemeDialog>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create theme
                </Button>
              </CreateThemeDialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Theme</TableHead>
                  <TableHead>Emoji</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead className="w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allThemes.map((theme) => {
                  const courseCount = themeCourseCount[theme.id] || 0;
                  const hasCoursesLinked = courseCount > 0;

                  return (
                    <TableRow key={theme.id}>
                      <TableCell className="font-medium">
                        {theme.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-xl">{theme.emoji || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={hasCoursesLinked ? "default" : "outline"}
                        >
                          {courseCount} course{courseCount !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <EditThemeDialog theme={theme}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Edit theme"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </EditThemeDialog>
                          <DeleteThemeDialog theme={theme}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Delete theme"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteThemeDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
