import {
  BarChart,
  BookOpen,
  GraduationCapIcon,
  MessageSquare,
  Palette,
  Settings,
  Users,
} from "lucide-react";
import type { MainNavItem, SidebarNavItem } from "@/types/nav";

export const APP_CONFIG = {
  APP_NAME: "Advanced Yapping Academy",
  APP_DESCRIPTION: "Your gateway to mastering advanced yapping skills.",
  APP_DOMAIN: "advancedyappingacademy.com",
  APP_URL: "https://advancedyappingacademy.com",
};

export const APP_LOGO = (props: React.SVGProps<SVGSVGElement>) => (
  <GraduationCapIcon {...props} />
);

export const APP_NAVIGATION = [
  {
    title: "Home",
    href: "/",
    disabled: false,
    external: false,
  },
  {
    title: "Courses",
    href: "/courses",
    disabled: false,
    external: false,
  },
  {
    title: "Teachers",
    href: "/teachers",
    disabled: false,
    external: false,
  },
  {
    title: "About",
    href: "/about",
    disabled: false,
    external: false,
  },
] as MainNavItem[];

export const DASHBOARD_NAVIGATION = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart,
    items: [],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    items: [],
  },
] as SidebarNavItem[];

export const STUDENT_DASHBOARD_NAVIGATION = [
  {
    title: "Overview",
    href: "/dashboard/student",
    icon: BarChart,
    items: [],
  },
  {
    title: "My Courses",
    href: "/dashboard/student/courses",
    icon: GraduationCapIcon,
    items: [],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    items: [],
  },
] as SidebarNavItem[];

export const TRAINER_DASHBOARD_NAVIGATION = [
  {
    title: "Overview",
    href: "/dashboard/trainer",
    icon: BarChart,
    items: [],
  },
  {
    title: "Manage Courses",
    href: "/dashboard/trainer/courses",
    icon: GraduationCapIcon,
    items: [],
  },
  {
    title: "Messages",
    href: "/dashboard/trainer/messages",
    icon: MessageSquare,
    items: [],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    items: [],
  },
] as SidebarNavItem[];

export const ADMIN_DASHBOARD_NAVIGATION = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: BarChart,
    items: [],
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    items: [],
  },
  {
    title: "Themes",
    href: "/dashboard/admin/themes",
    icon: Palette,
    items: [],
  },
  {
    title: "All Courses",
    href: "/dashboard/admin/courses",
    icon: BookOpen,
    items: [],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    items: [],
  },
] as SidebarNavItem[];
