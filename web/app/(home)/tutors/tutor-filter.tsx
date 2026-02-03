"use client";

import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ThemeSummary = {
  id: string;
  name: string;
  emoji: string | null;
};

type TutorSummary = {
  id: string;
  fullName: string;
  bio: string | null;
  coursesCount: number;
  totalMinutes: number;
  themes: ThemeSummary[];
};

type TutorFilterProps = {
  themes: ThemeSummary[];
  tutors: TutorSummary[];
};

function formatHours(totalMinutes: number) {
  if (totalMinutes <= 0) {
    return "N/A";
  }

  const hours = totalMinutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
}

export function TutorFilter({ themes, tutors }: TutorFilterProps) {
  const [activeThemeId, setActiveThemeId] = useState<string | "all">("all");

  const filteredTutors = useMemo(() => {
    if (activeThemeId === "all") {
      return tutors;
    }

    return tutors.filter((tutor) =>
      tutor.themes.some((theme) => theme.id === activeThemeId),
    );
  }, [activeThemeId, tutors]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Themes</h2>
          <span className="text-xs text-muted-foreground">
            {filteredTutors.length} tutor
            {filteredTutors.length === 1 ? "" : "s"}
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
        {filteredTutors.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No tutors available for this theme.
          </div>
        ) : (
          filteredTutors.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutors/${tutor.id}`}
              className="group flex h-full transition-transform hover:scale-105"
            >
              <Card className="flex min-h-[340px] w-full flex-col cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(
                            tutor.fullName,
                          )}`}
                          alt={`Avatar of ${tutor.fullName}`}
                        />
                        <AvatarFallback>
                          {tutor.fullName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {tutor.fullName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Language Tutor
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {tutor.coursesCount} course
                      {tutor.coursesCount === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <p className="min-h-[3.75rem] text-sm text-muted-foreground line-clamp-3">
                    {tutor.bio ||
                      "Passionate about helping learners grow their language confidence."}
                  </p>
                  {tutor.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tutor.themes.slice(0, 3).map((theme) => (
                        <Badge key={theme.id} variant="secondary">
                          {theme.emoji || "✨"} {theme.name}
                        </Badge>
                      ))}
                      {tutor.themes.length > 3 && (
                        <Badge variant="outline">
                          +{tutor.themes.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {tutor.coursesCount} course
                      {tutor.coursesCount === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatHours(tutor.totalMinutes)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
