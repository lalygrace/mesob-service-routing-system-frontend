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
    <div className="space-y-10 animate-fade-in-up">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.results.heading}
        </h1>
      </div>

      {/* User's query - Premium design */}
      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 px-6 py-4 shadow-sm">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">{strings.results.youSaid}</p>
        <p className="mt-2 text-base text-foreground font-medium leading-relaxed">&ldquo;{userText}&rdquo;</p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <SearchX className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-bold text-foreground">{strings.results.noResults}</p>
          <p className="text-sm text-muted-foreground max-w-md">{strings.results.noResultsHint}</p>
        </div>
      ) : (
        <motion.div
          className="grid gap-4 max-w-2xl mx-auto"
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(service.id)}
                className={cn(
                  "group flex items-center gap-5 rounded-3xl border-2 bg-card p-6 text-left transition-all duration-300 touch-target-lg",
                  isSelected
                    ? "border-primary bg-primary/8 shadow-xl shadow-primary/15 scale-[1.02]"
                    : "border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                )}
              >
                <div className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                  isSelected ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-primary/10 text-primary group-hover:scale-105",
                )}>
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-foreground">{service.title}</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{service.authority}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground/80 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {service.locationHint}
                  </p>
                </div>
                <ArrowRight className={cn(
                  "h-6 w-6 shrink-0 transition-all duration-300",
                  isSelected ? "text-primary translate-x-1" : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1",
                )} />
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
