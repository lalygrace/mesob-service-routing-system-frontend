"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepDef = {
  id: string;
  label: string;
};

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: StepDef[];
  currentIndex: number;
}) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-center gap-1 sm:gap-2">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <li key={step.id} className="flex items-center gap-1 sm:gap-2">
              {/* Dot */}
              <div className="relative flex items-center justify-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 sm:w-8 rounded-full",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Current step label */}
      <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
        {steps[currentIndex]?.label}
      </p>
    </nav>
  );
}
