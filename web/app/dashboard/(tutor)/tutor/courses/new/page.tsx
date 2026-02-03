import { createTutorCourse } from "@/actions/tutor-courses";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { TutorCourseForm } from "@/components/dashboard/tutor/course-form";
import { db } from "@/db/schema";

export default async function TutorNewCoursePage() {
  const themes = await db.query.themes.findMany();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Create Course"
        text="Set up the basic information for your new course."
      />
      <TutorCourseForm
        title="Course details"
        action={createTutorCourse}
        themes={themes}
        submitLabel="Create course"
      />
    </div>
  );
}
