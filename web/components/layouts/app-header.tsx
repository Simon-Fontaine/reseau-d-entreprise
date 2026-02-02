import { AuthButton } from "../auth-button";
import { ThemeSwitcher } from "../theme-switcher";
import { AppDesktopNav } from "./navigation/app-desktop-nav";
import { AppMobileNav } from "./navigation/app-mobile-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 md:px-4 md:pt-6">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-border bg-muted/50 px-4 shadow-md backdrop-blur-md md:px-6">
        <div className="flex items-center gap-6">
          <AppDesktopNav />
          <AppMobileNav />
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2">
            <ThemeSwitcher />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
