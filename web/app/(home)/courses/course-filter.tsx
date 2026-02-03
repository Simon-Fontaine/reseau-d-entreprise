"use client";

import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ThemeSummary = {
  id: string;
  name: string;
  emoji: string | null;
};

type CourseSummary = {
  id: string;
  title: string;
  description: string | null;
  minLevel: string;
  maxLevel: string;
  emoji: string | null;
  theme: ThemeSummary | null;
  chaptersCount: number;
  tutorName: string | null;
};

type CourseFilterProps = {
  themes: ThemeSummary[];
  courses: CourseSummary[];
};

export function CourseFilter({ themes, courses }: CourseFilterProps) {
  const [activeThemeId, setActiveThemeId] = useState<string | "all">("all");

  const filteredCourses = useMemo(() => {
    if (activeThemeId === "all") {
      return courses;
    }

    return courses.filter((course) => course.theme?.id === activeThemeId);
  }, [activeThemeId, courses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Themes</h2>
          <span className="text-xs text-muted-foreground">
            {filteredCourses.length} course
            {filteredCourses.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveThemeId("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              activeThemeId === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground hover:bg-muted",
            )}
          >
            All themes
          </button>
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setActiveThemeId(theme.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                activeThemeId === theme.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground hover:bg-muted",
              )}
            >
              <span className="mr-1" aria-hidden>
                {theme.emoji || "✨"}
              </span>
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No courses available for this theme.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group transition-transform hover:scale-105"
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="text-5xl"
                      role="img"
                      aria-label={course.title}
                    >
                      {course.emoji || "📚"}
                    </span>
                    <Badge variant="secondary">
                      {course.minLevel} - {course.maxLevel}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  {course.description && (
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.chaptersCount} chapters
                    </span>
                    {course.tutorName && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {course.tutorName}
                      </span>
                    )}
                  </div>
                  {course.theme && (
                    <Badge variant="outline" className="w-fit">
                      {course.theme.emoji || "✨"} {course.theme.name}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
