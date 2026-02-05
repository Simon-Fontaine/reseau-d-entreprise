"use client";

import { useEffect, useState } from "react";
import { getChatMessages } from "@/actions/chat";
import { ChatArea } from "@/components/dashboard/chat/chat-area";
import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { ChatSidebar } from "@/components/dashboard/chat/chat-sidebar";
import type { Conversation, Message } from "@/components/dashboard/chat/types";
import { socket } from "@/lib/socket";

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

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join_user_room", tutorId);

    const onNewMessage = (msg: Message) => {
      setConversations((prev) => {
        const convIndex = prev.findIndex(
          (c) =>
            c.courseId === msg.courseId &&
            c.id === (msg.userId === tutorId ? msg.recipientId : msg.userId),
        );

        if (convIndex === -1) return prev;

        const updatedConv = { ...prev[convIndex] };
        updatedConv.lastMessage = msg.messageContent;
        updatedConv.lastMessageAt = new Date(msg.sentAt);

        // Update unread count if it's an incoming message and not the currently selected conversation
        if (msg.userId !== tutorId) {
          const isCurrentChat =
            selectedConv?.id === msg.userId &&
            selectedConv?.courseId === msg.courseId;
          if (!isCurrentChat) {
            updatedConv.unreadCount += 1;
          }
        }

        const newConversations = [...prev];
        newConversations[convIndex] = updatedConv;

        // Sort by last message time
        return newConversations.sort((a, b) => {
          const timeA = a.lastMessageAt
            ? new Date(a.lastMessageAt).getTime()
            : 0;
          const timeB = b.lastMessageAt
            ? new Date(b.lastMessageAt).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [tutorId, selectedConv]);

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
