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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ClarifyStep } from "@/components/service-navigator/steps/clarify-step";
import {
  IntakeStep,
  type IntakeMethod,
} from "@/components/service-navigator/steps/intake-step";
import { DetailsStep } from "@/components/service-navigator/steps/details-step";
import {
  FeedbackStep,
  type FeedbackValue,
} from "@/components/service-navigator/steps/feedback-step";
import { LanguageStep } from "@/components/service-navigator/steps/language-step";
import { ProblemStep } from "@/components/service-navigator/steps/problem-step";
import { RequirementsStep } from "@/components/service-navigator/steps/requirements-step";
import { SuggestionsStep } from "@/components/service-navigator/steps/suggestions-step";
import { SummaryStep } from "@/components/service-navigator/steps/summary-step";
import { CategoriesStep } from "@/components/service-navigator/steps/categories-step";
import { VoiceStep } from "@/components/service-navigator/steps/voice-step";
import { decide } from "@/lib/service-navigator/engine";
import { getStrings } from "@/lib/service-navigator/strings";
import type {
  Decision,
  LanguageCode,
  MatchCandidate,
  Service,
} from "@/lib/service-navigator/types";
import { MOCK_SERVICES } from "@/lib/mock/services";

type StepId =
  | "language"
  | "intake"
  | "voice"
  | "problem"
  | "categories"
  | "clarify"
  | "suggestions"
  | "details"
  | "requirements"
  | "summary"
  | "feedback";

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

function findServiceById(services: Service[], id: string) {
  return services.find((s) => s.id === id) ?? null;
}

function candidatesFromServiceIds(services: Service[], ids: string[]) {
  const candidates: MatchCandidate[] = [];

  for (const id of ids) {
    const service = findServiceById(services, id);
    if (!service) continue;
    candidates.push({ service, score: 0, matched: [] });
  }

  return candidates.slice(0, 3);
}

