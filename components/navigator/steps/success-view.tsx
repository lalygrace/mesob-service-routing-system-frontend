"use client";

import { motion } from "framer-motion";
import { Check, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function SuccessView({
  strings, service, checkedCount, totalCount, onFeedback, onStartOver,
}: {
  strings: Strings; service: Service | null; checkedCount: number;
  totalCount: number; onFeedback: () => void; onStartOver: () => void;
}) {
  if (!service) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
        <p className="font-semibold text-foreground">{strings.noServiceSelected}</p>
        <p className="text-sm text-muted-foreground">{strings.noServiceSelectedDesc}</p>
      </div>
    );
  }

  const isFullyReady = checkedCount === totalCount;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      {/* Animated Check */}
      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute h-32 w-32 rounded-full bg-emerald-500/10"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="absolute h-24 w-24 rounded-full bg-emerald-500/20"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
        >
          <Check className="h-8 w-8" strokeWidth={3} />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.success.heading}
        </h1>
        <p className="text-lg text-muted-foreground">{strings.success.subheading}</p>
      </div>

      {/* Direction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-lg shadow-primary/5"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          {strings.success.goTo}
        </p>
        <p className="text-2xl font-bold text-foreground">{service.locationHint}</p>
        <p className="mt-1 text-muted-foreground">{service.authority}</p>

        {!isFullyReady && (
          <div className="mt-4 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            You are missing some required documents. The office may ask you to return later.
          </div>
        )}
      </motion.div>

      <div className="flex w-full flex-col gap-3 sm:flex-row pt-4">
        <Button onClick={onStartOver} variant="outline" size="lg" className="flex-1 rounded-xl h-12">
          {strings.success.startOver}
        </Button>
        <Button onClick={onFeedback} size="lg" className="flex-1 rounded-xl h-12 gap-2">
          {strings.success.giveFeedback} <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
