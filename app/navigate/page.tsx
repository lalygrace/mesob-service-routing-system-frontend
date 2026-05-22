"use client";

/**
 * NavigatePage — Citizen AI Navigation Flow
 *
 * Three input paths:
 *   1. Voice  — MediaRecorder → backend STT → addis.ai NLP → match
 *   2. Text   — typed input → backend NLP → addis.ai → match
 *   3. Browse — list organizations → list services → direct result (no AI)
 *
 * Features wired here:
 *   - Rich service detail (organization, location, fee, steps, checklist)
 *   - TTS playback after AI clarification and success responses
 *   - "Not what I need" escape hatch on the result page
 *   - addis.ai unavailability detection → Browse by Organization fallback prompt
 *   - Kiosk idle timeout (reads kiosk_idle_timeout_seconds from SystemConfig)
 */

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import {
  FullscreenToggle,
  useFullscreenStatus,
} from "@/components/layout/fullscreen-toggle";
import { StepIndicator } from "@/components/layout/step-indicator";
import { LanguageStep } from "@/components/navigator/steps/language-step";
import {
  IntakeStep,
  type IntakeMethod,
} from "@/components/navigator/steps/intake-step";
import { VoiceInput } from "@/components/navigator/steps/voice-input";
import { TextInput } from "@/components/navigator/steps/text-input";
import {
  AssistantStep,
  type AssistantError,
  type AiClarifyOption,
} from "@/components/navigator/steps/assistant-step";
import { OrganizationBrowse } from "@/components/navigator/steps/organization-browse";
import { ResultsStep } from "@/components/navigator/steps/results-step";
import { ReviewStep } from "@/components/navigator/steps/review-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { getStrings } from "@/lib/service-navigator/strings";
import { useTtsPlayback } from "@/lib/hooks/use-tts-playback";
import { useIdleTimeout } from "@/lib/hooks/use-idle-timeout";
import type {
  Decision,
  LanguageCode,
  Service,
} from "@/lib/service-navigator/types";
import type { RichServiceDetail } from "@/lib/api/citizen";
import {
  completeCitizenSession,
  createCitizenInteraction,
  createCitizenSession,
  selectCitizenService,
  submitCitizenFeedback,
} from "@/lib/api/citizen";
import { listPublicServices } from "@/lib/api/services";
import { getApiErrorMessage, ApiError } from "@/lib/api/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId =
  | "language"
  | "intake"
  | "voice"
  | "case"
  | "browse"
  | "assistant"
  | "results"
  | "review";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findServiceById(services: Service[], id: string): Service | null {
  return services.find((s) => s.id === id) ?? null;
}

/**
 * Converts a RichServiceDetail into the flat Service shape that ReviewStep
 * expects. Used when the AI matched a service that isn't in the local catalog
 * (e.g. catalog hasn't loaded yet, or service was added after page load).
 */
function richServiceToFlat(rich: RichServiceDetail): Service {
  const locationParts = [
    rich.location.floor,
    rich.location.room,
    rich.location.counter,
  ].filter(Boolean);

  return {
    id: rich.id,
    title: rich.name,
    organization: rich.organization.name,
    locationHint: locationParts.join(" · "),
    feeHint:
      rich.feeDescription ??
      (rich.feeAmount != null ? `${rich.feeAmount} ETB` : ""),
    durationHint:
      rich.processingTimeDays != null
        ? rich.processingTimeDays <= 0
          ? "Same day"
          : rich.processingTimeDays === 1
            ? "1 day"
            : `${rich.processingTimeDays} days`
        : "",
    requirements: rich.requirements.map((r) => r.label),
    workflowSteps: rich.steps.map((s) => s.title),
    topicId: "id",
    keywords: { am: [], en: [], om: [] },
  };
}

function getStepDefs(strings: ReturnType<typeof getStrings>) {
  return [
    { id: "language", label: strings.landing.selectLanguage },
    { id: "help", label: strings.intake.heading },
    { id: "requirements", label: strings.detail.requirements },
    { id: "details", label: strings.detail.heading },
  ];
}

/**
 * Detects whether an error is an addis.ai service unavailability.
 * Network failures, 5xx, and 429 from the AI endpoint all qualify.
 */
