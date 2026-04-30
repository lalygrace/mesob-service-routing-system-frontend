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
  onContinue,
}: {
  strings: Strings;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.language.heading}
        </h1>
        <p className="text-muted-foreground">{strings.language.subheading}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">
          {strings.language.selectLabel}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["en", "am", "om"] as LanguageCode[]).map((lang) => {
            const label = LANG_LABELS[lang];
            return (
              <Button
                key={lang}
                type="button"
                variant={language === lang ? "default" : "outline"}
                onClick={() => onLanguageChange(lang)}
                className="h-12 rounded-xl px-3"
              >
                <span className="font-semibold">{label.primary}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {label.secondary}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <Button onClick={onContinue} size="lg" className="w-full rounded-xl h-12">
        {strings.actions.continue}
      </Button>
    </div>
  );
}
