"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LanguageCode } from "@/lib/service-navigator/types";

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

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function mapLanguageToSpeechCode(language: LanguageCode): string {
  switch (language) {
    case "am":
      return "am-ET";
    case "om":
      return "om-ET";
    case "en":
    default:
      return "en-US";
  }
}

export function VoiceStep({
  language,
  value,
  onChange,
  onSwitchToTyping,
}: {
  language: LanguageCode;
  value: string;
  onChange: (value: string) => void;
  onSwitchToTyping: () => void;
}) {
  const ctor = getSpeechRecognitionCtor();

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const supported = Boolean(ctor);

  React.useEffect(() => {
    if (!ctor) return;

    const recognition = new ctor();
    recognition.lang = mapLanguageToSpeechCode(language);
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i]?.[0]?.transcript ?? "";
      }
      const next = transcript.trim();
      if (next) onChange(next);
    };

    recognition.onerror = () => {
      setError(
        "Voice transcription is not available right now. Please type instead.",
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current = null;
    };
  }, [ctor, language, onChange]);

  function start() {
    setError(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // Ignore: calling start twice can throw.
    }
  }

  function stop() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore.
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base">Speak your problem</Label>
        <p className="text-sm text-muted-foreground">
          Hold the button and speak naturally. We’ll show the text below.
        </p>
      </div>

      {!supported ? (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">
            Voice transcription not supported
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This browser doesn’t support live speech-to-text. Use typing.
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-3 h-12"
            onClick={onSwitchToTyping}
          >
            Type instead
          </Button>
        </div>
      ) : null}

      {supported ? (
        <Button
          type="button"
          size="lg"
          className="h-14"
          onPointerDown={start}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={() => {
            if (listening) stop();
          }}
        >
          {listening ? "Listening… release to stop" : "Hold to speak"}
        </Button>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-2">
        <Label htmlFor="transcript">What we heard</Label>
        <Textarea
          id="transcript"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Example: "I lost my ID"'
          className="min-h-28"
        />
        <p className="text-xs text-muted-foreground">
          You can edit the text before continuing.
        </p>
      </div>
    </div>
  );
}
