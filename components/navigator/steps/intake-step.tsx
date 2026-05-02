"use client";

import { Keyboard, Mic } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";
type IntakeMethod = "voice" | "type";

const options: { method: IntakeMethod; icon: typeof Mic }[] = [
  { method: "voice", icon: Mic },
  { method: "type", icon: Keyboard },
];

export function IntakeStep({
  strings,
  onPick,
}: {
  strings: Strings;
  onPick: (method: IntakeMethod) => void;
}) {
  const titles: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceTitle,
    type: strings.intake.typeTitle,
  };
  const descs: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceDesc,
    type: strings.intake.typeDesc,
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.intake.heading}
        </h1>
        <p className="text-muted-foreground">{strings.intake.subheading}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.method}
            onClick={() => onPick(opt.method)}
            className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
