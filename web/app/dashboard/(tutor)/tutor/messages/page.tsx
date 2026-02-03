import { notFound } from "next/navigation";
import { getTutorConversations } from "@/actions/chat";
import { auth } from "@/auth";
import { TutorMessagesClient } from "./client";

export default async function TutorMessagesPage() {
  const session = await auth();
  const tutorId = session?.user?.id;
  if (!tutorId) return notFound();

  const conversations = await getTutorConversations(tutorId);

  return (
    <TutorMessagesClient
      tutorId={tutorId}
      initialConversations={conversations}
    />
  );
}
