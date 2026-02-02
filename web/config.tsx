import { GraduationCapIcon } from "lucide-react";
import type { AppNavigationItem } from "@/types/config";

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
] as AppNavigationItem[];
