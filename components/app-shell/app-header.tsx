import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-foreground">
            Mesob Service Navigator
          </p>
          <p className="text-xs leading-4 text-muted-foreground">
            Find the right government service in minutes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
