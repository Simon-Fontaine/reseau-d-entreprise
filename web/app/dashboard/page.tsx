import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "trainer") {
    redirect("/dashboard/trainer");
  } else {
    redirect("/dashboard/student");
  }
}