export function ServiceNavigator() {
  const services = MOCK_SERVICES;

  const [currentStepId, setCurrentStepId] = React.useState<StepId>("language");

  const [language, setLanguage] = React.useState<LanguageCode>("en");
  const [intakeMethod, setIntakeMethod] = React.useState<IntakeMethod | null>(
    null,
  );
  const [problemText, setProblemText] = React.useState("");

  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [candidates, setCandidates] = React.useState<MatchCandidate[]>([]);

  const [selectedServiceId, setSelectedServiceId] = React.useState<
    string | null
  >(null);
  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return findServiceById(services, selectedServiceId);
  }, [selectedServiceId, services]);

  const [checkedRequirements, setCheckedRequirements] = React.useState<
    Record<string, boolean>
  >({});

  const [feedback, setFeedback] = React.useState<FeedbackValue>({
    helpfulness: null,
    rating: null,
    comment: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  const strings = getStrings(language);

  const inputStepId: StepId =
    intakeMethod === "voice"
      ? "voice"
      : intakeMethod === "categories"
        ? "categories"
        : "problem";

  const activeSteps: StepId[] = React.useMemo(() => {
    const base: StepId[] = [
      "language",
      "intake",
      inputStepId,
      "suggestions",
      "details",
      "requirements",
      "summary",
      "feedback",
    ];

    if (decision?.mode === "clarify") {
      return [
        "language",
        "intake",
        inputStepId,
        "clarify",
        "suggestions",
        "details",
        "requirements",
        "summary",
        "feedback",
      ];
    }

    return base;
  }, [decision?.mode, inputStepId]);

  const stepIndex = Math.max(0, activeSteps.indexOf(currentStepId));
  const progress = Math.round(((stepIndex + 1) / activeSteps.length) * 100);

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < activeSteps.length - 1;

  const stepMeta = strings.steps[currentStepId];

  const requirementsTotal = selectedService?.requirements.length ?? 0;
  const requirementsCheckedCount = selectedService
    ? selectedService.requirements.filter((r) => checkedRequirements[r]).length
    : 0;

  const isCurrentStepValid = React.useMemo(() => {
    switch (currentStepId) {
      case "language":
        return Boolean(language);
      case "intake":
        return true;
      case "voice":
        return problemText.trim().length >= 3;
      case "problem":
        return problemText.trim().length >= 3;
      case "categories":
        // Auto-advance; only becomes current when user needs to pick.
        return true;
      case "clarify":
        // Valid when user has narrowed to a candidate set.
        return candidates.length > 0;
      case "suggestions":
        return Boolean(selectedServiceId);
      case "details":
        return Boolean(selectedServiceId);
      case "requirements":
        return Boolean(selectedServiceId);
      case "summary":
        return Boolean(selectedServiceId);
      case "feedback":
        return true;
      default:
        return false;
    }
  }, [
    candidates.length,
    currentStepId,
    language,
    problemText,
    selectedServiceId,
  ]);

  function resetFlow() {
    setCurrentStepId("language");
    setLanguage("en");
    setIntakeMethod(null);
    setProblemText("");
    setDecision(null);
    setCandidates([]);
    setSelectedServiceId(null);
    setCheckedRequirements({});
    setFeedback({ helpfulness: null, rating: null, comment: "" });
    setFeedbackSubmitted(false);
  }

  function submitProblem(nextText: string) {
    const cleaned = nextText.trim();
    setProblemText(cleaned);

    const nextDecision = decide({ services, input: cleaned, language });
    setDecision(nextDecision);

    if (nextDecision.mode === "clarify") {
      setCandidates([]);
      setSelectedServiceId(null);
      setCurrentStepId("clarify");
      return;
    }

    setCandidates(nextDecision.candidates);
    if (nextDecision.reason === "high-confidence") {
      setSelectedServiceId(nextDecision.candidates[0]?.service.id ?? null);
    } else {
      setSelectedServiceId(null);
    }
    setCurrentStepId("suggestions");
  }

  function goBack() {
    if (!canGoBack) return;

    const prevStepId = activeSteps[stepIndex - 1];
    if (!prevStepId) return;
    setCurrentStepId(prevStepId);
  }

  function goNext() {
    if (!canGoNext) return;

    if (currentStepId === "problem" || currentStepId === "voice") {
      submitProblem(problemText);
      return;
    }

    if (currentStepId === "clarify") {
      // If the user hasn’t picked an option yet, do nothing.
      if (candidates.length === 0) return;
      setCurrentStepId("suggestions");
      return;
    }

    if (currentStepId === "summary") {
      setFeedbackSubmitted(false);
      setCurrentStepId("feedback");
      return;
    }

    const nextStepId = activeSteps[stepIndex + 1];
    if (!nextStepId) return;
    setCurrentStepId(nextStepId);
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="space-y-4 px-6 py-6 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {strings.appTitle}
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                {stepMeta.title} • {getLanguageLabel(language)}
              </CardDescription>
            </div>

            <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Step {stepIndex + 1} / {activeSteps.length}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{stepMeta.description}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-6 pb-8 sm:px-10 sm:pb-10">
          {currentStepId !== "language" && currentStepId !== "intake" ? (
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">
                {stepMeta.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {stepMeta.description}
              </p>
            </div>
          ) : null}

          <Separator className="opacity-60" />

          {currentStepId === "language" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Welcome
                </p>
                <p className="text-base text-muted-foreground sm:text-lg">
                  Please choose your language to continue.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Choose your language
                </Label>
                <LanguageStep
                  value={language}
                  onChange={(next) => {
                    setLanguage(next);
                    setIntakeMethod(null);
                    setProblemText("");
                    setDecision(null);
                    setCandidates([]);
                    setSelectedServiceId(null);
                    // Auto-advance (kiosk-friendly)
                    window.setTimeout(() => setCurrentStepId("intake"), 120);
                  }}
                />
              </div>
            </div>
          ) : null}

          {currentStepId === "intake" ? (
            <IntakeStep
              onPick={(method) => {
                setIntakeMethod(method);
                setProblemText("");
                setDecision(null);
                setCandidates([]);
                setSelectedServiceId(null);

                if (method === "voice") setCurrentStepId("voice");
                if (method === "type") setCurrentStepId("problem");
                if (method === "categories") setCurrentStepId("categories");
              }}
            />
          ) : null}

          {currentStepId === "voice" ? (
            <VoiceStep
              language={language}
              value={problemText}
              onChange={setProblemText}
              onSwitchToTyping={() => {
                setIntakeMethod("type");
                setCurrentStepId("problem");
              }}
            />
          ) : null}

          {currentStepId === "categories" ? (
            <CategoriesStep
              onPick={(hint) => {
                setIntakeMethod("categories");
                submitProblem(hint);
              }}
            />
          ) : null}

          {currentStepId === "problem" ? (
            <ProblemStep value={problemText} onChange={setProblemText} />
          ) : null}

          {currentStepId === "clarify" && decision ? (
            <ClarifyStep
              decision={decision}
              onPick={(serviceIds) => {
                const next = candidatesFromServiceIds(services, serviceIds);
                setCandidates(next);
                setSelectedServiceId(next[0]?.service.id ?? null);
                setCurrentStepId("suggestions");
              }}
            />
          ) : null}

          {currentStepId === "suggestions" ? (
            <SuggestionsStep
              candidates={candidates}
              userText={problemText}
              selectedId={selectedServiceId}
              onSelect={setSelectedServiceId}
            />
          ) : null}

          {currentStepId === "details" ? (
            <DetailsStep service={selectedService} />
          ) : null}

          {currentStepId === "requirements" ? (
            <RequirementsStep
              service={selectedService}
              checked={checkedRequirements}
              onCheckedChange={setCheckedRequirements}
            />
          ) : null}

          {currentStepId === "summary" ? (
            <SummaryStep
              service={selectedService}
              requirementsCheckedCount={requirementsCheckedCount}
              requirementsTotal={requirementsTotal}
              onConfirm={() => {
                setFeedbackSubmitted(false);
                setCurrentStepId("feedback");
              }}
            />
          ) : null}

          {currentStepId === "feedback" ? (
            <FeedbackStep
              value={feedback}
              onChange={setFeedback}
              submitted={feedbackSubmitted}
              onSubmit={() => setFeedbackSubmitted(true)}
            />
          ) : null}

          <Separator />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 rounded-xl"
              onClick={goBack}
              disabled={!canGoBack}
            >
              {strings.actions.back}
            </Button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              {currentStepId !== "feedback" &&
              currentStepId !== "summary" &&
              currentStepId !== "language" &&
              currentStepId !== "intake" &&
              currentStepId !== "categories" &&
              currentStepId !== "clarify" ? (
                <Button
                  type="button"
                  size="lg"
                  className="h-12 rounded-xl"
                  onClick={goNext}
                  disabled={!isCurrentStepValid || !canGoNext}
                >
                  {strings.actions.continue}
                </Button>
              ) : null}

              {currentStepId === "feedback" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl"
                  onClick={resetFlow}
                >
                  {strings.actions.startOver}
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Note: Services shown are sample data for UI development. We’ll replace
        them with Mesob Center’s real service knowledge base later.
      </p>
    </section>
  );
}
