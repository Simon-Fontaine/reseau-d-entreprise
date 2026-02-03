import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, enrollments } from "@/db/schema";

export default async function StudentDashboardPage() {
  const session = await auth();
  const studentId = session?.user?.id;

  const enrollmentCount = studentId
    ? await db
        .select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(eq(enrollments.userId, studentId))
    : [];

  const totalEnrollments = enrollmentCount?.[0]?.count ?? 0;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Student Dashboard"
        text="Welcome to your learning dashboard."
      >
        <Button asChild>
          <Link href="/dashboard/student/courses">View courses</Link>
        </Button>
      </DashboardPageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Learning snapshot</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          You are currently enrolled in {totalEnrollments} course
          {totalEnrollments === 1 ? "" : "s"}.
        </CardContent>
      </Card>
    </div>
  );
}
