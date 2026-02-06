import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "tutor") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
