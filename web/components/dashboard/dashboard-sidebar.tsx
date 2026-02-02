"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  href?: string;
  icon?: React.ReactNode;
  items?: SidebarNavItem[];
};

interface DashboardSidebarProps {
  items: SidebarNavItem[];
  className?: string;
}

export function DashboardSidebar({ items, className }: DashboardSidebarProps) {
  const pathname = usePathname();

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
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link
                  href={item.disabled ? "/" : item.href}
                  className={cn(
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.icon}
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
                pathname={pathname}
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
  pathname,
}: {
  items: SidebarNavItem[];
  pathname: string | null;
}) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => (
        <Button
          key={item.href ?? item.title}
          asChild
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="w-full justify-start pl-8"
        >
          <Link
            href={item.disabled ? "/" : (item.href ?? "#")}
            className={cn(item.disabled && "cursor-not-allowed opacity-60")}
          >
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
}
