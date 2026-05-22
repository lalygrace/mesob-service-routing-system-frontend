"use client";

import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.landing.selectLanguage}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          {strings.appSubtitle}
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
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
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 hover:shadow-2xl hover:scale-[1.02]",
                  isSelected
                    ? "border-primary shadow-xl shadow-primary/20"
                    : "border-border/50 hover:border-primary/40 shadow-lg"
                )}
              >
                <div className="relative h-full min-h-[240px] p-8 flex flex-col">
                  {/* Decorative blue curved shape */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                    )}
                  >
                    <svg
                      viewBox="0 0 400 300"
                      className="absolute inset-0 w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0,0 L 0,300 Q 150,200 400,280 L 400,0 Z"
                        className="fill-primary/15"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top row: Icon and Badge */}
                    <div className="flex items-start justify-between mb-auto">
                      <div
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-3xl transition-all duration-300",
                          isSelected
                            ? "bg-primary/20 text-primary"
                            : "bg-primary/10 text-primary/70 group-hover:bg-primary/15 group-hover:text-primary"
                        )}
                      >
                        <Icon className="h-8 w-8" strokeWidth={2} />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold tracking-wider transition-colors",
                          isSelected
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                        )}
                      >
                        {label.secondary}
                      </Badge>
                    </div>

                    {/* Bottom: Title and description */}
                    <div className="space-y-2 mt-6">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {label.primary}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        Select {label.primary}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
