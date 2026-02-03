import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/schema";

export default async function CoursesPage() {
  const courses = await db.query.courses.findMany({
    with: {
      theme: true,
      tutor: true,
      chapters: true,
    },
  });

  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>Our Language Courses</PageHeaderHeading>
          <PageHeaderDescription>
            Choose from our selection of language courses and start your
            learning journey today. All our courses are designed to guide you
            from beginner to advanced level.
          </PageHeaderDescription>
        </Container>
      </PageHeader>

      <Container className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No courses available at the moment.
            </div>
          ) : (
            courses.map((course) => (
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
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.chapters.length} chapters
                      </span>
                      {course.tutor && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {course.tutor.fullName}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </Container>
    </Page>
  );
}
