"use client";

import { Keyboard, LayoutGrid, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Strings } from "@/lib/service-navigator/strings";
import type { LanguageCode } from "@/lib/service-navigator/types";

type IntakeMethod = "voice" | "type" | "categories";

const options: { method: IntakeMethod; icon: typeof Mic }[] = [
  { method: "voice", icon: Mic },
  { method: "type", icon: Keyboard },
  { method: "categories", icon: LayoutGrid },
];

const LANG_LABELS: Record<LanguageCode, string> = {
  en: "English",
  am: "አማርኛ",
  om: "Afaan Oromoo",
};

export function IntakeStep({
  strings,
  language,
  onLanguageChange,
  onPick,
}: {
  strings: Strings;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onPick: (method: IntakeMethod) => void;
}) {
  const titles: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceTitle,
    type: strings.intake.typeTitle,
    categories: strings.intake.browseTitle,
  };
  const descs: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceDesc,
    type: strings.intake.typeDesc,
    categories: strings.intake.browseDesc,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">
          {strings.landing.selectLanguage}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["en", "am", "om"] as LanguageCode[]).map((lang) => (
            <Button
              key={lang}
              type="button"
              variant={language === lang ? "default" : "outline"}
              onClick={() => onLanguageChange(lang)}
              className="h-11 rounded-xl px-3"
            >
              {LANG_LABELS[lang]}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.intake.heading}
        </h1>
        <p className="text-muted-foreground">{strings.intake.subheading}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.method}
            onClick={() => onPick(opt.method)}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
              <opt.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {titles[opt.method]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {descs[opt.method]}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
