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
 *
 * Uses react-voice-visualizer for professional audio visualization.
 */

import * as React from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transcribeAudio } from "@/lib/api/navigator";
import type { LanguageCode } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

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
  const [recordingState, setRecordingState] =
    React.useState<RecordingState>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [mediaSupported, setMediaSupported] = React.useState(true);
  const autoStopRef = React.useRef<number | null>(null);

  // Initialize voice visualizer with custom error handling
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    error: visualizerError,
    isRecordingInProgress,
    recordingTime,
    startRecording,
    stopRecording,
    clearCanvas,
    isAvailableRecordingTime,
  } = recorderControls;

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

  // Handle visualizer errors - suppress default error UI
  React.useEffect(() => {
    if (visualizerError) {
      console.error("Voice visualizer error:", visualizerError);
      setError(strings.voice.notSupportedDesc);
      setRecordingState("error");
    }
  }, [visualizerError, strings.voice.notSupportedDesc]);

  // Check if recording is available
  React.useEffect(() => {
    if (isAvailableRecordingTime === false) {
      setMediaSupported(false);
    }
  }, [isAvailableRecordingTime]);

  // Auto-stop at 58 seconds
  React.useEffect(() => {
    if (isRecordingInProgress && recordingTime >= MAX_RECORD_MS) {
      handleStopRecording();
    }
  }, [isRecordingInProgress, recordingTime]);

  // Process recorded blob
  React.useEffect(() => {
    if (recordedBlob && recordingState === "recording") {
      // Small delay to ensure blob is fully ready
      const timer = setTimeout(() => {
        processRecording(recordedBlob);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [recordedBlob, recordingState]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (autoStopRef.current) window.clearTimeout(autoStopRef.current);
      if (isRecordingInProgress) {
        stopRecording();
      }
    };
  }, []);

  async function handleStartRecording() {
    setError(null);
    setRecordingState("recording");
    
    try {
      await startRecording();
      
      // Set auto-stop timeout
      autoStopRef.current = window.setTimeout(() => {
        handleStopRecording();
      }, MAX_RECORD_MS);
    } catch (err) {
      setError(strings.voice.notSupportedDesc);
      setRecordingState("error");
    }
  }

  function handleStopRecording() {
    if (autoStopRef.current) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    stopRecording();
  }

  async function processRecording(blob: Blob) {
    if (blob.size < 100) {
      // Nothing was recorded
      setRecordingState("idle");
      return;
    }

    setRecordingState("transcribing");

    try {
      console.log("Transcribing audio blob:", {
        size: blob.size,
        type: blob.type,
        language,
      });
      
      const result = await transcribeAudio(blob, language);
      
      console.log("Transcription result:", result);
      
      const transcript = result.transcription?.trim() ?? "";
      onChange(transcript);
      setRecordingState("done");
    } catch (err) {
      console.error("Transcription error:", err);
      setError(strings.voice.notSupportedDesc);
      setRecordingState("error");
    }
  }

  function reset() {
    handleStopRecording();
    clearCanvas();
    setError(null);
    onChange("");
    setRecordingState("idle");
  }

  const isRecording = recordingState === "recording" && isRecordingInProgress;
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

      {/* Voice Visualizer Card */}
      <div className="rounded-xl border border-white/20 bg-card/40 backdrop-blur-md p-6 shadow-xl space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground text-center">
            {isTranscribing
              ? "Transcribing…"
              : isRecording
                ? strings.voice.listening
                : isDone
                  ? strings.voice.whatWeHeard
                  : strings.voice.holdToSpeak}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{formatMs(recordingTime)}</span>
            <span>/ {formatMs(MAX_RECORD_MS)}</span>
          </div>
        </div>

        {/* Voice Visualizer */}
        <div className="relative min-h-[120px] flex items-center justify-center rounded-lg bg-background/30 p-4">
          {isTranscribing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing audio...</p>
            </div>
          ) : visualizerError ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-muted-foreground"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
              <p className="text-sm text-muted-foreground">
                Microphone not available
              </p>
            </div>
          ) : (
            <div className="w-full overflow-hidden relative">
              <style dangerouslySetInnerHTML={{
                __html: `
                  /* Hide react-voice-visualizer error messages */
                  .voice-visualizer > div:last-child {
                    display: none !important;
                  }
                  .voice-visualizer p[style*="color"] {
                    display: none !important;
                  }
                `
              }} />
              <div className="voice-visualizer">
                <VoiceVisualizer
                  controls={recorderControls}
                  height={100}
                  width="100%"
                  backgroundColor="transparent"
                  mainBarColor="#3b82f6"
                  secondaryBarColor="#60a5fa"
                  barWidth={3}
                  gap={2}
                  rounded={3}
                  isControlPanelShown={false}
                  isDownloadAudioButtonShown={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !isTranscribing && (
            <Button
              onClick={handleStartRecording}
              size="lg"
              className="rounded-full h-16 w-16 p-0"
              disabled={isTranscribing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={handleStopRecording}
              size="lg"
              variant="destructive"
              className="rounded-full h-16 w-16 p-0 animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {isRecording
            ? "Click the button to stop recording"
            : isTranscribing
              ? "Please wait while we process your audio"
              : "Click the microphone to start recording"}
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
