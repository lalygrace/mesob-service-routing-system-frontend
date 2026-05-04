"use client";

import { AlertCircle, Check, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

export function SuccessView({
  strings,
  service,
  checkedCount,
  totalCount,
  onFeedback,
  onStartOver,
}: {
  strings: Strings;
  service: Service | null;
  checkedCount: number;
  totalCount: number;
  onFeedback: () => void;
  onStartOver: () => void;
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

  const isFullyReady = checkedCount === totalCount;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-foreground">
        <Check className="h-8 w-8" strokeWidth={3} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.success.heading}
        </h1>
        <p className="text-lg text-muted-foreground">
          {strings.success.subheading}
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          {strings.success.goTo}
        </p>
        <p className="text-2xl font-bold text-foreground">
          {service.locationHint}
        </p>
        <p className="mt-1 text-muted-foreground">{service.authority}</p>

        {!isFullyReady && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            {strings.review.missingDocsDesc}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row pt-2">
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="flex-1 rounded-xl h-12"
        >
          {strings.success.startOver}
        </Button>
        <Button
          onClick={onFeedback}
          size="lg"
          className="flex-1 rounded-xl h-12 gap-2"
        >
          {strings.success.giveFeedback} <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
