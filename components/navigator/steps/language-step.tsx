"use client";

import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";
import { Button } from "@/components/ui/button";

const LANG_LABELS: Record<
  LanguageCode,
  { primary: string; secondary: string }
> = {
  en: { primary: "English", secondary: "EN" },
  am: { primary: "አማርኛ", secondary: "አማ" },
  om: { primary: "Afaan Oromoo", secondary: "OM" },
};

export function LanguageStep({
  strings,
  language,
  onLanguageChange,
}: {
  strings: Strings;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.landing.selectLanguage}
        </h1>
        <p className="text-muted-foreground">{strings.appSubtitle}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">
          {strings.landing.selectLanguage}
        </p>
        <div className="mt-4 grid gap-3">
          {(["en", "am", "om"] as LanguageCode[]).map((lang) => {
            const label = LANG_LABELS[lang];
            return (
              <Button
                key={lang}
                type="button"
                variant={language === lang ? "default" : "outline"}
                onClick={() => onLanguageChange(lang)}
                className="h-20 justify-between rounded-2xl px-5 text-left"
              >
                <span className="text-xl font-semibold">{label.primary}</span>
                <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                  {label.secondary}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
