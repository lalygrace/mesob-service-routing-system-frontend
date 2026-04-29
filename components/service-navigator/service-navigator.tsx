"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MOCK_SERVICES, type Service } from "@/lib/mock/services";

type LanguageCode = "am" | "en" | "om";

type StepId =
  | "language"
  | "problem"
  | "suggestions"
  | "details"
  | "requirements"
  | "feedback";

type Step = {
  id: StepId;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    id: "language",
    title: "Language",
    description: "Choose your preferred language.",
  },
  {
    id: "problem",
    title: "Your problem",
    description: "Tell us what you need help with.",
  },
  {
    id: "suggestions",
    title: "Suggestions",
    description: "Pick the best match.",
  },
  {
    id: "details",
    title: "Details",
    description: "See where to go and what to bring.",
  },
  {
    id: "requirements",
    title: "Checklist",
    description: "Confirm required documents.",
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Help us improve.",
  },
];

function clampStepIndex(index: number) {
  return Math.max(0, Math.min(STEPS.length - 1, index));
}

function getLanguageLabel(code: LanguageCode) {
  switch (code) {
    case "am":
      return "Amharic";
    case "en":
      return "English";
    case "om":
      return "Afaan Oromo";
  }
}

export function ServiceNavigator() {
  const [stepIndex, setStepIndex] = React.useState(0);

  const [language, setLanguage] = React.useState<LanguageCode>("en");
  const [voiceMode, setVoiceMode] = React.useState(false);
  const [problemText, setProblemText] = React.useState("");
  const [selectedServiceId, setSelectedServiceId] = React.useState<
    string | null
  >(null);
  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return MOCK_SERVICES.find((s) => s.id === selectedServiceId) ?? null;
  }, [selectedServiceId]);

  const [checkedRequirements, setCheckedRequirements] = React.useState<
    Record<string, boolean>
  >({});

  const step = STEPS[stepIndex];
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < STEPS.length - 1;

  const isCurrentStepValid = React.useMemo(() => {
    switch (step.id) {
      case "language":
        return Boolean(language);
      case "problem":
        return problemText.trim().length >= 5;
      case "suggestions":
        return Boolean(selectedServiceId);
      case "details":
        return Boolean(selectedServiceId);
      case "requirements":
        return Boolean(selectedServiceId);
      case "feedback":
        return true;
      default:
        return false;
    }
  }, [language, problemText, selectedServiceId, step.id]);

  function goNext() {
    if (!canGoNext) return;
    setStepIndex((i) => clampStepIndex(i + 1));
  }

  function goBack() {
    if (!canGoBack) return;
    setStepIndex((i) => clampStepIndex(i - 1));
  }

  function resetFlow() {
    setStepIndex(0);
    setLanguage("en");
    setVoiceMode(false);
    setProblemText("");
    setSelectedServiceId(null);
    setCheckedRequirements({});
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl">
                Service navigation
              </CardTitle>
              <CardDescription>
                {step.title} • {getLanguageLabel(language)}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Voice</Label>
              <Switch
                checked={voiceMode}
                onCheckedChange={setVoiceMode}
                aria-label="Toggle voice mode"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {stepIndex + 1} of {STEPS.length}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-1">
            <p className="text-base font-medium text-foreground">
              {step.title}
            </p>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          <Separator />

          {step.id === "language" ? (
            <LanguageStep value={language} onChange={setLanguage} />
          ) : null}

          {step.id === "problem" ? (
            <ProblemStep value={problemText} onChange={setProblemText} />
          ) : null}

          {step.id === "suggestions" ? (
            <SuggestionsStep
              services={MOCK_SERVICES}
              problemText={problemText}
              selectedId={selectedServiceId}
              onSelect={setSelectedServiceId}
            />
          ) : null}

          {step.id === "details" ? (
            <DetailsStep service={selectedService} />
          ) : null}

          {step.id === "requirements" ? (
            <RequirementsStep
              service={selectedService}
              checked={checkedRequirements}
              onCheckedChange={setCheckedRequirements}
            />
          ) : null}

          {step.id === "feedback" ? (
            <FeedbackStep onRestart={resetFlow} />
          ) : null}

          <Separator />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12"
              onClick={goBack}
              disabled={!canGoBack}
            >
              Back
            </Button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              {step.id !== "feedback" ? (
                <Button
                  type="button"
                  size="lg"
                  className="h-12"
                  onClick={goNext}
                  disabled={!isCurrentStepValid || !canGoNext}
                >
                  Continue
                </Button>
              ) : null}

              {step.id === "feedback" ? (
                <Button
                  type="button"
                  size="lg"
                  className="h-12"
                  onClick={resetFlow}
                >
                  Start over
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Note: Services shown are placeholders for UI development. We’ll replace
        them with Mesob Center’s real service data later.
      </p>
    </section>
  );
}

function LanguageStep({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as LanguageCode)}
      className="grid gap-3 sm:grid-cols-3"
    >
      <LanguageOption value="am" label="Amharic" />
      <LanguageOption value="en" label="English" />
      <LanguageOption value="om" label="Afaan Oromo" />
    </RadioGroup>
  );
}

