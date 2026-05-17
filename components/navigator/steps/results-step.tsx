"use client";

/**
 * ResultsStep — Service detail + interactive document checklist
 *
 * Shows the full matched service information:
 *   - Authority name, floor/room/counter
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
  authorityName: string;
  locationHint: string;
  feeHint: string;
  durationHint: string;
  requirements: Array<{ key: string; label: string; isRequired: boolean }>;
  steps: Array<{ number: number; title: string; detail: string | null; isOptional: boolean }>;
};

function normaliseFlat(s: Service): NormalisedService {
  return {
    id: s.id,
    name: s.title,
    authorityName: s.authority,
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
    s.feeDescription ??
    (s.feeAmount != null ? `${s.feeAmount} ETB` : "");

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
    authorityName: s.authority.name,
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
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-background/40 backdrop-blur-sm p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
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
        "group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
        "hover:scale-[1.01] active:scale-[0.99]",
        checked
          ? "border-primary/30 bg-primary/5 shadow-[0_0_20px_-4px] shadow-primary/20"
          : "border-white/10 bg-card/40 backdrop-blur-sm hover:bg-card/60",
      ].join(" ")}
    >
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
          {!isRequired && (
            <span className="ml-2 text-xs text-muted-foreground">(optional)</span>
          )}
        </p>
        <p
          className={[
            "mt-1 text-xs transition-colors duration-300",
            checked ? "text-primary font-medium" : "text-muted-foreground",
          ].join(" ")}
        >
          {checked ? `✓ ${selectedLabel}` : selectLabel}
        </p>
      </div>

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

function WorkflowSteps({
  steps,
}: {
  steps: NormalisedService["steps"];
}) {
  if (steps.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ListOrdered className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Process Steps
        </h2>
      </div>
      <ol className="space-y-2">
        {steps.map((step) => (
          <li
            key={step.number}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm p-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {step.number}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {step.title}
                {step.isOptional && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (optional)
                  </span>
                )}
              </p>
              {step.detail && (
                <p className="mt-0.5 text-xs text-muted-foreground">
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
            {normalised.authorityName}
          </p>
        </div>

        {/* Info tiles */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={Building2}
            label={strings.detail.authority}
            value={normalised.authorityName}
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
        <div className="rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm p-5">
          <WorkflowSteps steps={steps} />
        </div>
      )}

      {/* ── Document checklist ── */}
      {requirements.length > 0 && (
        <div className="space-y-4">
          {/* Checklist header with progress ring */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {strings.detail.requirements}
              </p>
              <p className="text-xs text-muted-foreground">
                {strings.detail.requirementsDesc}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ProgressRing progress={progress} />
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">
                  {confirmedCount}/{requirements.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {strings.detail.itemsConfirmed}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div className="grid gap-3 sm:grid-cols-2">
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
                {!isReady && missingRequired.length > 0 && (
                  <p className="text-sm text-foreground">
                    {missingRequired.map((r) => r.label).join(" • ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator className="opacity-20" />

      {/* ── Action buttons ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* "Not what I need" — escape hatch per proposal Risk 1 */}
        <Button
          variant="outline"
          onClick={onNotMyService}
          size="lg"
          className="rounded-xl h-12 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          This is not what I need
        </Button>

        <Button
          onClick={onContinue}
          size="lg"
          className="rounded-xl h-12 gap-2"
        >
          <FileCheck2 className="h-4 w-4" />
          {strings.actions.continue}
        </Button>
      </div>
    </div>
  );
}
