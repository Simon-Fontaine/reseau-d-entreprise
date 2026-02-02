import { AuthButton } from "../auth-button";
import { ThemeSwitcher } from "../theme-switcher";
import { AppDesktopNav } from "./navigation/app-desktop-nav";
import { AppMobileNav } from "./navigation/app-mobile-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        <AppDesktopNav />
        <AppMobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-0.5">
            <ThemeSwitcher />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
