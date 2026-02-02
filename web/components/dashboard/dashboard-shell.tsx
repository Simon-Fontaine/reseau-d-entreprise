import Link from "next/link";
import { APP_CONFIG, APP_LOGO } from "@/config";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar, type SidebarNavItem } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarItems: SidebarNavItem[];
  className?: string;
}

export function DashboardShell({
  children,
  sidebarItems,
  className,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <div className="hidden border-r bg-background md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <APP_LOGO className="size-6 text-primary" />
            <span className="">{APP_CONFIG.APP_NAME}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 px-4">
          <DashboardSidebar items={sidebarItems} />
        </div>
      </div>
      <div className="flex flex-col md:pl-64">
        <DashboardHeader sidebarItems={sidebarItems} />
        <main className={cn("flex-1 p-4 md:p-6 lg:p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
