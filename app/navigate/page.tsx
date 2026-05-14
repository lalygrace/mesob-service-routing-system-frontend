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
import {
  completeCitizenSession,
  createCitizenInteraction,
  createCitizenSession,
  matchesToServices,
  selectCitizenService,
  submitCitizenFeedback,
} from "@/lib/api/citizen";
import { listPublicServices } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

type StepId =
  | "language"
  | "intake"
  | "voice"
  | "case"
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

  const initialLanguage: LanguageCode =
    langParam === "am" || langParam === "om" || langParam === "en"
      ? langParam
      : "en";

  const [language, setLanguage] = React.useState<LanguageCode>(initialLanguage);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = React.useState(false);
  const [citizenSessionId, setCitizenSessionId] = React.useState<string | null>(
    null,
  );
  const [step, setStep] = React.useState<StepId>("language");

  const [intakeMethod, setIntakeMethod] = React.useState<
    "voice" | "type" | null
  >(null);
  const [caseText, setCaseText] = React.useState("");
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
  const [sessionCount, setSessionCount] = React.useState(0);

  const strings = getStrings(language);
  const isFullscreen = useFullscreenStatus();
  React.useEffect(() => {
    let mounted = true;

    async function loadServices() {
      setIsLoadingServices(true);
      try {
        const data = await listPublicServices(language);
        if (mounted) setServices(data);
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Failed to load service catalog"),
        );
        if (mounted) setServices([]);
      } finally {
        if (mounted) setIsLoadingServices(false);
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, [language]);

  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return findServiceById(services, selectedServiceId);
  }, [selectedServiceId, services]);

  // Compute which "main step" index we're on for the indicator
  const mainStepIndex = React.useMemo(() => {
    if (step === "language") return 0;
    if (step === "intake" || step === "voice" || step === "case") return 1;
    if (step === "assistant") return 1;
    if (step === "results") return 2;
    if (step === "review") return 3;
    return 0;
  }, [step]);

  function goTo(next: StepId) {
    setStep(next);
  }

  async function ensureCitizenSession(rawInput?: string) {
    if (citizenSessionId) return citizenSessionId;

    const session = await createCitizenSession({
      lang: language,
      inputMode: intakeMethod === "voice" ? "voice" : "text",
      rawInput,
      deviceType: "kiosk",
    });

    setCitizenSessionId(session.id);
    return session.id;
  }

  async function selectServiceForSession(
    serviceId: string,
    sessionId = citizenSessionId,
  ) {
    if (!sessionId) return;

    try {
      await selectCitizenService(sessionId, serviceId);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to record selected service"),
      );
    }
  }

  function goToInput() {
    if (intakeMethod === "voice") goTo("voice");
    else goTo("case");
  }

  function goToReview() {
    setRating(0);
    setFeedbackSubmitted(false);
    goTo("review");
  }

  async function submitCase(text: string) {
    const cleaned = text.trim();
    setCaseText(cleaned);
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

    if (services.length === 0) {
      setDecision(null);
      setSelectedServiceId(null);
      setAssistantError({
        title: strings.assistant.failedTitle,
        message: "The service catalog is not available yet. Please try again.",
      });
      goTo("assistant");
      return;
    }

    try {
      const sessionId = await ensureCitizenSession(cleaned);
      const result = await createCitizenInteraction(sessionId, {
        userInput: cleaned,
        inputMode: intakeMethod === "voice" ? "voice" : "text",
      });

      const candidates = matchesToServices(result.matches, services);

      if (candidates.length === 0) {
        setDecision(null);
        setSelectedServiceId(null);
        setAssistantError({
          title: strings.assistant.failedTitle,
          message: result.message || strings.assistant.failedDesc,
        });
        goTo("assistant");
        return;
      }

      const nextDecision: Decision = {
        mode: "suggest",
        candidates,
        reason: "high-confidence",
      };

      const serviceId = candidates[0]?.service.id ?? null;
      setDecision(nextDecision);
      setCheckedRequirements({});
      setSelectedServiceId(serviceId);
      if (serviceId) await selectServiceForSession(serviceId, sessionId);
      goTo("results");
    } catch (error) {
      const fallbackDecision = decide({ services, input: cleaned, language });
      setDecision(fallbackDecision);

      if (fallbackDecision.mode === "clarify") {
        setSelectedServiceId(null);
        toast.error(
          getApiErrorMessage(
            error,
            "Backend routing failed. Using local clarification.",
          ),
        );
        goTo("assistant");
        return;
      }

      setCheckedRequirements({});
      setSelectedServiceId(fallbackDecision.candidates[0]?.service.id ?? null);
      toast.error(
        getApiErrorMessage(
          error,
          "Backend routing failed. Using local matching.",
        ),
      );
      goTo("results");
    }
  }

  async function submitFeedback(nextRating: number) {
    setFeedbackSubmitted(true);

    if (!citizenSessionId) return;

    try {
      await submitCitizenFeedback(citizenSessionId, {
        serviceId: selectedServiceId ?? undefined,
        wasHelpful: nextRating >= 3,
        rating: nextRating,
      });
      await completeCitizenSession(citizenSessionId, true);
      toast.success("Feedback submitted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to submit feedback"));
    }
  }

  function resetFlow() {
    setSessionCount((c) => c + 1);
    setStep("language");
    setIntakeMethod(null);
    setCaseText("");
    setDecision(null);
    setAssistantError(null);
    setSelectedServiceId(null);
    setCitizenSessionId(null);
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
      case "case":
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
                      setCitizenSessionId(null);
                      goTo("intake");
                    }}
                  />
                )}

                {isLoadingServices && step !== "language" && (
                  <div className="mb-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    Loading service catalog...
                  </div>
                )}

                {step === "intake" && (
                  <IntakeStep
                    strings={strings}
                    onPick={(method) => {
                      setIntakeMethod(method);
                      setCaseText("");
                      setDecision(null);
                      setAssistantError(null);
                      setSelectedServiceId(null);
                      if (method === "voice") goTo("voice");
                      else goTo("case");
                    }}
                  />
                )}

                {step === "voice" && (
                  <VoiceInput
                    language={language}
                    strings={strings}
                    value={caseText}
                    onChange={setCaseText}
                    onSubmit={() => submitCase(caseText)}
                    onSwitchToTyping={() => {
                      setIntakeMethod("type");
                      goTo("case");
                    }}
                  />
                )}

                {step === "case" && (
                  <TextInput
                    strings={strings}
                    value={caseText}
                    onChange={setCaseText}
                    onSubmit={() => submitCase(caseText)}
                    onSwitchToVoice={() => {
                      setIntakeMethod("voice");
                      goTo("voice");
                    }}
                  />
                )}

                {step === "assistant" && (
                  <AssistantStep
                    strings={strings}
                    userText={caseText}
                    decision={decision}
                    error={assistantError}
                    onPickClarification={async (serviceIds) => {
                      const next = candidatesFromServiceIds(
                        services,
                        serviceIds,
                      );
                      const serviceId = next[0]?.service.id ?? null;
                      setCheckedRequirements({});
                      setSelectedServiceId(serviceId);
                      if (serviceId) await selectServiceForSession(serviceId);
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
                            goTo("case");
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
                    onSubmit={submitFeedback}
                    onStartOver={resetFlow}
                    sessionCount={sessionCount}
                    language={language}
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
