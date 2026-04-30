"use client";

import { AlertTriangle, Bot, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Decision } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export type AssistantError = {
  title: string;
  message: string;
};

export function AssistantStep({
  strings,
  userText,
  decision,
  error,
  onPickClarification,
  onRetry,
  onStartOver,
  onSwitchToTyping,
}: {
  strings: Strings;
  userText: string;
  decision: Decision | null;
  error?: AssistantError | null;
  onPickClarification: (serviceIds: string[]) => void;
  onRetry: () => void;
  onStartOver: () => void;
  onSwitchToTyping?: () => void;
}) {
  const hasClarify = decision?.mode === "clarify" && Boolean(decision.clarify);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
          {error ? (
            <AlertTriangle className="h-7 w-7" />
          ) : hasClarify ? (
            <HelpCircle className="h-7 w-7" />
          ) : (
            <Bot className="h-7 w-7" />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {error
            ? error.title
            : hasClarify
              ? decision!.clarify!.question
              : strings.assistant.heading}
        </h1>
        <p className="text-muted-foreground">
          {error
            ? error.message
            : hasClarify
              ? strings.assistant.pickOne
              : strings.assistant.subheading}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {strings.results.youSaid}
        </p>
        <p className="mt-1 text-sm text-foreground">
          &ldquo;{userText || strings.assistant.emptyInput}&rdquo;
        </p>
      </div>

      {hasClarify ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {decision!.clarify!.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onPickClarification(option.serviceIds)}
              className="rounded-xl border border-border bg-card p-5 text-left font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button onClick={onRetry} size="lg" className="rounded-xl h-12 gap-2">
            <RotateCcw className="h-4 w-4" />
            {strings.actions.tryAgain}
          </Button>

          {onSwitchToTyping ? (
            <Button
              variant="outline"
              onClick={onSwitchToTyping}
              size="lg"
              className="rounded-xl h-12"
            >
              {strings.voice.typeInstead}
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <Button
            variant="outline"
            onClick={onStartOver}
            size="lg"
            className="rounded-xl h-12"
          >
            {strings.actions.startOver}
          </Button>
        </div>
      )}
    </div>
  );
}
