"use client";

import * as React from "react";
import { Mic, MicOff, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = {
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function langCode(language: LanguageCode): string {
  switch (language) {
    case "am":
      return "am-ET";
    case "om":
      return "om-ET";
    default:
      return "en-US";
  }
}

function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function VoiceInput({
  language,
  strings,
  value,
  onChange,
  onSubmit,
  onSwitchToTyping,
}: {
  language: LanguageCode;
  strings: Strings;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSwitchToTyping: () => void;
}) {
  const ctor = getSpeechCtor();
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const intervalRef = React.useRef<number | null>(null);
  const startedAtRef = React.useRef<number | null>(null);
  const baseTextRef = React.useRef("");

  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const supported = Boolean(ctor);

  React.useEffect(() => {
    if (!ctor) return;
    const recognition = new ctor();
    recognition.lang = langCode(language);
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i]?.[0]?.transcript ?? "";
      }
      const next = transcript.trim();
      if (next) {
        onChange([baseTextRef.current, next].filter(Boolean).join(" "));
      }
    };
    recognition.onerror = () => {
      setError(strings.voice.notSupportedDesc);
      setListening(false);
      stopTimer();
    };
    recognition.onend = () => {
      setListening(false);
      stopTimer();
    };
    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current = null;
    };
  }, [ctor, language, onChange, strings.voice.notSupportedDesc]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  function stopTimer() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startTimer() {
    stopTimer();
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    intervalRef.current = window.setInterval(() => {
      if (!startedAtRef.current) return;
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 250);
  }

  function start() {
    setError(null);
    baseTextRef.current = value.trim();
    startTimer();
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch {
      /* ignore */
    }
  }
  function stop() {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    stopTimer();
  }

  function askAgain() {
    stop();
    setError(null);
    onChange("");
    setElapsedMs(0);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {strings.voice.heading}
        </h1>
        <p className="text-muted-foreground">{strings.voice.editHint}</p>
      </div>

      {!supported ? (
        <div className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md p-6 text-center space-y-3 shadow-xl">
          <MicOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">
            {strings.voice.notSupported}
          </p>
          <p className="text-sm text-muted-foreground">
            {strings.voice.notSupportedDesc}
          </p>
          <Button onClick={onSwitchToTyping} variant="glass" size="lg" className="rounded-xl">
            {strings.voice.typeInstead}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {listening
                  ? strings.voice.listening
                  : strings.voice.holdToSpeak}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{formatMs(elapsedMs)}</span>
              </div>
            </div>

            <button
              onPointerDown={start}
              onPointerUp={stop}
              onPointerCancel={stop}
              onPointerLeave={() => {
                if (listening) stop();
              }}
              className={
                "flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-background/50 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (listening
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted/40")
              }
              aria-label={strings.voice.holdToSpeak}
            >
              <Mic className="h-7 w-7" />
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {strings.voice.release}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {strings.voice.whatWeHeard}
        </p>
        <div
          className="min-h-20 rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm text-foreground"
          aria-live="polite"
        >
          {value ? (
            value
          ) : (
            <span className="text-muted-foreground">
              {strings.case.placeholder}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          variant="glass"
          onClick={onSwitchToTyping}
          className="rounded-xl h-12"
        >
          {strings.voice.typeInstead}
        </Button>
        <Button
          variant="glass"
          onClick={askAgain}
          className="rounded-xl h-12 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {strings.actions.askAgain}
        </Button>
        <Button
          variant="glass"
          onClick={onSubmit}
          disabled={value.trim().length < 3}
          className="rounded-xl h-12"
        >
          {strings.actions.continue}
        </Button>
      </div>
    </div>
  );
}