function isAiUnavailable(err: unknown): boolean {
  if (err instanceof ApiError) {
    return err.status === 503 || err.status === 502 || err.status === 429;
  }
  // Network-level failure (fetch threw)
  if (
    err instanceof TypeError &&
    (err.message.includes("fetch") || err.message.includes("network"))
  ) {
    return true;
  }
  return false;
}

// ─── AI Unavailable Banner ────────────────────────────────────────────────────

function AiUnavailableBanner({
  strings,
  onBrowse,
  onRetry,
}: {
  strings: ReturnType<typeof getStrings>;
  onBrowse: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          AI assistant is temporarily unavailable
        </p>
        <p className="text-sm text-muted-foreground">
          The AI service is not responding right now. You can still find your
          service by browsing the organization list directly — no AI needed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={onBrowse} size="lg" className="rounded-xl h-12 gap-2">
          <Building2 className="h-4 w-4" />
          Browse by Organization
        </Button>
        <Button
          variant="outline"
          onClick={onRetry}
          size="lg"
          className="rounded-xl h-12"
        >
          {strings.actions.tryAgain}
        </Button>
      </div>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function NavigateContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as LanguageCode | null;

  const initialLanguage: LanguageCode =
    langParam === "am" || langParam === "om" || langParam === "en"
      ? langParam
      : "en";

  // ── Core state ──────────────────────────────────────────────────────────────
  const [language, setLanguage] = React.useState<LanguageCode>(initialLanguage);
  const [step, setStep] = React.useState<StepId>("language");
  const [intakeMethod, setIntakeMethod] = React.useState<IntakeMethod | null>(
    null,
  );

  // ── Service catalog (AI path) ────────────────────────────────────────────────
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = React.useState(false);

  // ── Session tracking ─────────────────────────────────────────────────────────
  const [citizenSessionId, setCitizenSessionId] = React.useState<string | null>(
    null,
  );
  const [sessionCount, setSessionCount] = React.useState(0);

  // ── Input state ──────────────────────────────────────────────────────────────
  const [caseText, setCaseText] = React.useState("");

  // ── AI response state ────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [assistantError, setAssistantError] =
    React.useState<AssistantError | null>(null);
  const [aiUnavailable, setAiUnavailable] = React.useState(false);
  const [aiQuestion, setAiQuestion] = React.useState<string | null>(null);
  const [aiOptions, setAiOptions] = React.useState<AiClarifyOption[] | null>(
    null,
  );
  const [decision, setDecision] = React.useState<Decision | null>(null);

  // ── Result state ─────────────────────────────────────────────────────────────
  // `selectedService` is the flat catalog entry (always available)
  // `richService` is the structured detail from selectCitizenService (AI path)
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null,
  );
  const [richService, setRichService] =
    React.useState<RichServiceDetail | null>(null);
  const [checkedRequirements, setCheckedRequirements] = React.useState<
    Record<string, boolean>
  >({});
  const [rating, setRating] = React.useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const ttsPlayback = useTtsPlayback();

  const strings = getStrings(language);
  const isFullscreen = useFullscreenStatus();

  // ── Idle timeout — disabled on language/review steps ─────────────────────────
  useIdleTimeout({
    enabled: step !== "language" && step !== "review",
    onTimeout: () => {
      resetFlow();
      toast.info("Session reset due to inactivity.");
    },
  });

  // ── Load service catalog ─────────────────────────────────────────────────────
  React.useEffect(() => {
    let mounted = true;
    setIsLoadingServices(true);

    listPublicServices(language)
      .then((data) => {
        if (mounted) setServices(data);
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, "Failed to load service catalog"));
        if (mounted) setServices([]);
      })
      .finally(() => {
        if (mounted) setIsLoadingServices(false);
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  // ── Step indicator index ─────────────────────────────────────────────────────
  const mainStepIndex = React.useMemo(() => {
    if (step === "language") return 0;
    if (["intake", "voice", "case", "browse", "assistant"].includes(step))
      return 1;
    if (step === "results") return 2;
    if (step === "review") return 3;
    return 0;
  }, [step]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  function goTo(next: StepId) {
    setStep(next);
  }

  function goToInput() {
    if (intakeMethod === "voice") goTo("voice");
    else if (intakeMethod === "browse") goTo("browse");
    else goTo("case");
  }

  // ── Session helpers ──────────────────────────────────────────────────────────
  async function ensureCitizenSession(rawInput?: string): Promise<string> {
    if (citizenSessionId) return citizenSessionId;

    const inputMode =
      intakeMethod === "voice"
        ? "voice"
        : intakeMethod === "browse"
          ? "category_select"
          : "text";

    const session = await createCitizenSession({
      lang: language,
      inputMode,
      rawInput,
      deviceType: "kiosk",
    });

    setCitizenSessionId(session.id);
    return session.id;
  }

  async function recordServiceSelection(
    serviceId: string,
    sessionId: string | null,
  ) {
    if (!sessionId) return null;
    try {
      const result = await selectCitizenService(sessionId, serviceId);
      return result.service ?? null;
    } catch {
      return null;
    }
  }

  // ── AI submission (voice + text paths) ──────────────────────────────────────
  async function submitCase(text: string) {
    const cleaned = text.trim();
    setCaseText(cleaned);
    setAssistantError(null);
    setAiUnavailable(false);
    setAiQuestion(null);
    setAiOptions(null);
    setDecision(null);

    if (cleaned.length < 3) {
      setAssistantError({
        title: strings.assistant.failedTitle,
        message: strings.assistant.failedDesc,
      });
      goTo("assistant");
      return;
    }

    setIsAiLoading(true);
    goTo("assistant");

    try {
      const sessionId = await ensureCitizenSession(cleaned);
      const result = await createCitizenInteraction(sessionId, {
        userInput: cleaned,
        inputMode: intakeMethod === "voice" ? "voice" : "text",
      });

      setIsAiLoading(false);

      if (result.systemAction === "ASK_CLARIFICATION") {
        setAiQuestion(result.message);
        setAiOptions(result.options || null);
        // Use ttsText from Gemini if available (voice mode only, am/om only)
        if (intakeMethod === "voice" && result.ttsText && (language === "am" || language === "om")) {
          ttsPlayback.playText(result.ttsText, language);
        }
        return;
      }

      if (!result.matches || result.matches.length === 0) {
        setAssistantError({
          title: strings.assistant.failedTitle,
          message: result.message || strings.assistant.failedDesc,
        });
        return;
      }

      // Success — fetch rich detail via selectCitizenService
      const topMatch = result.matches[0];
      const flatService = findServiceById(services, topMatch.serviceId);

      const rich = await recordServiceSelection(topMatch.serviceId, sessionId);
      setRichService(rich);
      // flatService may be null if the catalog hasn't loaded yet — that's fine,
      // ResultsStep will use richService instead
      setSelectedService(flatService);
      setCheckedRequirements({});

      // Use ttsText from Gemini if available (voice mode only, am/om only)
      if (intakeMethod === "voice" && result.ttsText && (language === "am" || language === "om")) {
        ttsPlayback.playText(result.ttsText, language);
      }

      goTo("results");
    } catch (err) {
      setIsAiLoading(false);

      if (isAiUnavailable(err)) {
        // AI is down — show the fallback banner
        setAiUnavailable(true);
        return;
      }

      setAssistantError({
        title: strings.assistant.failedTitle,
        message: getApiErrorMessage(err, strings.assistant.failedDesc),
      });
    }
  }

  // ── Clarification follow-up ──────────────────────────────────────────────────
  async function submitClarification(answer: string) {
    const cleaned = answer.trim();
    if (!cleaned || !citizenSessionId) return;

    setAssistantError(null);
    setAiUnavailable(false);
    setAiQuestion(null);
    setAiOptions(null);
    setIsAiLoading(true);

    try {
      const result = await createCitizenInteraction(citizenSessionId, {
        userInput: cleaned,
        inputMode: "text",
      });

      setIsAiLoading(false);

      if (result.systemAction === "ASK_CLARIFICATION") {
        setAiQuestion(result.message);
        setAiOptions(result.options || null);
        // Use ttsText from Gemini if available (voice mode only, am/om only)
        if (intakeMethod === "voice" && result.ttsText && (language === "am" || language === "om")) {
          ttsPlayback.playText(result.ttsText, language);
        }
        return;
      }

      if (!result.matches || result.matches.length === 0) {
        setAssistantError({
          title: strings.assistant.failedTitle,
          message: result.message || strings.assistant.failedDesc,
        });
        return;
      }

      const topMatch = result.matches[0];
      const flatService = findServiceById(services, topMatch.serviceId);
      const rich = await recordServiceSelection(
        topMatch.serviceId,
        citizenSessionId,
      );

      setRichService(rich);
      // flatService may be null if catalog hasn't loaded — richService covers it
      setSelectedService(flatService);
      setCheckedRequirements({});

      // Use ttsText from Gemini if available (voice mode only, am/om only)
      if (intakeMethod === "voice" && result.ttsText && (language === "am" || language === "om")) {
        ttsPlayback.playText(result.ttsText, language);
      }

      goTo("results");
    } catch (err) {
      setIsAiLoading(false);
      if (isAiUnavailable(err)) {
        setAiUnavailable(true);
        return;
      }
      setAssistantError({
        title: strings.assistant.failedTitle,
        message: getApiErrorMessage(err, strings.assistant.failedDesc),
      });
    }
  }

  // ── Browse path (no AI) ──────────────────────────────────────────────────────
  async function handleBrowseServiceSelected(service: Service) {
    setSelectedService(service);
    setRichService(null); // browse path uses flat service only
    setCheckedRequirements({});

    try {
      const sessionId = await ensureCitizenSession();
      await recordServiceSelection(service.id, sessionId);
    } catch {
      // Non-critical
    }

    goTo("results");
  }

  // ── Feedback & completion ────────────────────────────────────────────────────
  async function submitFeedback(nextRating: number) {
    setFeedbackSubmitted(true);
    if (!citizenSessionId) return;

    try {
      await submitCitizenFeedback(citizenSessionId, {
        serviceId: selectedService?.id,
        wasHelpful: nextRating >= 3,
        rating: nextRating,
      });
      await completeCitizenSession(citizenSessionId, true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit feedback"));
    }
  }

  // ── Full session reset ────────────────────────────────────────────────────────
  function resetFlow() {
    ttsPlayback.stop();
    setSessionCount((c) => c + 1);
    setStep("language");
    setIntakeMethod(null);
    setCaseText("");
    setDecision(null);
    setAssistantError(null);
    setAiUnavailable(false);
    setAiQuestion(null);
    setAiOptions(null);
    setSelectedService(null);
    setRichService(null);
    setCitizenSessionId(null);
    setCheckedRequirements({});
    setRating(0);
    setFeedbackSubmitted(false);
    setIsAiLoading(false);
  }

  // ── Back navigation ───────────────────────────────────────────────────────────
  function handleBack() {
    ttsPlayback.stop();
    switch (step) {
      case "intake":
        goTo("language");
        break;
      case "voice":
      case "case":
      case "browse":
        goTo("intake");
        break;
      case "assistant":
        goToInput();
        break;
      case "results":
        if (intakeMethod === "browse") goTo("browse");
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

  // ─── Render ──────────────────────────────────────────────────────────────────
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
                    onLanguageChange={(lang) => {
                      setLanguage(lang);
                      setCitizenSessionId(null);
                      goTo("intake");
                    }}
                  />
                )}

                {isLoadingServices &&
                  !["language", "intake"].includes(step) && (
                    <div className="mb-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      Loading service catalog…
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
                      setAiUnavailable(false);
                      setAiQuestion(null);
                      setAiOptions(null);
                      setSelectedService(null);
                      setRichService(null);
                      if (method === "voice") goTo("voice");
                      else if (method === "browse") goTo("browse");
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

                {step === "browse" && (
                  <OrganizationBrowse
                    language={language}
                    strings={strings}
                    onServiceSelected={handleBrowseServiceSelected}
                  />
                )}

                {step === "assistant" && (
                  <>
                    {/* Item 4 — AI unavailable fallback */}
                    {aiUnavailable ? (
                      <AiUnavailableBanner
                        strings={strings}
                        onBrowse={() => {
                          setAiUnavailable(false);
                          setIntakeMethod("browse");
                          goTo("browse");
                        }}
                        onRetry={() => {
                          setAiUnavailable(false);
                          goToInput();
                        }}
                      />
                    ) : (
                      <AssistantStepWithClarify
                        strings={strings}
                        caseText={caseText}
                        decision={decision}
                        assistantError={assistantError}
                        isAiLoading={isAiLoading}
                        aiQuestion={aiQuestion}
                        aiOptions={aiOptions}
                        intakeMethod={intakeMethod}
                        onPickClarification={async (serviceIds) => {
                          const service = findServiceById(
                            services,
                            serviceIds[0] ?? "",
                          );
                          if (!service) return;
                          const rich = await recordServiceSelection(
                            service.id,
                            citizenSessionId,
                          );
                          setRichService(rich);
                          setSelectedService(service);
                          setCheckedRequirements({});
                          goTo("results");
                        }}
                        onPickAiOption={(value) => submitClarification(value)}
                        onRetry={() => {
                          setAssistantError(null);
                          setAiQuestion(null);
                          setAiOptions(null);
                          goToInput();
                        }}
                        onStartOver={resetFlow}
                        onSwitchToTyping={
                          intakeMethod === "voice"
                            ? () => {
                                setAssistantError(null);
                                setAiQuestion(null);
                                setAiOptions(null);
                                setIntakeMethod("type");
                                goTo("case");
                              }
                            : undefined
                        }
                        onClarificationSubmit={submitClarification}
                      />
                    )}
                  </>
                )}

                {step === "results" && (
                  <ResultsStep
                    strings={strings}
                    service={selectedService}
                    richService={richService}
                    checked={checkedRequirements}
                    onCheckedChange={setCheckedRequirements}
                    onContinue={() => {
                      setRating(0);
                      setFeedbackSubmitted(false);
                      goTo("review");
                    }}
                    // Item 3 — "Not what I need" sends citizen back to intake
                    onNotMyService={() => {
                      setSelectedService(null);
                      setRichService(null);
                      setCheckedRequirements({});
                      setDecision(null);
                      setAssistantError(null);
                      setAiQuestion(null);
                      setAiOptions(null);
                      setCaseText("");
                      goTo("intake");
                    }}
                  />
                )}

                {step === "review" && (
                  <ReviewStep
                    strings={strings}
                    service={
                      selectedService ??
                      (richService ? richServiceToFlat(richService) : null)
                    }
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

// ─── AssistantStepWithClarify ─────────────────────────────────────────────────
// Thin wrapper that adds an inline text input for open clarification questions.

function AssistantStepWithClarify({
  strings,
  caseText,
  decision,
  assistantError,
  isAiLoading,
  aiQuestion,
  aiOptions,
  intakeMethod,
  onPickClarification,
  onPickAiOption,
  onRetry,
  onStartOver,
  onSwitchToTyping,
  onClarificationSubmit,
}: {
  strings: ReturnType<typeof getStrings>;
  caseText: string;
  decision: Decision | null;
  assistantError: AssistantError | null;
  isAiLoading: boolean;
  aiQuestion: string | null;
  aiOptions: AiClarifyOption[] | null;
  intakeMethod: IntakeMethod | null;
  onPickClarification: (serviceIds: string[]) => void;
  onPickAiOption: (value: string) => void;
  onRetry: () => void;
  onStartOver: () => void;
  onSwitchToTyping?: () => void;
  onClarificationSubmit: (answer: string) => void;
}) {
  const [clarifyText, setClarifyText] = React.useState("");

  React.useEffect(() => {
    setClarifyText("");
  }, [aiQuestion]);

  const showClarifyInput =
    !isAiLoading &&
    !assistantError &&
    aiQuestion &&
    (!aiOptions || aiOptions.length === 0);

  return (
    <div className="space-y-4">
      <AssistantStep
        strings={strings}
        userText={caseText}
        decision={decision}
        error={assistantError}
        isLoading={isAiLoading}
        aiQuestion={aiQuestion}
        aiOptions={aiOptions}
        onPickClarification={onPickClarification}
        onPickAiOption={onPickAiOption}
        onRetry={onRetry}
        onStartOver={onStartOver}
        onSwitchToTyping={onSwitchToTyping}
      />

      {showClarifyInput && (
        <div className="space-y-3">
          <textarea
            value={clarifyText}
            onChange={(e) => setClarifyText(e.target.value)}
            placeholder="Type your answer here…"
            className="w-full min-h-20 rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                clarifyText.trim().length >= 2
              ) {
                e.preventDefault();
                onClarificationSubmit(clarifyText);
              }
            }}
          />
          <Button
            onClick={() => onClarificationSubmit(clarifyText)}
            disabled={clarifyText.trim().length < 2}
            size="lg"
            className="w-full rounded-xl h-12"
          >
            {strings.actions.continue}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function NavigatePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          Loading…
        </div>
      }
    >
      <NavigateContent />
    </React.Suspense>
  );
}
