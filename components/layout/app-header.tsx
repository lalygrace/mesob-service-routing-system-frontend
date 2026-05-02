"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { FullscreenToggle } from "@/components/layout/fullscreen-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { getStrings } from "@/lib/service-navigator/strings";

const LANG_LABELS: Record<LanguageCode, string> = {
  en: "EN",
  am: "አማ",
  om: "OM",
};

export function AppHeader({
  language = "en",
  showHome = false,
  onLanguageChange,
}: {
  language?: LanguageCode;
  showHome?: boolean;
  onLanguageChange?: (lang: LanguageCode) => void;
}) {
  const strings = getStrings(language);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Left: Logo & Title */}
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-semibold leading-5 tracking-tight text-foreground truncate">
              {strings.appTitle}
            </p>
            <p className="text-xs leading-4 text-muted-foreground truncate">
              {strings.appSubtitle}
            </p>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher (compact) */}
          {onLanguageChange && (
            <div className="flex items-center rounded-full border border-border bg-background/50 p-0.5">
              {(["en", "am", "om"] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    language === lang
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={`Switch to ${lang}`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          )}

          <FullscreenToggle />

          {showHome && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              asChild
            >
              <Link href="/" aria-label={strings.header.home}>
                <Home className="h-4 w-4" />
              </Link>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
