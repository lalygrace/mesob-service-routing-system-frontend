"use client";

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

export function ReviewStep({
  strings,
  service,
  checked,
  rating,
  onRatingChange,
  submitted,
  onSubmit,
  onStartOver,
}: {
  strings: Strings;
  service: Service | null;
  checked: Record<string, boolean>;
  rating: number;
  onRatingChange: (next: number) => void;
  submitted: boolean;
  onSubmit: () => void;
  onStartOver: () => void;
}) {
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-foreground">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {strings.feedbackForm.thankYou}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {strings.feedbackForm.thankYouDesc}
          </p>
        </div>
        <Button
          onClick={onStartOver}
          size="lg"
          className="rounded-xl h-12 px-8"
        >
          Serve next customer
        </Button>
      </div>
    );
  }

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
                  {service.authority}
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
              label={strings.detail.authority}
              value={service.authority}
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

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="bg-card/40 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {strings.detail.requirements}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {confirmedDocs.length}/{service.requirements.length}{" "}
                  {strings.detail.itemsConfirmed}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {service.requirements.map((req) => {
                const confirmed = Boolean(checked[req]);
                return (
                  <div
                    key={req}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 backdrop-blur-sm px-3 py-2"
                  >
                    <CheckCircle2
                      className={
                        confirmed
                          ? "h-4 w-4 text-primary"
                          : "h-4 w-4 text-muted-foreground"
                      }
                    />
                    <span className="text-sm text-foreground">{req}</span>
                  </div>
                );
              })}
            </div>

            {missingDocs.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-background/30 backdrop-blur-sm p-3 text-sm text-muted-foreground">
                {strings.review.missingDocsDesc}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="space-y-5 p-5">
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

            <div className="space-y-3 text-center">
              <h3 className="text-sm font-semibold text-foreground">
                {strings.feedbackForm.rating}
              </h3>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  const active = starValue <= rating;
                  return (
                    <Button
                      key={starValue}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={() => {
                        onRatingChange(starValue);
                        onSubmit();
                      }}
                      aria-label={`${strings.feedbackForm.rating}: ${starValue}`}
                    >
                      <Star
                        className={
                          active
                            ? "h-7 w-7 text-primary"
                            : "h-7 w-7 text-muted-foreground"
                        }
                        fill={active ? "currentColor" : "none"}
                      />
                    </Button>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Select a star to finish and serve the next customer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
