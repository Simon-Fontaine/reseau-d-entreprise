"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ADMIN_DASHBOARD_NAVIGATION,
  STUDENT_DASHBOARD_NAVIGATION,
  TUTOR_DASHBOARD_NAVIGATION,
} from "@/config";
import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "@/types/nav";

interface DashboardSidebarProps {
  className?: string;
  role?: string;
  onLinkClick?: () => void;
}

export function DashboardSidebar({
  className,
  role = "student",
  onLinkClick,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isActive = (href?: string | null, exact = false) => {
    if (!href || !pathname) {
      return false;
    }
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  let items: SidebarNavItem[] = STUDENT_DASHBOARD_NAVIGATION;
  if (role === "admin") {
    items = ADMIN_DASHBOARD_NAVIGATION;
  } else if (role === "tutor") {
    items = TUTOR_DASHBOARD_NAVIGATION;
  }

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {items.map((item) => {
        return (
          <div key={item.href ?? item.title}>
            {item.href ? (
              <Button
                asChild
                variant={
                  isActive(item.href, item.title === "Overview")
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Link
                  href={item.disabled ? "/" : item.href}
                  className={cn(
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                  onClick={onLinkClick}
                >
                  {item.icon ? (
                    <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : null}
                  <span>{item.title}</span>
                </Link>
              </Button>
            ) : (
              <h4 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {item.title}
              </h4>
            )}

            {item.items?.length ? (
              <DashboardSidebarNamespace
                items={item.items}
                isActive={isActive}
                onLinkClick={onLinkClick}
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function DashboardSidebarNamespace({
  items,
  isActive,
  onLinkClick,
}: {
  items: SidebarNavItem[];
  isActive: (href?: string | null) => boolean;
  onLinkClick?: () => void;
}) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => (
        <Button
          key={item.href ?? item.title}
          asChild
          variant={isActive(item.href) ? "secondary" : "ghost"}
          className="w-full justify-start pl-8"
        >
          <Link
            href={item.disabled ? "/" : (item.href ?? "#")}
            className={cn(item.disabled && "cursor-not-allowed opacity-60")}
            onClick={onLinkClick}
          >
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
}
