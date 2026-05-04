"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {strings.case.heading}
        </h1>
        <p className="text-muted-foreground">{strings.case.hint}</p>
      </div>

      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={strings.case.placeholder}
          autoFocus
          className="min-h-28 rounded-xl text-base resize-none"
        />
      </div>

      {/* Quick examples */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {strings.case.examples}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {strings.case.exampleItems.map((example) => (
            <button
              key={example}
              onClick={() => onChange(example)}
              className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md px-4 py-3 text-left text-sm text-foreground transition-all hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              &ldquo;{example}&rdquo;
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="glass"
          onClick={onSwitchToVoice}
          size="lg"
          className="rounded-xl h-12"
        >
          {strings.intake.voiceTitle}
        </Button>
        <Button
          variant="glass"
          onClick={onSubmit}
          disabled={value.trim().length < 3}
          size="lg"
          className="rounded-xl h-12"
        >
          {strings.actions.continue}
        </Button>
      </div>
    </div>
  );
}
