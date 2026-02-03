import { and, eq, inArray } from "drizzle-orm";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { courses, db, users } from "@/db/schema";
import { TutorFilter } from "./tutor-filter";

export default async function TutorsPage() {
  const tutors = await db.query.users.findMany({
    where: eq(users.role, "tutor"),
  });

  const tutorIds = tutors.map((tutor) => tutor.id);

  const tutorCourses = tutorIds.length
    ? await db.query.courses.findMany({
        where: and(
          inArray(courses.tutorId, tutorIds),
          eq(courses.publishStatus, "published"),
        ),
      })
    : [];

  const availableThemes = await db.query.themes.findMany();

  const coursesByTutor = tutorCourses.reduce<
    Record<string, typeof tutorCourses>
  >((acc, course) => {
    if (!course.tutorId) {
      return acc;
    }

    acc[course.tutorId] ??= [];
    acc[course.tutorId].push(course);
    return acc;
  }, {});

  const themeLookup = new Map(
    availableThemes.map((theme) => [theme.id, theme]),
  );

  const themeOptions = availableThemes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    emoji: theme.emoji,
  }));

  const tutorCards = tutors.map((tutor) => {
    const tutorCourseList = coursesByTutor[tutor.id] ?? [];
    const totalMinutes = tutorCourseList.reduce(
      (sum, course) => sum + (course.estimatedDuration ?? 0),
      0,
    );
    const themeIds = Array.from(
      new Set(
        tutorCourseList
          .map((course) => course.themeId)
          .filter(Boolean) as string[],
      ),
    );

    return {
      id: tutor.id,
      fullName: tutor.fullName,
      bio: tutor.bio,
      coursesCount: tutorCourseList.length,
      totalMinutes,
      themes: themeIds
        .map((themeId) => themeLookup.get(themeId))
        .filter((theme): theme is NonNullable<typeof theme> => Boolean(theme))
        .map((theme) => ({
          id: theme.id,
          name: theme.name,
          emoji: theme.emoji,
        })),
    };
  });

  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>Meet Our Tutors</PageHeaderHeading>
          <PageHeaderDescription>
            Meet our language instructors and discover their teaching focus,
            favorite topics, and courses. Each tutor brings a unique approach to
            help learners build confidence and reach new milestones.
          </PageHeaderDescription>
        </Container>
      </PageHeader>

      <Container className="py-8">
        <TutorFilter themes={themeOptions} tutors={tutorCards} />
      </Container>
    </Page>
  );
}
