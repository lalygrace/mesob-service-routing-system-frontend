"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { IntakeStep } from "@/components/navigator/steps/intake-step";
import { VoiceInput } from "@/components/navigator/steps/voice-input";
import { TextInput } from "@/components/navigator/steps/text-input";
import { CategoryBrowse } from "@/components/navigator/steps/category-browse";
import {
  AssistantStep,
  type AssistantError,
} from "@/components/navigator/steps/assistant-step";
import { ResultsStep } from "@/components/navigator/steps/results-step";
import { ReviewStep } from "@/components/navigator/steps/review-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
  | "intake"
  | "voice"
  | "problem"
  | "categories"
  | "assistant"
  | "results"
  | "review";

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

function getStepDefs(strings: ReturnType<typeof getStrings>) {
  return [
    { id: "intake", label: strings.steps.intake.title },
    { id: "assistant", label: strings.steps.assistant.title },
    { id: "results", label: strings.steps.results.title },
    { id: "review", label: strings.steps.review.title },
  ];
}

function NavigateContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as LanguageCode | null;

  const services = MOCK_SERVICES;

  const [language, setLanguage] = React.useState<LanguageCode>(
    langParam ?? "en",
  );
  const [step, setStep] = React.useState<StepId>("intake");

  const [intakeMethod, setIntakeMethod] = React.useState<
    "voice" | "type" | "categories" | null
  >(null);
  const [problemText, setProblemText] = React.useState("");
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [assistantError, setAssistantError] =
    React.useState<AssistantError | null>(null);
  const [candidates, setCandidates] = React.useState<MatchCandidate[]>([]);
  const [selectedServiceId, setSelectedServiceId] = React.useState<
    string | null
  >(null);
  const [checkedRequirements, setCheckedRequirements] = React.useState<
    Record<string, boolean>
  >({});
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  const strings = getStrings(language);
  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return findServiceById(services, selectedServiceId);
  }, [selectedServiceId, services]);

  // Compute which "main step" index we're on for the indicator
  const mainStepIndex = React.useMemo(() => {
    if (
      step === "intake" ||
      step === "voice" ||
      step === "problem" ||
      step === "categories"
    )
      return 0;
    if (step === "assistant") return 1;
    if (step === "results") return 2;
    if (step === "review") return 3;
    return 0;
  }, [step]);

  function goTo(next: StepId) {
    setStep(next);
  }

  function goToInput() {
    if (intakeMethod === "voice") goTo("voice");
    else if (intakeMethod === "categories") goTo("categories");
    else goTo("problem");
  }

  function goToReview() {
    setCheckedRequirements({});
    setRating(0);
    setComment("");
    setFeedbackSubmitted(false);
    goTo("review");
  }

  function submitProblem(text: string) {
    const cleaned = text.trim();
    setProblemText(cleaned);
    setAssistantError(null);

    if (cleaned.length < 3) {
      setDecision(null);
      setCandidates([]);
      setSelectedServiceId(null);
      setAssistantError({
        title: strings.assistant.failedTitle,
        message: strings.assistant.failedDesc,
      });
      goTo("assistant");
      return;
    }

    const nextDecision = decide({ services, input: cleaned, language });
    setDecision(nextDecision);

    if (nextDecision.mode === "clarify") {
      setCandidates([]);
      setSelectedServiceId(null);
      goTo("assistant");
      return;
    }

    setCandidates(nextDecision.candidates);
    setSelectedServiceId(nextDecision.candidates[0]?.service.id ?? null);
    goTo("results");
  }

  function resetFlow() {
    setStep("intake");
    setIntakeMethod(null);
    setProblemText("");
    setDecision(null);
    setAssistantError(null);
    setCandidates([]);
    setSelectedServiceId(null);
    setCheckedRequirements({});
    setRating(0);
    setComment("");
    setFeedbackSubmitted(false);
  }

  function handleBack() {
    switch (step) {
      case "voice":
      case "problem":
      case "categories":
        goTo("intake");
        break;
      case "assistant":
        goToInput();
        break;
      case "results":
        if (decision?.mode === "clarify") goTo("assistant");
        else goToInput();
        break;
      case "review":
        goTo("results");
        break;
      default:
        break;
    }
  }

  const showBack = step !== "intake";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader language={language} showHome />

      <main className="flex flex-1 flex-col">
        {/* Step indicator */}
        <div className="border-b border-border bg-background/80 py-3 px-4">
          <div className="mx-auto max-w-2xl">
            <StepIndicator
              steps={getStepDefs(strings)}
              currentIndex={mainStepIndex}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
            <div className="w-full">
              {step === "intake" && (
                <IntakeStep
                  strings={strings}
                  language={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang);
                    resetFlow();
                  }}
                  onPick={(method) => {
                    setIntakeMethod(method);
                    setProblemText("");
                    setDecision(null);
                    setAssistantError(null);
                    setCandidates([]);
                    setSelectedServiceId(null);
                    if (method === "voice") goTo("voice");
                    else if (method === "type") goTo("problem");
                    else goTo("categories");
                  }}
                />
              )}

              {step === "voice" && (
                <VoiceInput
                  language={language}
                  strings={strings}
                  value={problemText}
                  onChange={setProblemText}
                  onSubmit={() => submitProblem(problemText)}
                  onSwitchToTyping={() => {
                    setIntakeMethod("type");
                    goTo("problem");
                  }}
                />
              )}

              {step === "problem" && (
                <TextInput
                  strings={strings}
                  value={problemText}
                  onChange={setProblemText}
                  onSubmit={() => submitProblem(problemText)}
                />
              )}

              {step === "categories" && (
                <CategoryBrowse
                  strings={strings}
                  onPick={(hint) => {
                    setIntakeMethod("categories");
                    submitProblem(hint);
                  }}
                />
              )}

              {step === "assistant" && (
                <AssistantStep
                  strings={strings}
                  userText={problemText}
                  decision={decision}
                  error={assistantError}
                  onPickClarification={(serviceIds) => {
                    const next = candidatesFromServiceIds(services, serviceIds);
                    setCandidates(next);
                    setSelectedServiceId(next[0]?.service.id ?? null);
                    goTo("results");
                  }}
                  onRetry={() => {
                    setAssistantError(null);
                    goToInput();
                  }}
                  onStartOver={resetFlow}
                  onSwitchToTyping={
                    intakeMethod === "voice"
                      ? () => {
                          setAssistantError(null);
                          setIntakeMethod("type");
                          goTo("problem");
                        }
                      : undefined
                  }
                />
              )}

              {step === "results" && (
                <ResultsStep
                  strings={strings}
                  services={services}
                  candidates={candidates}
                  userText={problemText}
                  selectedId={selectedServiceId}
                  onSelect={(id) => {
                    setSelectedServiceId(id);
                  }}
                  onContinue={() => {
                    if (!selectedServiceId) return;
                    goToReview();
                  }}
                />
              )}

              {step === "review" && (
                <ReviewStep
                  strings={strings}
                  service={selectedService}
                  checked={checkedRequirements}
                  onCheckedChange={setCheckedRequirements}
                  rating={rating}
                  onRatingChange={setRating}
                  comment={comment}
                  onCommentChange={setComment}
                  submitted={feedbackSubmitted}
                  onSubmit={() => setFeedbackSubmitted(true)}
                  onStartOver={resetFlow}
                />
              )}
            </div>
          </div>

          {/* Bottom bar with back button */}
          {showBack && (
            <div className="border-t border-border bg-background/80 px-4 py-3">
              <div className="mx-auto max-w-2xl">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {strings.actions.back}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function NavigatePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          Loading...
        </div>
      }
    >
      <NavigateContent />
    </React.Suspense>
  );
}
