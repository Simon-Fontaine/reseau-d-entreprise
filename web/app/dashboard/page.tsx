import { Activity, BarChart, Book } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarNavItem } from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/button";

const dashboardNav: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <BarChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Lessons",
    href: "/dashboard/lessons",
    icon: <Book className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Activity className="mr-2 h-4 w-4" />,
  },
];

export default async function DashboardPage() {
  return (
    <DashboardShell sidebarItems={dashboardNav}>
      <DashboardPageHeader
        heading="Dashboard"
        text="Overview of your activity."
      >
        <Button>Lessons</Button>
      </DashboardPageHeader>
    </DashboardShell>
  );
}
