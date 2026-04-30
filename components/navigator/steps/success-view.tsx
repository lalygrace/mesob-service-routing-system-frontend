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
    <div className="flex flex-col items-center justify-center space-y-10 py-6 animate-fade-in-up">
      {/* Premium Animated Check */}
      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="absolute h-40 w-40 rounded-full bg-emerald-500/10"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
          className="absolute h-28 w-28 rounded-full bg-emerald-500/20"
        />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40"
        >
          <Check className="h-10 w-10" strokeWidth={3.5} />
        </motion.div>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {strings.success.heading}
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg">{strings.success.subheading}</p>
      </div>

      {/* Premium Direction Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xl rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center shadow-xl shadow-primary/10"
      >
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3 flex items-center justify-center gap-2">
          <Navigation className="h-4 w-4" />
          {strings.success.goTo}
        </p>
        <p className="text-3xl font-bold text-foreground mb-2">{service.locationHint}</p>
        <p className="text-lg text-muted-foreground font-medium">{service.authority}</p>

        {!isFullyReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 p-4 text-sm font-medium text-amber-700 dark:text-amber-400"
          >
            You are missing some required documents. The office may ask you to return later.
          </motion.div>
        )}
      </motion.div>

      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row pt-4">
        <Button onClick={onStartOver} variant="outline" size="lg" className="flex-1 rounded-2xl h-14 text-base font-bold border-2">
          {strings.success.startOver}
        </Button>
        <Button onClick={onFeedback} size="lg" className="flex-1 rounded-2xl h-14 text-base font-bold gap-2 shadow-lg hover:shadow-xl">
          {strings.success.giveFeedback} <Navigation className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
