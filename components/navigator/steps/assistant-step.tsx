"use client";

/**
 * AssistantStep
 *
 * Handles three AI response states:
 *  1. Error / failed — show friendly error + retry options
 *  2. Clarification — show AI question + option buttons (from backend or local)
 *  3. Loading — show spinner while AI is processing
 *
 * The clarification question and options can come from two sources:
 *  - `decision` (local Decision type, used as fallback)
 *  - `aiQuestion` + `aiOptions` (from the backend AI response)
 *
 * Per the proposal: clarification options are always shown as large tappable
 * buttons, never as a dropdown or list.
 */

import { AlertTriangle, Bot, HelpCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Decision } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export type AssistantError = {
  title: string;
  message: string;
};

export type AiClarifyOption = {
  label: string;
  value: string;
};

export function AssistantStep({
  strings,
  userText,
  decision,
  error,
  isLoading,
  aiQuestion,
  aiOptions,
  onPickClarification,
  onPickAiOption,
  onRetry,
  onStartOver,
  onSwitchToTyping,
}: {
  strings: Strings;
  userText: string;
  decision: Decision | null;
  error?: AssistantError | null;
  /** True while waiting for the AI response */
  isLoading?: boolean;
  /** Clarification question text returned by the backend AI */
  aiQuestion?: string | null;
  /** Clarification option buttons returned by the backend AI */
  aiOptions?: AiClarifyOption[] | null;
  onPickClarification: (serviceIds: string[]) => void;
  /** Called when the citizen picks one of the AI-generated option buttons */
  onPickAiOption?: (value: string) => void;
  onRetry: () => void;
  onStartOver: () => void;
  onSwitchToTyping?: () => void;
}) {
  // Prefer backend AI clarification over local Decision clarification
  const hasAiClarify =
    Boolean(aiQuestion) && aiOptions && aiOptions.length > 0;
  const hasLocalClarify =
    decision?.mode === "clarify" && Boolean(decision.clarify);

  return (
    <div className="space-y-6">
      {/* What the citizen said */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {strings.results.youSaid}
        </p>
        <p className="mt-1 text-sm text-foreground">
          &ldquo;{userText || strings.assistant.emptyInput}&rdquo;
        </p>
      </div>

      {/* State icon + heading */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
          {isLoading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : error ? (
            <AlertTriangle className="h-7 w-7" />
          ) : hasAiClarify || hasLocalClarify ? (
            <HelpCircle className="h-7 w-7" />
          ) : (
            <Bot className="h-7 w-7" />
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {isLoading
            ? "Analyzing your request…"
            : error
              ? error.title
              : hasAiClarify
                ? aiQuestion!
                : hasLocalClarify
                  ? decision!.clarify!.question
                  : strings.assistant.heading}
        </h1>

        <p className="text-muted-foreground">
          {isLoading
            ? "Please wait a moment."
            : error
              ? error.message
              : hasAiClarify || hasLocalClarify
                ? strings.assistant.pickOne
                : strings.assistant.subheading}
        </p>
      </div>

      {/* Option buttons */}
      {!isLoading && !error && hasAiClarify && aiOptions && onPickAiOption && (
        <div className="grid gap-5 sm:grid-cols-2">
          {aiOptions.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              onClick={() => onPickAiOption(option.value)}
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
      )}

      {!isLoading && !error && !hasAiClarify && hasLocalClarify && (
        <div className="grid gap-5 sm:grid-cols-2">
          {decision!.clarify!.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onPickClarification(option.serviceIds)}
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
      )}

      {/* Error / no-match action buttons */}
      {!isLoading && (error || (!hasAiClarify && !hasLocalClarify)) && (
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
