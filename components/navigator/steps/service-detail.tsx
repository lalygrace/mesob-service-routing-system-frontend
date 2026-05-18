"use client";

import {
  Building2,
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ServiceDetail({
  strings,
  service,
  checked,
  onCheckedChange,
  onReady,
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
        <p className="font-semibold text-foreground">
          {strings.noServiceSelected}
        </p>
        <p className="text-sm text-muted-foreground">
          {strings.noServiceSelectedDesc}
        </p>
      </div>
    );
  }

  const total = service.requirements.length;
  const checkedCount = service.requirements.filter((r) => checked[r]).length;
  const isReady = total > 0 && checkedCount === total;

  return (
    <div className="space-y-8">
      {/* Service title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {service.title}
        </h1>
        <p className="text-muted-foreground">{service.organization}</p>
      </div>

      {/* Info grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard
          icon={Building2}
          label={strings.detail.organization}
          value={service.organization}
        />
        <InfoCard
          icon={MapPin}
          label={strings.detail.location}
          value={service.locationHint}
        />
        <InfoCard
          icon={Coins}
          label={strings.detail.fee}
          value={service.feeHint}
        />
        <InfoCard
          icon={Clock}
          label={strings.detail.processingTime}
          value={service.durationHint}
        />
      </div>

      {/* Requirements checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {strings.detail.requirements}
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            {checkedCount}/{total} {strings.detail.itemsConfirmed}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${total > 0 ? (checkedCount / total) * 100 : 0}%`,
            }}
          />
        </div>

        <div className="space-y-2">
          {service.requirements.map((req) => {
            const isChecked = Boolean(checked[req]);
            return (
              <button
                key={req}
                onClick={() =>
                  onCheckedChange({ ...checked, [req]: !isChecked })
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left",
                  isChecked
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card hover:border-primary/20",
                )}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isChecked ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {req}
                </span>
              </button>
            );
          })}
        </div>

        {/* Readiness message */}
        <div
          className={cn(
            "rounded-xl p-4 text-center text-sm font-medium",
            isReady
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isReady
            ? strings.detail.readyMessage
            : strings.detail.notReadyMessage}
        </div>
      </div>

      <Button onClick={onReady} size="lg" className="w-full rounded-xl h-12">
        {strings.actions.imReady}
      </Button>
    </div>
  );
}
