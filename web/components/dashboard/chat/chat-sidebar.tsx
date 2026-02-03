"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Conversation } from "./types";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  selectedCourseId?: string | null;
  onSelect: (id: string, courseId: string) => void;
  title?: string;
}

export function ChatSidebar({
  conversations,
  selectedId,
  selectedCourseId,
  onSelect,
  title = "Messages",
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-sm gap-0 py-0">
      <CardHeader className="py-3 px-4 border-b space-y-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9 bg-muted/50 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col p-2 gap-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No conversations found.
              </p>
            ) : (
              filtered.map((conv) => (
                <button
                  type="button"
                  key={`${conv.courseId}-${conv.id}`}
                  onClick={() => onSelect(conv.id, conv.courseId)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    selectedId === conv.id && selectedCourseId === conv.courseId
                      ? "bg-accent text-accent-foreground"
                      : "bg-transparent",
                  )}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{conv.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-medium text-sm truncate">
                        {conv.name}
                      </span>
                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.courseName}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="h-5 w-5 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground font-bold shrink-0 mt-2">
                      {conv.unreadCount}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
