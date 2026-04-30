"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Coins, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

function InfoCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="mt-1.5 text-base font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ServiceDetail({
  strings, service, checked, onCheckedChange, onReady,
}: {
  strings: Strings;
  service: Service | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
  onReady: () => void;
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

  const total = service.requirements.length;
  const checkedCount = service.requirements.filter((r) => checked[r]).length;
  const isReady = total > 0 && checkedCount === total;

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Premium Service title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {service.title}
        </h1>
        <p className="text-lg text-muted-foreground font-medium">{service.authority}</p>
      </div>

      {/* Premium Info grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={Building2} label={strings.detail.authority} value={service.authority} />
        <InfoCard icon={MapPin} label={strings.detail.location} value={service.locationHint} />
        <InfoCard icon={Coins} label={strings.detail.fee} value={service.feeHint} />
        <InfoCard icon={Clock} label={strings.detail.processingTime} value={service.durationHint} />
      </div>

      {/* Premium Requirements checklist */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{strings.detail.requirements}</h2>
          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            {checkedCount}/{total} {strings.detail.itemsConfirmed}
          </span>
        </div>

        {/* Premium Progress bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg"
            initial={{ width: "0%" }}
            animate={{ width: `${total > 0 ? (checkedCount / total) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-3">
          {service.requirements.map((req, idx) => {
            const isChecked = Boolean(checked[req]);
            return (
              <motion.button
                key={req}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCheckedChange({ ...checked, [req]: !isChecked })}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300 touch-target",
                  isChecked
                    ? "border-primary/40 bg-primary/8 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
                )}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-muted-foreground/30" />
                )}
                <span className={cn(
                  "text-base font-medium transition-colors",
                  isChecked ? "text-foreground" : "text-muted-foreground",
                )}>
                  {req}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Premium Readiness message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "rounded-2xl p-5 text-center text-base font-bold shadow-sm",
            isReady
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500/30"
              : "bg-muted text-muted-foreground border-2 border-border",
          )}
        >
          {isReady ? strings.detail.readyMessage : strings.detail.notReadyMessage}
        </motion.div>
      </div>

      <Button onClick={onReady} size="lg" className="w-full rounded-2xl h-14 text-lg font-bold shadow-lg hover:shadow-xl">
        {strings.actions.imReady}
      </Button>
    </div>
  );
}
