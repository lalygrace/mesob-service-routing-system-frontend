"use client";

import { HelpCircle } from "lucide-react";
import type { Decision } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function ClarifyStep({
  strings,
  decision,
  onPick,
}: {
  strings: Strings;
  decision: Decision;
  onPick: (serviceIds: string[]) => void;
}) {
  if (decision.mode !== "clarify" || !decision.clarify) return null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {decision.clarify.question}
        </h1>
        <p className="text-muted-foreground">{strings.clarify.pickOne}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {decision.clarify.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onPick(option.serviceIds)}
            className="rounded-xl border border-border bg-card p-5 text-left font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
