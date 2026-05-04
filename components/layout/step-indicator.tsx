"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 py-2">
      <div className="relative mb-8 mt-4">
        <Progress value={progressPercentage} className="h-1.5 sm:h-2" />
        
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-0">
          {steps.map((step, i) => {
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border-[3px] sm:border-4 border-background transition-transform duration-500",
                  isCompleted ? "bg-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary text-primary-foreground scale-110" : 
                  "bg-muted text-muted-foreground border-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={3} />
                ) : (
                  <span className="text-sm sm:text-base font-bold">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between w-full relative">
        {steps.map((step, i) => {
          const isCurrent = i === currentIndex;
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center"
              style={{ width: "max-content", transform: "translateX(-50%)", position: "absolute", left: `${(i / maxIndex) * 100}%` }}
            >
              <span
                className={cn(
                  "text-xs sm:text-sm font-semibold",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {isCurrent && (
                <Badge 
                  variant="outline" 
                  className="mt-2 px-2.5 py-0 h-5 text-[10px] sm:text-[11px] bg-primary/10 text-primary border-primary/25 uppercase tracking-widest"
                >
                  Active
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-10 sm:h-12 w-full"></div>
    </div>
  );
}
