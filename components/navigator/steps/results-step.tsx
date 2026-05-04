"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function ResultsStep({
  strings,
  service,
  checked,
  onCheckedChange,
  onContinue,
}: {
  strings: Strings;
  service: Service | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
  onContinue: () => void;
}) {
  if (!service) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
        <p className="font-semibold text-foreground">
          {strings.results.noResults}
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          {strings.results.noResultsHint}
        </p>
      </div>
    );
  }

  const requirements = service.requirements;
  const confirmedCount = requirements.filter((req) => checked[req]).length;
  const missing = requirements.filter((req) => !checked[req]);
  const isReady = requirements.length > 0 && missing.length === 0;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/20 bg-card/40 backdrop-blur-md p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {strings.detail.requirements}
            </p>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {service.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {strings.detail.requirementsDesc}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/50 backdrop-blur-sm px-4 py-3 text-center">
            <p className="text-3xl font-bold text-foreground">
              {confirmedCount}/{requirements.length}
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {strings.detail.itemsConfirmed}
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        {requirements.map((req) => {
          const isChecked = Boolean(checked[req]);
          return (
            <label
              key={req}
              className="flex min-h-16 items-start gap-3 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 transition-all hover:bg-card/60"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(next) => {
                  onCheckedChange({ ...checked, [req]: Boolean(next) });
                }}
                aria-label={req}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{req}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isChecked
                    ? strings.actions.selected
                    : strings.actions.select}
                </p>
              </div>
            </label>
          );
        })}
      </section>

      <div className="rounded-2xl border border-white/10 bg-background/30 backdrop-blur-md p-4">
        <div className="flex items-start gap-3">
          {isReady ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {isReady
                ? strings.review.readyTitle
                : strings.review.missingDocsTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {isReady
                ? strings.review.readyDesc
                : strings.review.missingDocsDesc}
            </p>
            {!isReady && missing.length > 0 && (
              <p className="text-sm text-foreground">{missing.join(" • ")}</p>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full rounded-xl h-12 gap-2"
      >
        <FileCheck2 className="h-4 w-4" />
        {strings.actions.continue}
      </Button>
    </div>
  );
}
