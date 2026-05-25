"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mic } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

export function TextInput({
  strings,
  value,
  onChange,
  onSubmit,
  onSwitchToVoice,
}: {
  strings: Strings;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSwitchToVoice: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
          <Sparkles className="h-8 w-8" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.case.heading}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">{strings.case.hint}</p>
      </div>

      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={strings.case.placeholder}
          autoFocus
          className="min-h-32 rounded-2xl text-base resize-none border-2 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300"
        />
        <p className="text-xs text-muted-foreground text-right">
          {value.length} characters
        </p>
      </div>

      {/* Quick examples */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {strings.case.examples}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {strings.case.exampleItems.map((example) => (
            <button
              key={example}
              onClick={() => onChange(example)}
              className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card px-4 py-3 text-left text-sm text-foreground transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  viewBox="0 0 400 100"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0,0 L 0,100 Q 150,65 400,90 L 400,0 Z"
                    className="fill-primary/10"
                  />
                </svg>
              </div>
              <span className="relative z-10">&ldquo;{example}&rdquo;</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={onSwitchToVoice}
          size="lg"
          className="group relative overflow-hidden rounded-2xl h-14 gap-3 border-2 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Mic className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
          <span className="relative z-10 font-semibold">{strings.intake.voiceTitle}</span>
        </Button>
        <Button
          onClick={onSubmit}
          disabled={value.trim().length < 3}
          size="lg"
          className="group relative overflow-hidden rounded-2xl h-14 gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 font-semibold">{strings.actions.continue}</span>
        </Button>
      </div>
    </div>
  );
}
