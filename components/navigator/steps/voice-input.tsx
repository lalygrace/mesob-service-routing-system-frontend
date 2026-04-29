"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = { length: number; [index: number]: SpeechRecognitionAlternativeLike };
type SpeechRecognitionResultListLike = { length: number; [index: number]: SpeechRecognitionResultLike };
type SpeechRecognitionEventLike = { resultIndex: number; results: SpeechRecognitionResultListLike };
type SpeechRecognitionLike = {
  lang: string; interimResults: boolean; continuous: boolean;
  start: () => void; stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function langCode(language: LanguageCode): string {
  switch (language) { case "am": return "am-ET"; case "om": return "om-ET"; default: return "en-US"; }
}

export function VoiceInput({
  language, strings, value, onChange, onSubmit, onSwitchToTyping,
}: {
  language: LanguageCode; strings: Strings; value: string;
  onChange: (v: string) => void; onSubmit: () => void; onSwitchToTyping: () => void;
}) {
  const ctor = getSpeechCtor();
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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
      if (next) onChange(next);
    };
    recognition.onerror = () => { setError(strings.voice.notSupportedDesc); setListening(false); };
    recognition.onend = () => { setListening(false); };
    recognitionRef.current = recognition;
    return () => { recognitionRef.current = null; };
  }, [ctor, language, onChange, strings.voice.notSupportedDesc]);

  function start() {
    setError(null);
    try { recognitionRef.current?.start(); setListening(true); } catch { /* ignore */ }
  }
  function stop() {
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{strings.voice.heading}</h1>
        <p className="text-muted-foreground">{strings.voice.editHint}</p>
      </div>

      {!supported ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
          <MicOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">{strings.voice.notSupported}</p>
          <p className="text-sm text-muted-foreground">{strings.voice.notSupportedDesc}</p>
          <Button onClick={onSwitchToTyping} size="lg" className="rounded-xl">{strings.voice.typeInstead}</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Mic button with pulse */}
          <div className="relative">
            {listening && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onPointerDown={start}
              onPointerUp={stop}
              onPointerCancel={stop}
              onPointerLeave={() => { if (listening) stop(); }}
              className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${
                listening
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <Mic className="h-10 w-10" />
            </motion.button>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {listening ? strings.voice.listening : strings.voice.holdToSpeak}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{strings.voice.whatWeHeard}</label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={strings.problem.placeholder}
          className="min-h-24 rounded-xl resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSwitchToTyping} className="flex-1 rounded-xl h-12">
          {strings.voice.typeInstead}
        </Button>
        <Button onClick={onSubmit} disabled={value.trim().length < 3} className="flex-1 rounded-xl h-12">
          {strings.actions.continue}
        </Button>
      </div>
    </div>
  );
}
