import { eq } from "drizzle-orm";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { courses, db } from "@/db/schema";
import { CourseFilter } from "./course-filter";

export default async function CoursesPage() {
  const courseList = await db.query.courses.findMany({
    where: eq(courses.publishStatus, "published"),
    with: {
      theme: true,
      tutor: true,
      chapters: true,
    },
  });

  const themes = await db.query.themes.findMany();

  const courseCards = courseList.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    minLevel: course.minLevel,
    maxLevel: course.maxLevel,
    emoji: course.emoji,
    publishedAt: course.publishedAt,
    updatedAt: course.updatedAt,
    theme: course.theme
      ? {
          id: course.theme.id,
          name: course.theme.name,
          emoji: course.theme.emoji,
        }
      : null,
    chaptersCount: course.chapters.length,
    tutorName: course.tutor?.fullName ?? null,
  }));

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
        <CourseFilter themes={themes} courses={courseCards} />
      </Container>
    </Page>
  );
}
