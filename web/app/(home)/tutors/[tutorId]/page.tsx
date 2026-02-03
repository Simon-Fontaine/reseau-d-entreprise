import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { courses, db, users } from "@/db/schema";

interface TutorPageProps {
  params: Promise<{
    tutorId: string;
  }>;
}

function formatHours(totalMinutes: number) {
  if (totalMinutes <= 0) {
    return "N/A";
  }

  const hours = totalMinutes / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs`;
}

export default async function TutorPage({ params }: TutorPageProps) {
  const { tutorId } = await params;

  const { success } = z.string().uuid().safeParse(tutorId);
  if (!success) {
    return notFound();
  }

  const tutor = await db.query.users.findFirst({
    where: eq(users.id, tutorId),
  });

  if (!tutor || tutor.role !== "tutor") {
    return notFound();
  }

  const tutorCourses = await db.query.courses.findMany({
    where: and(
      eq(courses.tutorId, tutorId),
      eq(courses.publishStatus, "published"),
    ),
    with: {
      theme: true,
      chapters: true,
    },
  });

  const totalMinutes = tutorCourses.reduce(
    (sum, course) => sum + (course.estimatedDuration ?? 0),
    0,
  );

  return (
    <Page>
      <PageHeader>
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
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
                <PageHeaderHeading>{tutor.fullName}</PageHeaderHeading>
                <PageHeaderDescription>
                  {tutor.bio ||
                    "Dedicated to creating welcoming and effective learning journeys."}
                </PageHeaderDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {tutorCourses.length} course
                {tutorCourses.length === 1 ? "" : "s"}
              </Badge>
              <Badge variant="secondary">{formatHours(totalMinutes)}</Badge>
            </div>
          </div>
        </Container>
      </PageHeader>

      <Container className="py-8 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {tutor.bio ||
                  "Focuses on confidence, practical conversation, and real-world use."}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Course Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {formatHours(totalMinutes)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on estimated course durations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Courses Taught</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{tutorCourses.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Explore the full list below.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Courses</h2>
          </div>
          <Separator />
          <div className="grid gap-6 sm:grid-cols-2">
            {tutorCourses.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                No courses published yet.
              </div>
            ) : (
              tutorCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex h-full transition-transform hover:scale-[1.01]"
                >
                  <Card className="flex min-h-[240px] w-full flex-col cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <Badge variant="secondary">
                          {course.minLevel} - {course.maxLevel}
                        </Badge>
                      </div>
                      {course.theme && (
                        <Badge variant="outline" className="w-fit">
                          {course.theme.emoji || "✨"} {course.theme.name}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto space-y-3">
                      <p className="min-h-[3.5rem] text-sm text-muted-foreground line-clamp-3">
                        {course.description || "No description available."}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {course.chapters.length} chapter
                        {course.chapters.length === 1 ? "" : "s"} ·{" "}
                        {formatHours(course.estimatedDuration ?? 0)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </Container>
    </Page>
  );
}
