import { notFound } from "next/navigation";
import { getStudentConversations } from "@/actions/chat";
import { auth } from "@/auth";
import { StudentMessagesClient } from "./client";

export default async function StudentMessagesPage() {
  const session = await auth();
  const studentId = session?.user?.id;
  if (!studentId) return notFound();

  const conversations = await getStudentConversations(studentId);

  return (
    <StudentMessagesClient
      studentId={studentId}
      initialConversations={conversations}
    />
  );
}
