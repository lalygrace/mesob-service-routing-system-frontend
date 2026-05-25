"use client";

/**
 * ResultsStep — Service detail + interactive document checklist
 *
 * Shows the full matched service information:
 *   - Organization name, floor/room/counter
 *   - Fee and processing time
 *   - Workflow steps (ordered)
 *   - Interactive document checklist with progress ring
 *   - "Not what I need" escape hatch (per proposal Risk 1 mitigation)
 *
 * Accepts either a flat `Service` (from public catalog) or a `RichServiceDetail`
 * (from POST /api/citizen/sessions/:id/select). The component normalises both
 * into a single internal shape so the rest of the UI is uniform.
 */

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileText,
  ListOrdered,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Service } from "@/lib/service-navigator/types";
import type { RichServiceDetail } from "@/lib/api/citizen";
import type { Strings } from "@/lib/service-navigator/strings";

// ─── Internal normalised shape ────────────────────────────────────────────────

type NormalisedService = {
  id: string;
  name: string;
  organizationName: string;
  locationHint: string;
  feeHint: string;
  durationHint: string;
  requirements: Array<{ key: string; label: string; isRequired: boolean }>;
  steps: Array<{
    number: number;
    title: string;
    detail: string | null;
    isOptional: boolean;
  }>;
};

function normaliseFlat(s: Service): NormalisedService {
  return {
    id: s.id,
    name: s.title,
    organizationName: s.organization,
    locationHint: s.locationHint,
    feeHint: s.feeHint,
    durationHint: s.durationHint,
    requirements: s.requirements.map((r, i) => ({
      key: `${s.id}-req-${i}`,
      label: r,
      isRequired: true,
    })),
    steps: (s.workflowSteps ?? []).map((t, i) => ({
      number: i + 1,
      title: t,
      detail: null,
      isOptional: false,
    })),
  };
}

function normaliseRich(s: RichServiceDetail): NormalisedService {
  const parts = [s.location.floor, s.location.room, s.location.counter].filter(
    Boolean,
  );
  const locationHint = parts.join(" · ") || "";

  const feeHint =
    s.feeDescription ?? (s.feeAmount != null ? `${s.feeAmount} ETB` : "");

  const durationHint =
    s.processingTimeDays != null
      ? s.processingTimeDays <= 0
        ? "Same day"
        : s.processingTimeDays === 1
          ? "1 day"
          : `${s.processingTimeDays} days`
      : "";

  return {
    id: s.id,
    name: s.name,
    organizationName: s.organization.name,
    locationHint,
    feeHint,
    durationHint,
    requirements: s.requirements.map((r) => ({
      key: r.id,
      label: r.label,
      isRequired: r.isRequired,
    })),
    steps: s.steps.map((st) => ({
      number: st.stepNumber,
      title: st.title,
      detail: st.detail,
      isOptional: st.isOptional,
    })),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="group relative overflow-hidden flex items-start gap-4 rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card to-card/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      {/* Decorative background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          viewBox="0 0 200 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,0 L 0,100 Q 75,65 200,90 L 200,0 Z"
            className="fill-primary/10"
          />
        </svg>
      </div>

      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="relative z-10 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ProgressRing({
  progress,
  size = 72,
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
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={{ width: size, height: size }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
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
        <span className="text-sm font-bold text-foreground">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}

function ChecklistCard({
  label,
  checked,
  index,
  isRequired,
  onToggle,
  selectLabel,
  selectedLabel,
}: {
  label: string;
  checked: boolean;
  index: number;
  isRequired: boolean;
  onToggle: () => void;
  selectLabel: string;
  selectedLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "group relative overflow-hidden flex items-start gap-4 rounded-3xl border-2 p-5 text-left transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        checked
          ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-xl shadow-primary/20"
          : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg",
      ].join(" ")}
    >
      {/* Decorative background pattern for checked state */}
      {checked && (
        <div className="absolute inset-0 opacity-30">
          <svg
            viewBox="0 0 400 200"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,0 L 0,200 Q 150,130 400,180 L 400,0 Z"
              className="fill-primary/20"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4 w-full">
        {/* Checkbox icon */}
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
            checked
              ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
              : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          ].join(" ")}
        >
          {checked ? (
            <CheckCircle2 className="h-6 w-6 animate-in zoom-in-50 duration-300" strokeWidth={2.5} />
          ) : (
            <FileText className="h-6 w-6" strokeWidth={2} />
          )}
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1 pt-1">
          <p
            className={[
              "text-base font-bold transition-colors duration-300 leading-tight",
              checked ? "text-foreground" : "text-foreground/90",
            ].join(" ")}
          >
            {label}
            {!isRequired && (
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                (optional)
              </span>
            )}
          </p>
          <p
            className={[
              "mt-2 text-xs font-medium transition-colors duration-300",
              checked ? "text-primary" : "text-muted-foreground",
            ].join(" ")}
          >
            {checked ? `✓ ${selectedLabel}` : selectLabel}
          </p>
        </div>

        {/* Number badge */}
        <span
          className={[
            "shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
            checked
              ? "bg-primary/20 text-primary ring-2 ring-primary/30"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          ].join(" ")}
        >
          {index + 1}
        </span>
      </div>
    </button>
  );
}

