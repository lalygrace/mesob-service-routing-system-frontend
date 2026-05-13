"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

/* ── Circular Progress Ring ─────────────────────────────── */
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        style={{ width: size, height: size }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ── Checklist Card Item ────────────────────────────────── */
function ChecklistCard({
  label,
  checked,
  index,
  onToggle,
  selectLabel,
  selectedLabel,
}: {
  label: string;
  checked: boolean;
  index: number;
  onToggle: () => void;
  selectLabel: string;
  selectedLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
        "hover:scale-[1.01] active:scale-[0.99]",
        checked
          ? "border-primary/30 bg-primary/5 shadow-[0_0_20px_-4px] shadow-primary/20"
          : "border-white/10 bg-card/40 backdrop-blur-sm hover:bg-card/60",
      ].join(" ")}
    >
      {/* Animated checkmark */}
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          checked
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-muted/60 text-muted-foreground",
        ].join(" ")}
      >
        {checked ? (
          <CheckCircle2 className="h-5 w-5 animate-in zoom-in-50 duration-300" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-sm font-medium transition-colors duration-300",
            checked ? "text-foreground" : "text-foreground/80",
          ].join(" ")}
        >
          {label}
        </p>
        <p
          className={[
            "mt-1 text-xs transition-colors duration-300",
            checked
              ? "text-primary font-medium"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {checked ? `✓ ${selectedLabel}` : selectLabel}
        </p>
      </div>

      {/* Index badge */}
      <span
        className={[
          "shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
          checked
            ? "bg-primary/20 text-primary"
            : "bg-white/5 text-muted-foreground",
        ].join(" ")}
      >
        {index + 1}
      </span>
    </button>
  );
}

/* ── Main ResultsStep ───────────────────────────────────── */
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
  const progress =
    requirements.length > 0 ? confirmedCount / requirements.length : 0;

  return (
    <div className="space-y-5">
      {/* Header with progress ring */}
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
          <div className="flex items-center gap-4">
            <ProgressRing progress={progress} />
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold text-foreground">
                {confirmedCount}/{requirements.length}
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {strings.detail.itemsConfirmed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist grid */}
      <section className="grid gap-3 sm:grid-cols-2">
        {requirements.map((req, index) => (
          <ChecklistCard
            key={req}
            label={req}
            checked={Boolean(checked[req])}
            index={index}
            onToggle={() => {
              onCheckedChange({ ...checked, [req]: !checked[req] });
            }}
            selectLabel={strings.actions.select}
            selectedLabel={strings.actions.selected}
          />
        ))}
      </section>

      {/* Status banner */}
      <div
        className={[
          "rounded-2xl border p-4 transition-all duration-500",
          isReady
            ? "border-primary/30 bg-primary/5 shadow-[0_0_30px_-8px] shadow-primary/25"
            : "border-white/10 bg-background/30 backdrop-blur-md",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          {isReady ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary animate-in zoom-in-50 duration-500" />
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
