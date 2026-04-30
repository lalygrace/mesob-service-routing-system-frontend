"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, SearchX, Sparkles, Star } from "lucide-react";
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
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-fit"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 blur-2xl"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-2xl">
              <Star className="h-10 w-10 text-white" strokeWidth={2.5} fill="white" />
            </div>
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
          {strings.results.heading}
        </h1>
      </div>

      {/* User's query with stunning design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-6 shadow-xl shadow-primary/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{strings.results.youSaid}</p>
          </div>
          <p className="text-xl text-foreground font-bold leading-relaxed">&ldquo;{userText}&rdquo;</p>
        </div>
      </motion.div>

      {candidates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-16 text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-muted/50 to-transparent blur-xl"
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
              <SearchX className="h-12 w-12 text-muted-foreground/50" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground mb-2">{strings.results.noResults}</p>
            <p className="text-base text-muted-foreground max-w-md">{strings.results.noResultsHint}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {candidates.map((c, i) => {
            const service = c.service;
            const isSelected = selectedId === service.id;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(service.id)}
                className={cn(
                  "group relative overflow-hidden flex items-center gap-6 rounded-3xl border-2 bg-card p-8 text-left transition-all duration-500 touch-target-lg",
                  isSelected
                    ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-2xl shadow-primary/20 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
                )}
              >
                {/* Animated gradient overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                )}
                
                {/* Animated glow */}
                {isSelected && (
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-xl"
                  />
                )}
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={cn(
                    "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 shadow-lg",
                    isSelected 
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/50 scale-110" 
                      : "bg-primary/10 text-primary group-hover:scale-105 group-hover:shadow-primary/30",
                  )}
                >
                  <MapPin className="h-9 w-9" strokeWidth={2.5} />
                </motion.div>
                
                <div className="relative min-w-0 flex-1">
                  <p className="text-2xl font-black text-foreground mb-2">{service.title}</p>
                  <p className="text-base font-bold text-muted-foreground mb-2">{service.authority}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{service.locationHint}</span>
                  </div>
                </div>
                
                <motion.div
                  animate={{ x: isSelected ? [0, 5, 0] : 0 }}
                  transition={{ duration: 1, repeat: isSelected ? Infinity : 0, ease: "easeInOut" }}
                >
                  <ArrowRight className={cn(
                    "h-8 w-8 shrink-0 transition-all duration-500",
                    isSelected ? "text-primary scale-125" : "text-muted-foreground/30 group-hover:text-primary group-hover:scale-110",
                  )} strokeWidth={2.5} />
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
