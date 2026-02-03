"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  mobileView?: "list" | "chat";
}

export function ChatLayout({
  sidebar,
  children,
  className,
  mobileView = "list",
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row h-[calc(100vh-10rem)] gap-4",
        className,
      )}
    >
      <div
        className={cn(
          "w-full lg:w-80 shrink-0 flex-col h-full overflow-hidden",
          mobileView === "list" ? "flex" : "hidden lg:flex",
        )}
      >
        {sidebar}
      </div>
      <div
        className={cn(
          "flex-1 flex-col h-full overflow-hidden min-h-125",
          mobileView === "chat" ? "flex" : "hidden lg:flex",
        )}
      >
        {children}
      </div>
    </div>
  );
}
