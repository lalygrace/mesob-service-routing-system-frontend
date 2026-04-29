"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Strings } from "@/lib/service-navigator/strings";

export function TextInput({
  strings, value, onChange, onSubmit,
}: {
  strings: Strings; value: string; onChange: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.problem.heading}
        </h1>
        <p className="text-muted-foreground">{strings.problem.hint}</p>
      </div>

      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={strings.problem.placeholder}
          autoFocus
          className="min-h-28 rounded-xl text-base resize-none"
        />
      </div>

      {/* Quick examples */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{strings.problem.examples}</p>
        <motion.div
          className="grid gap-2 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {strings.problem.exampleItems.map((example) => (
            <button
              key={example}
              onClick={() => onChange(example)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
            >
              &ldquo;{example}&rdquo;
            </button>
          ))}
        </motion.div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={value.trim().length < 3}
        size="lg"
        className="w-full rounded-xl h-12"
      >
        {strings.actions.continue}
      </Button>
    </div>
  );
}
