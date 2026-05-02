"use client";

import * as React from "react";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Strings } from "@/lib/service-navigator/strings";

export function FinishStep({
  strings,
  rating,
  onRatingChange,
  submitted,
  onSubmit,
  onStartOver,
}: {
  strings: Strings;
  rating: number;
  onRatingChange: (next: number) => void;
  submitted: boolean;
  onSubmit: () => void;
  onStartOver: () => void;
}) {
  const canSubmit = rating > 0;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-foreground">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {strings.feedbackForm.thankYou}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {strings.feedbackForm.thankYouDesc}
          </p>
        </div>
        <Button
          onClick={onStartOver}
          size="lg"
          className="rounded-xl h-12 px-8"
        >
          {strings.actions.startOver}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Thank you for using Mesob Center
        </h1>
        <p className="text-muted-foreground">
          {strings.feedbackForm.subheading}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground">
          {strings.feedbackForm.rating}
        </p>

        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            const active = starValue <= rating;
            return (
              <Button
                key={starValue}
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => onRatingChange(starValue)}
                aria-label={`${strings.feedbackForm.rating}: ${starValue}`}
              >
                <Star
                  className={active ? "text-primary" : "text-muted-foreground"}
                  fill={active ? "currentColor" : "none"}
                />
              </Button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!canSubmit}
        size="lg"
        className="w-full rounded-xl h-12"
      >
        {strings.feedbackForm.submit}
      </Button>

      <Button
        onClick={onStartOver}
        variant="outline"
        size="lg"
        className="w-full rounded-xl h-12"
      >
        {strings.actions.startOver}
      </Button>
    </div>
  );
}
