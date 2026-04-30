"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Languages, Mic, Route } from "lucide-react";
import { getStrings } from "@/lib/service-navigator/strings";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "en", label: "English", native: "English" },
  { code: "om", label: "Afaan Oromo", native: "Afaan Oromoo" },
];

export default function LandingPage() {
  const router = useRouter();
  const strings = getStrings("en");

  function handleLanguageSelect(code: LanguageCode) {
    router.push(`/navigate?lang=${code}`);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
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
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-6">
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-xl sm:text-2xl">
              {strings.landing.headline}
            </CardTitle>
            <CardDescription className="max-w-prose mx-auto">
              {strings.landing.subheadline}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Languages className="h-4 w-4" />
              <span>{strings.landing.selectLanguage}</span>
            </div>

            <div className="flex flex-wrap items-stretch justify-center gap-2">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="h-12 px-4 rounded-xl"
                >
                  <span className="font-medium">{lang.native}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">
                    {lang.label}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </div>

            <Separator />

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {strings.landing.featureVoice}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Route className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {strings.landing.featureGuide}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {strings.landing.featureLanguage}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Select a language to start.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
