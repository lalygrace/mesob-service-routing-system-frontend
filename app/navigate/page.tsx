"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import {
  FullscreenToggle,
  useFullscreenStatus,
} from "@/components/layout/fullscreen-toggle";
import { StepIndicator } from "@/components/layout/step-indicator";
import { LanguageStep } from "@/components/navigator/steps/language-step";
import { IntakeStep } from "@/components/navigator/steps/intake-step";
import { VoiceInput } from "@/components/navigator/steps/voice-input";
import { TextInput } from "@/components/navigator/steps/text-input";
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
  | "language"
  | "intake"
  | "voice"
  | "problem"
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
    { id: "language", label: strings.landing.selectLanguage },
    { id: "help", label: strings.intake.heading },
    { id: "requirements", label: strings.detail.requirements },
    { id: "details", label: strings.detail.heading },
  ];
}

function NavigateContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as LanguageCode | null;

  const services = MOCK_SERVICES;
  const initialLanguage: LanguageCode =
    langParam === "am" || langParam === "om" || langParam === "en"
      ? langParam
      : "en";

  const [language, setLanguage] = React.useState<LanguageCode>(initialLanguage);
  const [step, setStep] = React.useState<StepId>("language");

  const [intakeMethod, setIntakeMethod] = React.useState<
    "voice" | "type" | null
  >(null);
  const [problemText, setProblemText] = React.useState("");
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [assistantError, setAssistantError] =
    React.useState<AssistantError | null>(null);

  const [selectedServiceId, setSelectedServiceId] = React.useState<
    string | null
  >(null);
  const [checkedRequirements, setCheckedRequirements] = React.useState<
    Record<string, boolean>
  >({});
  const [rating, setRating] = React.useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  const strings = getStrings(language);
  const isFullscreen = useFullscreenStatus();
  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return findServiceById(services, selectedServiceId);
  }, [selectedServiceId, services]);

  // Compute which "main step" index we're on for the indicator
  const mainStepIndex = React.useMemo(() => {
    if (step === "language") return 0;
    if (step === "intake" || step === "voice" || step === "problem") return 1;
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
    else goTo("problem");
  }

  function goToReview() {
    setRating(0);
    setFeedbackSubmitted(false);
    goTo("review");
  }

  function submitProblem(text: string) {
    const cleaned = text.trim();
    setProblemText(cleaned);
    setAssistantError(null);

    if (cleaned.length < 3) {
      setDecision(null);
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
      setSelectedServiceId(null);
      goTo("assistant");
      return;
    }

    setCheckedRequirements({});
    setSelectedServiceId(nextDecision.candidates[0]?.service.id ?? null);
    goTo("results");
  }

  function resetFlow() {
    setStep("language");
    setIntakeMethod(null);
    setProblemText("");
    setDecision(null);
    setAssistantError(null);
    setSelectedServiceId(null);
    setCheckedRequirements({});
    setRating(0);
    setFeedbackSubmitted(false);
  }

  function handleBack() {
    switch (step) {
      case "intake":
        goTo("language");
        break;
      case "voice":
      case "problem":
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

  const showBack = step !== "language";

  return (
    <div className="flex min-h-dvh flex-col bg-transparent">
      {!isFullscreen && <AppHeader language={language} showHome />}
      {isFullscreen && (
        <div className="fixed right-4 top-4 z-50 rounded-full border border-border bg-background/95">
          <FullscreenToggle />
        </div>
      )}

      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-5xl h-[85vh] min-h-[600px] max-h-[900px] rounded-3xl overflow-hidden flex flex-col">
          {/* Step indicator */}
          <div className="border-b border-white/10 dark:border-white/5 bg-background/20 backdrop-blur-md py-4 px-6 shrink-0">
            <div className="mx-auto max-w-4xl">
              <StepIndicator
                steps={getStepDefs(strings)}
                currentIndex={mainStepIndex}
              />
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col bg-transparent overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
              <div className="w-full">
                {step === "language" && (
                  <LanguageStep
                    strings={strings}
                    language={language}
                    onLanguageChange={(nextLanguage) => {
                      setLanguage(nextLanguage);
                      goTo("intake");
                    }}
                  />
                )}

                {step === "intake" && (
                  <IntakeStep
                    strings={strings}
                    onPick={(method) => {
                      setIntakeMethod(method);
                      setProblemText("");
                      setDecision(null);
                      setAssistantError(null);
                      setSelectedServiceId(null);
                      if (method === "voice") goTo("voice");
                      else goTo("problem");
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
                    onSwitchToVoice={() => {
                      setIntakeMethod("voice");
                      goTo("voice");
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
                      setCheckedRequirements({});
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
                    service={selectedService}
                    checked={checkedRequirements}
                    onCheckedChange={setCheckedRequirements}
                    onContinue={goToReview}
                  />
                )}

                {step === "review" && (
                  <ReviewStep
                    strings={strings}
                    service={selectedService}
                    checked={checkedRequirements}
                    rating={rating}
                    onRatingChange={setRating}
                    submitted={feedbackSubmitted}
                    onSubmit={() => setFeedbackSubmitted(true)}
                    onStartOver={resetFlow}
                  />
                )}
              </div>
            </div>

            {/* Bottom bar with back button */}
            {showBack && (
              <div className="border-t border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-md px-6 py-4">
                <div className="mx-auto max-w-4xl">
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
