"use client";

import { useState } from "react";
import { getChatMessages } from "@/actions/chat";
import { ChatArea } from "@/components/dashboard/chat/chat-area";
import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { ChatSidebar } from "@/components/dashboard/chat/chat-sidebar";
import type { Conversation, Message } from "@/components/dashboard/chat/types";

interface TutorMessagesClientProps {
  tutorId: string;
  initialConversations: Conversation[];
}

export function TutorMessagesClient({
  tutorId,
  initialConversations,
}: TutorMessagesClientProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSelect = async (studentId: string, courseId: string) => {
    const conv = conversations.find(
      (c) => c.id === studentId && c.courseId === courseId,
    );
    if (!conv) return;

    setSelectedConv(conv);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === studentId && c.courseId === courseId
          ? { ...c, unreadCount: 0 }
          : c,
      ),
    );

    const msgs = await getChatMessages(courseId, tutorId, studentId);
    setMessages(msgs);
  };

  return (
    <ChatLayout
      mobileView={selectedConv ? "chat" : "list"}
      sidebar={
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedConv?.id || null}
          selectedCourseId={selectedConv?.courseId || null}
          onSelect={handleSelect}
          title="Students"
        />
      }
    >
      {selectedConv ? (
        <ChatArea
          key={`${selectedConv.courseId}-${selectedConv.id}`}
          courseId={selectedConv.courseId}
          currentUserId={tutorId}
          recipientId={selectedConv.id}
          recipientName={selectedConv.name}
          initialMessages={messages}
          onBack={() => setSelectedConv(null)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground bg-muted/30 dark:bg-muted/20 rounded-xl">
          Select a student to start chatting
        </div>
      )}
    </ChatLayout>
  );
}
