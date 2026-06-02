"use client";

import * as React from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  MapPin,
  Navigation,
  Star,
  RotateCcw,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

type DetailIcon = typeof Building2;

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: DetailIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Rating labels per star count ──────────────────────── */
const RATING_LABELS: Record<string, string[]> = {
  en: ["", "Poor", "Fair", "Good", "Great", "Excellent"],
  am: ["", "ደካማ", "መካከለኛ", "ጥሩ", "በጣም ጥሩ", "እጅግ በጣም ጥሩ"],
  om: ["", "Dadhabaa", "Giddugaleessa", "Gaarii", "Baay'ee Gaarii", "Addaa"],
};

/* ── Interactive Star ──────────────────────────────────── */
function InteractiveStar({
  value,
  currentRating,
  hoverRating,
  onHover,
  onClick,
  ariaLabel,
  delay,
}: {
  value: number;
  currentRating: number;
  hoverRating: number;
  onHover: (v: number) => void;
  onClick: (v: number) => void;
  ariaLabel: string;
  delay: number;
}) {
  const isActive = value <= (hoverRating || currentRating);
  const isExact = value === currentRating && currentRating > 0;

  return (
    <button
      type="button"
      className={[
        "relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
        "h-14 w-14 sm:h-16 sm:w-16",
        "hover:scale-125",
        isActive ? "text-primary" : "text-muted-foreground/40",
        isExact ? "animate-in zoom-in-75 duration-500" : "",
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(value)}
      aria-label={`${ariaLabel}: ${value}`}
    >
      {/* Glow effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-primary/15 blur-md transition-opacity duration-300" />
      )}
      <Star
        className={[
          "relative z-10 transition-all duration-300",
          "h-8 w-8 sm:h-10 sm:w-10",
          isActive ? "drop-shadow-[0_0_8px_var(--primary)]" : "",
        ].join(" ")}
        fill={isActive ? "currentColor" : "none"}
        strokeWidth={isActive ? 0 : 1.5}
      />
    </button>
  );
}

export function ReviewStep({
  strings,
  service,
  checked,
  rating,
  onRatingChange,
  submitted,
  onSubmit,
  onStartOver,
  sessionCount,
  language,
}: {
  strings: Strings;
  service: Service | null;
  checked: Record<string, boolean>;
  rating: number;
  onRatingChange: (next: number) => void;
  submitted: boolean;
  onSubmit: (rating: number) => void;
  onStartOver: () => void;
  sessionCount?: number;
  language?: string;
}) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const langKey = language ?? "en";
  const labels = RATING_LABELS[langKey] ?? RATING_LABELS.en;
  const displayRating = hoverRating || rating;

  if (!service) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
        <p className="font-semibold text-foreground">
          {strings.noServiceSelected}
        </p>
        <p className="text-sm text-muted-foreground">
          {strings.noServiceSelectedDesc}
        </p>
      </div>
    );
  }

  const confirmedDocs = service.requirements.filter((req) => checked[req]);
  const missingDocs = service.requirements.filter((req) => !checked[req]);

  /* ── Thank-you screen after submission ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
        {/* Animated checkmark */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in-50 duration-700" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {strings.feedbackForm.thankYou}
          </h2>
          <p className="text-muted-foreground max-w-sm">
            {strings.feedbackForm.thankYouDesc}
          </p>
        </div>

        {/* Closing message */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 max-w-2xl">
          <p className="text-sm text-foreground leading-relaxed">
            {strings.systemMessages.closing}
          </p>
        </div>

        {/* Star display */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={[
                  "h-5 w-5 transition-colors",
                  i < rating ? "text-primary" : "text-muted-foreground/20",
                ].join(" ")}
                fill={i < rating ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {labels[rating] ?? ""}
            </span>
          </div>
        )}

        {/* Session counter */}
        {typeof sessionCount === "number" && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/40 backdrop-blur-sm px-4 py-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Session #{sessionCount + 1}
            </span>
          </div>
        )}

        <Button
          onClick={onStartOver}
          size="lg"
          className="rounded-xl h-12 px-8 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Serve next customer
        </Button>
      </div>
    );
  }

  /* ── Main review view ── */
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-white/20 shadow-xl">
        <CardContent className="p-0">
          <div className="border-b border-white/10 bg-background/20 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {strings.detail.heading}
                </p>
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {service.title}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {service.organization}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/50 backdrop-blur-sm px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {strings.success.goTo}
                </p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {service.locationHint}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <DetailTile
              icon={Building2}
              label={strings.detail.organization}
              value={service.organization}
            />
            <DetailTile
              icon={MapPin}
              label={strings.detail.location}
              value={service.locationHint}
            />
            <DetailTile
              icon={Coins}
              label={strings.detail.fee}
              value={service.feeHint}
            />
            <DetailTile
              icon={Clock}
              label={strings.detail.processingTime}
              value={service.durationHint}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {/* Rating card - Full width */}
        <Card className="bg-card/40 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Thank you for using Mesob Center
                </h2>
                <p className="text-sm text-muted-foreground">
                  {strings.feedbackForm.subheading}
                </p>
              </div>
            </div>

            {/* Star rating with hover effects */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground text-center">
                {strings.feedbackForm.rating}
              </h3>

              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <InteractiveStar
                      key={starValue}
                      value={starValue}
                      currentRating={rating}
                      hoverRating={hoverRating}
                      onHover={setHoverRating}
                      onClick={(v) => {
                        onRatingChange(v);
                        onSubmit(v);
                      }}
                      ariaLabel={strings.feedbackForm.rating}
                      delay={i * 50}
                    />
                  );
                })}
              </div>

              {/* Dynamic rating label */}
              <div className="h-8 flex items-center justify-center">
                {displayRating > 0 && (
                  <span
                    className="text-lg font-semibold text-primary animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                    key={displayRating}
                  >
                    {labels[displayRating] ?? ""}
                  </span>
                )}
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Select a star to finish and serve the next customer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
