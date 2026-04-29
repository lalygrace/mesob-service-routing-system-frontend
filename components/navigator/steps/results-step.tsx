"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchCandidate } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function ResultsStep({
  strings, candidates, userText, selectedId, onSelect,
}: {
  strings: Strings; candidates: MatchCandidate[]; userText: string;
  selectedId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.results.heading}
        </h1>
      </div>

      {/* User's query */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{strings.results.youSaid}</p>
        <p className="mt-1 text-sm text-foreground">&ldquo;{userText}&rdquo;</p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/50" />
          <p className="font-semibold text-foreground">{strings.results.noResults}</p>
          <p className="text-sm text-muted-foreground">{strings.results.noResultsHint}</p>
        </div>
      ) : (
        <motion.div
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {candidates.map((c, i) => {
            const service = c.service;
            const isSelected = selectedId === service.id;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(service.id)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border-2 bg-card p-5 text-left transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border hover:border-primary/30 hover:shadow-md",
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                )}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{service.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{service.authority}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{service.locationHint}</p>
                </div>
                <ArrowRight className={cn(
                  "h-5 w-5 shrink-0 transition-all",
                  isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary",
                )} />
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
