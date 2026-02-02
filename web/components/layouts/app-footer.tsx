import Link from "next/link";
import { APP_CONFIG } from "@/config";

const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-6 sm:px-6 md:h-20 md:flex-row md:items-center md:justify-between md:py-0 lg:px-8">
        <p className="text-balance text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {APP_CONFIG.APP_NAME}. All rights
          reserved.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
