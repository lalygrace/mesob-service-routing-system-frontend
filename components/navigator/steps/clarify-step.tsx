"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import type { Decision } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function ClarifyStep({
  strings, decision, onPick,
}: {
  strings: Strings; decision: Decision; onPick: (serviceIds: string[]) => void;
}) {
  if (decision.mode !== "clarify" || !decision.clarify) return null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {decision.clarify.question}
        </h1>
        <p className="text-muted-foreground">{strings.clarify.pickOne}</p>
      </div>

      <motion.div
        className="grid gap-3 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {decision.clarify.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(option.serviceIds)}
            className="rounded-2xl border border-border bg-card p-5 text-left font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
          >
            {option.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
