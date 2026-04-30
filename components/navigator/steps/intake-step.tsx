"use client";

import { ChevronRight, Keyboard, LayoutGrid, Mic } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

type IntakeMethod = "voice" | "type" | "categories";

const options: { method: IntakeMethod; icon: typeof Mic }[] = [
  { method: "voice", icon: Mic },
  { method: "type", icon: Keyboard },
  { method: "categories", icon: LayoutGrid },
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
    categories: strings.intake.browseTitle,
  };
  const descs: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceDesc,
    type: strings.intake.typeDesc,
    categories: strings.intake.browseDesc,
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.intake.heading}
        </h1>
        <p className="text-muted-foreground">{strings.intake.subheading}</p>
      </div>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.method}
            onClick={() => onPick(opt.method)}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
              <opt.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">
                {titles[opt.method]}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {descs[opt.method]}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
