"use client";

import { Building2, Clock, Coins, MapPin, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MatchCandidate, Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
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

export function ResultsStep({
  strings,
  services,
  candidates,
  userText,
  selectedId,
  onSelect,
  onContinue,
}: {
  strings: Strings;
  services: Service[];
  candidates: MatchCandidate[];
  userText: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  const recommendedIds = new Set(candidates.map((c) => c.service.id));
  const selectedService =
    (selectedId ? services.find((s) => s.id === selectedId) : null) ??
    candidates[0]?.service ??
    null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.results.heading}
        </h1>
      </div>

      {/* User's query */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {strings.results.youSaid}
        </p>
        <p className="mt-1 text-sm text-foreground">&ldquo;{userText}&rdquo;</p>
      </div>

      {selectedService && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {strings.detail.heading}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {selectedService.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedService.authority}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={Building2}
              label={strings.detail.authority}
              value={selectedService.authority}
            />
            <DetailItem
              icon={MapPin}
              label={strings.detail.location}
              value={selectedService.locationHint}
            />
            <DetailItem
              icon={Coins}
              label={strings.detail.fee}
              value={selectedService.feeHint}
            />
            <DetailItem
              icon={Clock}
              label={strings.detail.processingTime}
              value={selectedService.durationHint}
            />
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-sm font-semibold text-foreground">
              {strings.detail.requirements}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedService.requirements.slice(0, 8).map((req) => (
                <span
                  key={req}
                  className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-foreground"
                >
                  {req}
                </span>
              ))}
              {selectedService.requirements.length > 8 && (
                <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                  +{selectedService.requirements.length - 8}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {candidates.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="font-semibold text-foreground">
              {strings.results.noResults}
            </p>
            <p className="text-sm text-muted-foreground">
              {strings.results.noResultsHint}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          const isRecommended = recommendedIds.has(service.id);
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border-2 bg-card p-5 text-left transition-colors",
                isSelected
                  ? "border-primary bg-muted"
                  : isRecommended
                    ? "border-primary/40 hover:bg-muted/40"
                    : "border-border hover:bg-muted/40",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isRecommended
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-foreground",
                )}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{service.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {service.authority}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {service.locationHint}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {services.length > 0 && (
        <Button
          onClick={onContinue}
          disabled={!selectedId}
          size="lg"
          className="w-full rounded-xl h-12"
        >
          {strings.actions.continue}
        </Button>
      )}
    </div>
  );
}
