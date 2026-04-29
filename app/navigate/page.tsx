"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { IntakeStep } from "@/components/navigator/steps/intake-step";
import { VoiceInput } from "@/components/navigator/steps/voice-input";
import { TextInput } from "@/components/navigator/steps/text-input";
import { CategoryBrowse } from "@/components/navigator/steps/category-browse";
import { ClarifyStep } from "@/components/navigator/steps/clarify-step";
import { ResultsStep } from "@/components/navigator/steps/results-step";
import { ServiceDetail } from "@/components/navigator/steps/service-detail";
import { SuccessView } from "@/components/navigator/steps/success-view";
import { FeedbackStep } from "@/components/navigator/steps/feedback-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { decide } from "@/lib/service-navigator/engine";
import { getStrings } from "@/lib/service-navigator/strings";
import type { Decision, LanguageCode, MatchCandidate, Service } from "@/lib/service-navigator/types";
import { MOCK_SERVICES } from "@/lib/mock/services";

type StepId = "intake" | "voice" | "problem" | "categories" | "clarify" | "results" | "detail" | "success" | "feedback";

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

const STEP_ORDER: StepId[] = ["intake", "results", "detail", "success", "feedback"];

function getStepDefs(strings: ReturnType<typeof getStrings>) {
  return [
    { id: "intake", label: strings.steps.intake.title },
    { id: "results", label: strings.steps.results.title },
    { id: "detail", label: strings.steps.detail.title },
    { id: "success", label: strings.success.heading },
    { id: "feedback", label: strings.steps.feedback.title },
  ];
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function NavigatePage() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as LanguageCode | null;

  const services = MOCK_SERVICES;

  const [language, setLanguage] = React.useState<LanguageCode>(langParam ?? "en");
  const [step, setStep] = React.useState<StepId>("intake");
  const [direction, setDirection] = React.useState(1);

  const [intakeMethod, setIntakeMethod] = React.useState<"voice" | "type" | "categories" | null>(null);
  const [problemText, setProblemText] = React.useState("");
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [candidates, setCandidates] = React.useState<MatchCandidate[]>([]);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);
  const [checkedRequirements, setCheckedRequirements] = React.useState<Record<string, boolean>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  const strings = getStrings(language);
  const selectedService = React.useMemo(() => {
    if (!selectedServiceId) return null;
    return findServiceById(services, selectedServiceId);
  }, [selectedServiceId, services]);

  // Compute which "main step" index we're on for the indicator
  const mainStepIndex = React.useMemo(() => {
    if (step === "intake" || step === "voice" || step === "problem" || step === "categories") return 0;
    if (step === "clarify" || step === "results") return 1;
    if (step === "detail") return 2;
    if (step === "success") return 3;
    if (step === "feedback") return 4;
    return 0;
  }, [step]);

  function goTo(next: StepId) {
    const currentMainIdx = STEP_ORDER.indexOf(step) >= 0 ? STEP_ORDER.indexOf(step) : mainStepIndex;
    const nextMainIdx = STEP_ORDER.indexOf(next) >= 0 ? STEP_ORDER.indexOf(next) : mainStepIndex;
    setDirection(nextMainIdx >= currentMainIdx ? 1 : -1);
    setStep(next);
  }

  function submitProblem(text: string) {
    const cleaned = text.trim();
    setProblemText(cleaned);
    const nextDecision = decide({ services, input: cleaned, language });
    setDecision(nextDecision);

    if (nextDecision.mode === "clarify") {
      setCandidates([]);
      setSelectedServiceId(null);
      goTo("clarify");
      return;
    }

    setCandidates(nextDecision.candidates);
    if (nextDecision.reason === "high-confidence") {
      setSelectedServiceId(nextDecision.candidates[0]?.service.id ?? null);
    } else {
      setSelectedServiceId(null);
    }
    goTo("results");
  }

  function resetFlow() {
    setStep("intake");
    setDirection(-1);
    setIntakeMethod(null);
    setProblemText("");
    setDecision(null);
    setCandidates([]);
    setSelectedServiceId(null);
    setCheckedRequirements({});
    setFeedbackSubmitted(false);
  }

  function handleBack() {
    switch (step) {
      case "voice":
      case "problem":
      case "categories":
        goTo("intake");
        break;
      case "clarify":
        if (intakeMethod === "voice") goTo("voice");
        else if (intakeMethod === "categories") goTo("categories");
        else goTo("problem");
        break;
      case "results":
        if (decision?.mode === "clarify") goTo("clarify");
        else if (intakeMethod === "voice") goTo("voice");
        else if (intakeMethod === "categories") goTo("categories");
        else goTo("problem");
        break;
      case "detail":
        goTo("results");
        break;
      case "success":
        goTo("detail");
        break;
      case "feedback":
        goTo("success");
        break;
      default:
        break;
    }
  }

  const showBack = step !== "intake";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader
        language={language}
        showHome
        onLanguageChange={(lang) => {
          setLanguage(lang);
          resetFlow();
        }}
      />

      <main className="flex flex-1 flex-col">
        {/* Step indicator */}
        <div className="border-b border-border bg-background/80 py-3 px-4">
          <div className="mx-auto max-w-2xl">
            <StepIndicator steps={getStepDefs(strings)} currentIndex={mainStepIndex} />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {step === "intake" && (
                  <IntakeStep
                    strings={strings}
                    onPick={(method) => {
                      setIntakeMethod(method);
                      setProblemText("");
                      setDecision(null);
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

                {step === "clarify" && decision && (
                  <ClarifyStep
                    strings={strings}
                    decision={decision}
                    onPick={(serviceIds) => {
                      const next = candidatesFromServiceIds(services, serviceIds);
                      setCandidates(next);
                      setSelectedServiceId(next[0]?.service.id ?? null);
                      goTo("results");
                    }}
                  />
                )}

                {step === "results" && (
                  <ResultsStep
                    strings={strings}
                    candidates={candidates}
                    userText={problemText}
                    selectedId={selectedServiceId}
                    onSelect={(id) => {
                      setSelectedServiceId(id);
                      setCheckedRequirements({});
                      goTo("detail");
                    }}
                  />
                )}

                {step === "detail" && (
                  <ServiceDetail
                    strings={strings}
                    service={selectedService}
                    checked={checkedRequirements}
                    onCheckedChange={setCheckedRequirements}
                    onReady={() => goTo("success")}
                  />
                )}

                {step === "success" && (
                  <SuccessView
                    strings={strings}
                    service={selectedService}
                    checkedCount={selectedService ? selectedService.requirements.filter((r) => checkedRequirements[r]).length : 0}
                    totalCount={selectedService?.requirements.length ?? 0}
                    onFeedback={() => goTo("feedback")}
                    onStartOver={resetFlow}
                  />
                )}

                {step === "feedback" && (
                  <FeedbackStep
                    strings={strings}
                    submitted={feedbackSubmitted}
                    onSubmit={() => setFeedbackSubmitted(true)}
                    onStartOver={resetFlow}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
