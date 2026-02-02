"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { APP_CONFIG, APP_LOGO, APP_NAVIGATION } from "@/config";
import { cn } from "@/lib/utils";

export function AppDesktopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="hidden md:flex md:items-center">
      <Link href="/" className="mr-6 flex items-center gap-2 lg:mr-8">
        <APP_LOGO className="size-6 text-primary" />
        <span className="hidden font-bold lg:inline-block">
          {APP_CONFIG.APP_NAME}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium xl:gap-6">
        {session?.user ? (
          <Link
            href="/dashboard"
            className={cn(
              "group flex items-center gap-1 transition-colors hover:text-primary",
              pathname.startsWith("/dashboard")
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <span>Dashboard</span>
          </Link>
        ) : null}
        {APP_NAVIGATION.map((item) =>
          item.href && !item.disabled ? (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group flex items-center gap-1 transition-colors hover:text-primary",
                pathname.endsWith(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              target={item.external ? "_blank" : undefined}
              aria-label={item.title}
            >
              {item.icon ? (
                <item.icon className="size-4" aria-hidden="true" />
              ) : null}
              <span>{item.title}</span>
              {item.external ? (
                <ExternalLinkIcon className="size-3 opacity-50 transition-opacity group-hover:opacity-100" />
              ) : null}
            </Link>
          ) : null,
        )}
      </nav>
    </div>
  );
}
