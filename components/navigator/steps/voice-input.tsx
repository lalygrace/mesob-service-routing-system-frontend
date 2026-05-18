"use client";

/**
 * VoiceInput
 *
 * Records audio via MediaRecorder and sends it to the backend STT endpoint
 * (POST /api/stt/transcribe → addis.ai addis-whisper).
 *
 * The browser's Web Speech API is intentionally NOT used here — it has very
 * poor support for Amharic and Afaan Oromo. All transcription goes through
 * the addis.ai STT model which is purpose-built for Ethiopian languages.
 */

import * as React from "react";
import { Mic, MicOff, RotateCcw, Timer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transcribeAudio } from "@/lib/api/navigator";
import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

// Maximum recording duration enforced by addis.ai STT (60 s hard limit)
const MAX_RECORD_MS = 58_000;

function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type RecordingState = "idle" | "recording" | "transcribing" | "done" | "error";

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
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const intervalRef = React.useRef<number | null>(null);
  const startedAtRef = React.useRef<number | null>(null);
  const autoStopRef = React.useRef<number | null>(null);

  const [recordingState, setRecordingState] =
    React.useState<RecordingState>("idle");
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [mediaSupported, setMediaSupported] = React.useState(true);

  // Check MediaRecorder support on mount
  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setMediaSupported(false);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopTimer();
      if (autoStopRef.current) window.clearTimeout(autoStopRef.current);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
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

  async function startRecording() {
    setError(null);
    chunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(strings.voice.notSupportedDesc);
      setRecordingState("error");
      return;
    }

    // Pick the best supported MIME type
    const mimeType = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ].find((t) => MediaRecorder.isTypeSupported(t)) ?? "";

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      // Stop all tracks to release the microphone
      stream.getTracks().forEach((t) => t.stop());
      stopTimer();

      const blob = new Blob(chunksRef.current, {
        type: mimeType || "audio/webm",
      });

      if (blob.size < 100) {
        // Nothing was recorded
        setRecordingState("idle");
        return;
      }

      setRecordingState("transcribing");

      try {
        const result = await transcribeAudio(blob, language);
        const transcript = result.transcription?.trim() ?? "";
        onChange(transcript);
        setRecordingState("done");
      } catch {
        setError(strings.voice.notSupportedDesc);
        setRecordingState("error");
      }
    };

    recorder.start(250); // collect chunks every 250 ms
    setRecordingState("recording");
    startTimer();

    // Auto-stop at the addis.ai STT hard limit
    autoStopRef.current = window.setTimeout(() => {
      stopRecording();
    }, MAX_RECORD_MS);
  }

  function stopRecording() {
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    stopTimer();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  function reset() {
    stopRecording();
    setError(null);
    onChange("");
    setElapsedMs(0);
    setRecordingState("idle");
  }

  const isRecording = recordingState === "recording";
  const isTranscribing = recordingState === "transcribing";
  const isDone = recordingState === "done";

  if (!mediaSupported) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {strings.voice.heading}
          </h1>
        </div>
        <div className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md p-6 text-center space-y-3 shadow-xl">
          <MicOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">
            {strings.voice.notSupported}
          </p>
          <p className="text-sm text-muted-foreground">
            {strings.voice.notSupportedDesc}
          </p>
          <Button
            onClick={onSwitchToTyping}
            variant="glass"
            size="lg"
            className="rounded-xl"
          >
            {strings.voice.typeInstead}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {strings.voice.heading}
        </h1>
        <p className="text-muted-foreground">{strings.voice.editHint}</p>
      </div>

      {/* Recording card */}
      <div className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {isTranscribing
                ? "Transcribing…"
                : isRecording
                  ? strings.voice.listening
                  : isDone
                    ? strings.voice.whatWeHeard
                    : strings.voice.holdToSpeak}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>{formatMs(elapsedMs)}</span>
            </div>
          </div>

          {/* Mic button — hold to record, release to stop */}
          <button
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              if (!isRecording && !isTranscribing) startRecording();
            }}
            onPointerUp={() => {
              if (isRecording) stopRecording();
            }}
            onPointerCancel={() => {
              if (isRecording) stopRecording();
            }}
            disabled={isTranscribing}
            className={[
              "flex h-14 w-14 items-center justify-center rounded-full border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isRecording
                ? "bg-primary text-primary-foreground animate-pulse"
                : isTranscribing
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-background/50 text-foreground hover:bg-muted/40",
            ].join(" ")}
            aria-label={strings.voice.holdToSpeak}
          >
            {isTranscribing ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Mic className="h-7 w-7" />
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isRecording ? strings.voice.release : strings.voice.holdToSpeak}
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {/* Transcript display */}
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
          onClick={reset}
          className="rounded-xl h-12 gap-2"
          disabled={isRecording || isTranscribing}
        >
          <RotateCcw className="h-4 w-4" />
          {strings.actions.askAgain}
        </Button>
        <Button
          variant="glass"
          onClick={onSubmit}
          disabled={value.trim().length < 3 || isRecording || isTranscribing}
          className="rounded-xl h-12"
        >
          {strings.actions.continue}
        </Button>
      </div>
    </div>
  );
}
