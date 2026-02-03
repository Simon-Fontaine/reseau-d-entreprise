"use client";

import { ArrowLeft, Check, CheckCheck, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { markMessagesAsRead } from "@/actions/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

interface ChatAreaProps {
  courseId: string;
  currentUserId: string;
  recipientId: string;
  recipientName: string;
  initialMessages: Message[];
  onBack?: () => void;
}

export function ChatArea({
  courseId,
  currentUserId,
  recipientId,
  recipientName,
  initialMessages,
  onBack,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join_user_room", currentUserId);

    const onNewMessage = (msg: Message) => {
      if (msg.courseId !== courseId) return;
      const isRelevant =
        (msg.userId === currentUserId && msg.recipientId === recipientId) ||
        (msg.userId === recipientId && msg.recipientId === currentUserId);

      if (!isRelevant) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      if (msg.recipientId === currentUserId) {
        socket.emit("mark_messages_read", {
          messageIds: [msg.id],
          readerId: currentUserId,
          senderId: msg.userId,
        });

        markMessagesAsRead([msg.id]);
      }
    };

    const onMessagesRead = (data: {
      messageIds: string[];
      readerId: string;
      readAt: Date;
    }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (data.messageIds.includes(m.id)) {
            return { ...m, readAt: data.readAt };
          }
          return m;
        }),
      );
    };

    socket.on("new_message", onNewMessage);
    socket.on("messages_read", onMessagesRead);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("messages_read", onMessagesRead);
    };
  }, [courseId, currentUserId, recipientId]);

  useEffect(() => {
    const unreadIds = messages
      .filter((m) => m.recipientId === currentUserId && !m.readAt)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      setMessages((prev) =>
        prev.map((m) => {
          if (unreadIds.includes(m.id)) return { ...m, readAt: new Date() };
          return m;
        }),
      );

      socket.emit("mark_messages_read", {
        messageIds: unreadIds,
        readerId: currentUserId,
        senderId: recipientId,
      });
      markMessagesAsRead(unreadIds);
    }
  }, [currentUserId, recipientId, messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;

      socket.emit("send_message", {
        courseId,
        userId: currentUserId,
        recipientId,
        messageContent: inputValue,
      });

      setInputValue("");
    },
    [courseId, currentUserId, recipientId, inputValue],
  );

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-sm gap-0 py-0">
      <CardHeader className="py-3 px-4 border-b flex flex-row items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden -ml-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-sm font-medium">{recipientName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="space-y-4 flex flex-col">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-10">
                Start the conversation...
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.userId === currentUserId;
              const showAvatar =
                !isMe && (idx === 0 || messages[idx - 1].userId !== msg.userId);

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 max-w-[85%] md:max-w-[70%]",
                    isMe ? "self-end" : "self-start",
                  )}
                >
                  {!isMe && (
                    <div className="w-8 shrink-0">
                      {showAvatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {msg.user?.fullName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm shadow-sm",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-tl-none",
                    )}
                  >
                    <p className="mb-1 leading-relaxed">{msg.messageContent}</p>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 text-[10px]",
                        isMe ? "opacity-90" : "text-muted-foreground",
                      )}
                    >
                      <span>
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe && (
                        <span>
                          {msg.readAt ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} className="h-1" />
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-background mt-auto">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="rounded-full h-10 w-10"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
