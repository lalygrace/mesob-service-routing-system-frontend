"use client";

import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, Languages, MessageCircle } from "lucide-react";

const LANG_LABELS: Record<
  LanguageCode,
  { primary: string; secondary: string; icon: React.ElementType }
> = {
  en: { primary: "English", secondary: "EN", icon: Globe },
  am: { primary: "አማርኛ", secondary: "አማ", icon: Languages },
  om: { primary: "Afaan Oromoo", secondary: "OM", icon: MessageCircle },
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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.landing.selectLanguage}
        </h1>
        <p className="text-lg text-muted-foreground">{strings.appSubtitle}</p>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          {(["en", "am", "om"] as LanguageCode[]).map((lang) => {
            const label = LANG_LABELS[lang];
            const Icon = label.icon;
            const isSelected = language === lang;

            return (
              <Card
                key={lang}
                role="button"
                tabIndex={0}
                onClick={() => onLanguageChange(lang)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onLanguageChange(lang);
                  }
                }}
                className={cn(
                  "group cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30",
                  isSelected && "border-primary bg-primary/5 ring-1 ring-primary"
                )}
              >
                <CardContent className="flex flex-col items-start gap-4 sm:gap-5 p-6 sm:p-8 text-left">
                  <div className="flex w-full items-start justify-between">
                    <div className={cn(
                      "flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20",
                      isSelected 
                        ? "border-primary/20 bg-primary/10 text-primary" 
                        : "border-border bg-background text-muted-foreground"
                    )}>
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <span className={cn(
                      "rounded-full border px-3 py-1 text-xs font-bold tracking-wider mt-1",
                      isSelected
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                    )}>
                      {label.secondary}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 mt-2">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                      {label.primary}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Select {label.primary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
