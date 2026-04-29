"use client";

import { motion } from "framer-motion";
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
                <motion.div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </motion.div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="h-0.5 w-4 sm:w-8 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Current step label */}
      <motion.p
        key={steps[currentIndex]?.label}
        className="mt-2 text-center text-xs font-medium text-muted-foreground"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {steps[currentIndex]?.label}
      </motion.p>
    </nav>
  );
}
