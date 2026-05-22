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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="h-8 w-8" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {decision.clarify.question}
        </h1>
        <p className="text-base text-muted-foreground">{strings.clarify.pickOne}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {decision.clarify.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onPick(option.serviceIds)}
            className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-card p-6 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.02] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px]"
          >
            {/* Decorative blue curved shape */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                viewBox="0 0 400 200"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 0,200 Q 150,130 400,180 L 400,0 Z"
                  className="fill-primary/15"
                />
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-lg font-bold text-foreground leading-tight">
                {option.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
