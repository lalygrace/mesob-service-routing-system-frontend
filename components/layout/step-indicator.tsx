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
  const maxIndex = steps.length > 1 ? steps.length - 1 : 1;
  const progressPercentage = (currentIndex / maxIndex) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      {/* Thin Progress Bar with Steps */}
      <div className="relative">
        {/* Background Track */}
        <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
          {/* Animated Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between">
          {steps.map((step, i) => {
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center"
                style={{ marginLeft: i === 0 ? 0 : undefined, marginRight: i === steps.length - 1 ? 0 : undefined }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : isCurrent
                        ? "bg-primary border-primary text-primary-foreground scale-125 shadow-lg"
                        : "bg-background border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                    isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer for labels */}
      <div className="h-8" />
    </div>
  );
}
