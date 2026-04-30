"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

function InfoItem({
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
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

export function ReviewStep({
  strings,
  service,
  checked,
  onCheckedChange,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  submitted,
  onSubmit,
  onStartOver,
}: {
  strings: Strings;
  service: Service | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
  rating: number;
  onRatingChange: (next: number) => void;
  comment: string;
  onCommentChange: (next: string) => void;
  submitted: boolean;
  onSubmit: () => void;
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

  const requirements = service.requirements;
  const missing = requirements.filter((r) => !checked[r]);
  const canSubmit = missing.length === 0 && rating === 5;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-foreground">
          <CheckCircle2 className="h-10 w-10" />
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
          className="rounded-xl h-12 px-8 mt-2"
        >
          {strings.actions.startOver}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.review.heading}
        </h1>
        <p className="text-muted-foreground">{strings.review.subheading}</p>
      </div>

      <Card>
        <CardHeader className="space-y-1 border-b">
          <CardTitle className="text-lg">{service.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{service.authority}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={Building2}
              label={strings.detail.authority}
              value={service.authority}
            />
            <InfoItem
              icon={MapPin}
              label={strings.detail.location}
              value={service.locationHint}
            />
            <InfoItem
              icon={Coins}
              label={strings.detail.fee}
              value={service.feeHint}
            />
            <InfoItem
              icon={Clock}
              label={strings.detail.processingTime}
              value={service.durationHint}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">
                {strings.detail.requirements}
              </h2>
              <span className="text-xs font-medium text-muted-foreground">
                {requirements.length - missing.length}/{requirements.length}{" "}
                {strings.detail.itemsConfirmed}
              </span>
            </div>

            <div className="space-y-2">
              {requirements.map((req) => (
                <label
                  key={req}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={Boolean(checked[req])}
                    onCheckedChange={(next) => {
                      const isChecked = Boolean(next);
                      onCheckedChange({ ...checked, [req]: isChecked });
                    }}
                    aria-label={req}
                  />
                  <span className="text-sm text-foreground">{req}</span>
                </label>
              ))}
            </div>

            {missing.length > 0 ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {strings.review.missingDocsTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {strings.review.missingDocsDesc}
                    </p>
                    <p className="text-sm text-foreground">
                      {missing.join(" • ")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {strings.review.readyTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {strings.review.readyDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              {strings.feedbackForm.rating}
            </h2>

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
                    className="rounded-full"
                    onClick={() => onRatingChange(starValue)}
                    aria-label={`${strings.feedbackForm.rating}: ${starValue}`}
                  >
                    <Star
                      className={
                        active ? "text-primary" : "text-muted-foreground"
                      }
                      fill={active ? "currentColor" : "none"}
                    />
                  </Button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {strings.feedbackForm.comment}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder={strings.feedbackForm.commentPlaceholder}
                className="min-h-24 rounded-xl resize-none"
              />
            </div>

            <Button
              onClick={onSubmit}
              disabled={!canSubmit}
              size="lg"
              className="w-full rounded-xl h-12"
            >
              {strings.feedbackForm.submit}
            </Button>

            <Button
              onClick={onStartOver}
              variant="outline"
              size="lg"
              className="w-full rounded-xl h-12"
            >
              {strings.actions.startOver}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