function LanguageOption({
  value,
  label,
}: {
  value: LanguageCode;
  label: string;
}) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={value}
        id={`lang-${value}`}
        className="peer sr-only"
      />
      <Label
        htmlFor={`lang-${value}`}
        className={cn(
          "flex min-h-14 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-card-foreground shadow-sm transition-colors",
          "hover:bg-muted",
          "peer-data-[state=checked]:border-ring peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring/30",
        )}
      >
        {label}
      </Label>
    </div>
  );
}

function ProblemStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="problem">Describe your problem</Label>
        <Textarea
          id="problem"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Example: "I lost my ID" or "My passport expired"'
          className="min-h-28"
        />
        <p className="text-xs text-muted-foreground">
          Keep it short. We will ask clarifying questions when needed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quick">Quick examples</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "I lost my ID",
            "My passport expired",
            "I want to start a business",
            "I need tax registration",
          ].map((example) => (
            <Button
              key={example}
              type="button"
              variant="outline"
              size="lg"
              className="h-12 justify-start"
              onClick={() => onChange(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionsStep({
  services,
  problemText,
  selectedId,
  onSelect,
}: {
  services: Service[];
  problemText: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">You said</p>
        <p className="mt-1 text-sm text-muted-foreground">{problemText}</p>
      </div>

      <div className="grid gap-3">
        {services.slice(0, 3).map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <Card
              key={service.id}
              className={cn(
                "transition-colors",
                isSelected ? "border-ring ring-2 ring-ring/20" : undefined,
              )}
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{service.title}</CardTitle>
                <CardDescription>{service.authority}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {service.locationHint}
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="h-12"
                  onClick={() => onSelect(service.id)}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        This is a UI scaffold. Next checkpoint will match services based on your
        input and confidence.
      </p>
    </div>
  );
}

function DetailsStep({ service }: { service: Service | null }) {
  if (!service) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">No service selected</CardTitle>
          <CardDescription>
            Go back and select one of the suggestions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <InfoCard title="Authority" value={service.authority} />
      <InfoCard title="Location" value={service.locationHint} />
      <InfoCard title="Fee" value={service.feeHint} />
      <InfoCard title="Processing time" value={service.durationHint} />
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-base">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function RequirementsStep({
  service,
  checked,
  onCheckedChange,
}: {
  service: Service | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
}) {
  if (!service) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">No service selected</CardTitle>
          <CardDescription>
            Go back and select one of the suggestions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = service.requirements.length;
  const completeCount = service.requirements.filter((r) => checked[r]).length;
  const isReady = total > 0 && completeCount === total;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">Readiness</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {completeCount} of {total} required items confirmed.
        </p>
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            isReady ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {isReady
            ? "You look ready. Proceed to the counter."
            : "Missing items? You can still proceed and ask for help."}
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Required documents</CardTitle>
          <CardDescription>
            Check what you already have with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {service.requirements.map((req) => (
            <div
              key={req}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <Checkbox
                id={`req-${service.id}-${req}`}
                checked={Boolean(checked[req])}
                onCheckedChange={(v) =>
                  onCheckedChange({ ...checked, [req]: Boolean(v) })
                }
              />
              <Label
                htmlFor={`req-${service.id}-${req}`}
                className="cursor-pointer text-sm leading-6"
              >
                {req}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackStep({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Thanks</CardTitle>
          <CardDescription>
            In the next checkpoint we’ll implement ratings + feedback capture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" size="lg" className="h-12">
              Helpful
            </Button>
            <Button type="button" variant="outline" size="lg" className="h-12">
              Not helpful
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Optional comment</Label>
            <Input id="feedback" placeholder="Tell us what was confusing..." />
          </div>

          <Button type="button" size="lg" className="h-12" onClick={onRestart}>
            Finish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