function WorkflowSteps({ steps }: { steps: NormalisedService["steps"] }) {
  if (steps.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ListOrdered className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <h2 className="text-base font-bold text-foreground">
          Process Steps
        </h2>
      </div>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className="group relative overflow-hidden flex items-start gap-4 rounded-2xl border-2 border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:scale-[1.01]"
          >
            {/* Decorative background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                viewBox="0 0 400 100"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 0,100 Q 150,65 400,90 L 400,0 Z"
                  className="fill-primary/10"
                />
              </svg>
            </div>

            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              {step.number}
            </span>
            <div className="relative z-10 min-w-0 pt-0.5">
              <p className="text-sm font-bold text-foreground">
                {step.title}
                {step.isOptional && (
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    (optional)
                  </span>
                )}
              </p>
              {step.detail && (
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {step.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResultsStep({
  strings,
  service,
  richService,
  checked,
  onCheckedChange,
  onContinue,
  onNotMyService,
}: {
  strings: Strings;
  /** Flat service from public catalog (browse path or fallback) */
  service: Service | null;
  /** Rich service detail from selectCitizenService (AI path) */
  richService?: RichServiceDetail | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
  onContinue: () => void;
  /** "This is not what I need" — sends citizen back to intake */
  onNotMyService: () => void;
}) {
  // Prefer rich detail when available
  const normalised: NormalisedService | null = richService
    ? normaliseRich(richService)
    : service
      ? normaliseFlat(service)
      : null;

  if (!normalised) {
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

  const { requirements, steps } = normalised;
  const confirmedCount = requirements.filter((r) => checked[r.key]).length;
  const requiredItems = requirements.filter((r) => r.isRequired);
  const missingRequired = requiredItems.filter((r) => !checked[r.key]);
  const isReady = requiredItems.length > 0 && missingRequired.length === 0;
  const progress =
    requirements.length > 0 ? confirmedCount / requirements.length : 0;

  return (
    <div className="space-y-5">
      {/* ── Service header card ── */}
      <div className="rounded-3xl border border-white/20 bg-card/40 backdrop-blur-md p-5 sm:p-6 shadow-xl">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {strings.detail.heading}
          </p>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {normalised.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {normalised.organizationName}
          </p>
        </div>

        {/* Info tiles */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={Building2}
            label={strings.detail.organization}
            value={normalised.organizationName}
          />
          {normalised.locationHint && (
            <InfoTile
              icon={MapPin}
              label={strings.detail.location}
              value={normalised.locationHint}
            />
          )}
          {normalised.feeHint && (
            <InfoTile
              icon={Coins}
              label={strings.detail.fee}
              value={normalised.feeHint}
            />
          )}
          {normalised.durationHint && (
            <InfoTile
              icon={Clock}
              label={strings.detail.processingTime}
              value={normalised.durationHint}
            />
          )}
        </div>
      </div>

      {/* ── Workflow steps ── */}
      {steps.length > 0 && (
        <div className="rounded-3xl border-2 border-border/50 bg-card/40 backdrop-blur-sm p-6 shadow-lg">
          <WorkflowSteps steps={steps} />
        </div>
      )}

      {/* ── Document checklist ── */}
      {requirements.length > 0 && (
        <div className="space-y-5">
          {/* Checklist header with progress ring */}
          <div className="relative overflow-hidden flex items-center justify-between gap-6 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-xl">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-20">
              <svg
                viewBox="0 0 800 200"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 0,200 Q 300,130 800,180 L 800,0 Z"
                  className="fill-primary/30"
                />
              </svg>
            </div>

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" strokeWidth={2.5} />
                <p className="text-lg font-bold text-foreground">
                  {strings.detail.requirements}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {strings.detail.requirementsDesc}
              </p>
            </div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <ProgressRing progress={progress} size={80} strokeWidth={8} />
                {/* Glow effect */}
                {progress > 0 && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {confirmedCount}<span className="text-muted-foreground">/{requirements.length}</span>
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {strings.detail.itemsConfirmed}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div className="grid gap-4 sm:grid-cols-2">
            {requirements.map((req, index) => (
              <ChecklistCard
                key={req.key}
                label={req.label}
                checked={Boolean(checked[req.key])}
                index={index}
                isRequired={req.isRequired}
                onToggle={() =>
                  onCheckedChange({ ...checked, [req.key]: !checked[req.key] })
                }
                selectLabel={strings.actions.select}
                selectedLabel={strings.actions.selected}
              />
            ))}
          </div>

          {/* Readiness banner */}
          <div
            className={[
              "relative overflow-hidden rounded-3xl border-2 p-5 transition-all duration-500",
              isReady
                ? "border-primary bg-gradient-to-br from-primary/15 via-primary/5 to-transparent shadow-2xl shadow-primary/20"
                : "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent",
            ].join(" ")}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-20">
              <svg
                viewBox="0 0 800 150"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 0,150 Q 300,80 800,130 L 800,0 Z"
                  className={isReady ? "fill-primary/30" : "fill-amber-500/30"}
                />
              </svg>
            </div>

            <div className="relative z-10 flex items-start gap-4">
              {isReady ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg animate-pulse" />
                  <CheckCircle2 className="relative h-7 w-7 text-primary animate-in zoom-in-50 duration-500" strokeWidth={2.5} />
                </div>
              ) : (
                <AlertTriangle className="h-7 w-7 text-amber-500" strokeWidth={2.5} />
              )}
              <div className="space-y-2">
                <p className="text-base font-bold text-foreground">
                  {isReady
                    ? strings.review.readyTitle
                    : strings.review.missingDocsTitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isReady
                    ? strings.review.readyDesc
                    : strings.review.missingDocsDesc}
                </p>
                {!isReady && missingRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {missingRequired.map((r) => (
                      <span
                        key={r.key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {r.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator className="opacity-20" />

      {/* ── Action buttons ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* "Not what I need" — escape hatch per proposal Risk 1 */}
        <Button
          variant="outline"
          onClick={onNotMyService}
          size="lg"
          className="group relative overflow-hidden rounded-2xl h-14 gap-3 border-2 hover:border-destructive/40 hover:bg-destructive/5 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/5 to-destructive/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <RotateCcw className="h-5 w-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2} />
          <span className="relative z-10 font-semibold">This is not what I need</span>
        </Button>

        <Button
          onClick={onContinue}
          size="lg"
          className="group relative overflow-hidden rounded-2xl h-14 gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FileCheck2 className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
          <span className="relative z-10 font-semibold">{strings.actions.continue}</span>
        </Button>
      </div>
    </div>
  );
}
