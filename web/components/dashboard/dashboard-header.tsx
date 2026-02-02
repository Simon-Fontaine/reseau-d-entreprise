"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_CONFIG, APP_LOGO } from "@/config";
import { cn } from "@/lib/utils";
import { AuthButton } from "../auth-button";
import { ThemeSwitcher } from "../theme-switcher";
import { DashboardSidebar, type SidebarNavItem } from "./dashboard-sidebar";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  sidebarItems: SidebarNavItem[];
}

export function DashboardHeader({
  className,
  sidebarItems,
  children,
  ...props
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-background px-6",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 md:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] bg-background p-6">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Navigation Menu</DrawerTitle>
              <DrawerDescription>
                Access dashboard navigation links
              </DrawerDescription>
            </DrawerHeader>
            <div className="mb-6 flex items-center gap-2">
              <APP_LOGO className="size-6 text-primary" />
              <span className="font-bold">{APP_CONFIG.APP_NAME}</span>
            </div>
            <DashboardSidebar items={sidebarItems} />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden w-full md:flex md:items-center md:justify-between">
        {children}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
        <ThemeSwitcher />
        <AuthButton />
      </div>
    </header>
  );
}
