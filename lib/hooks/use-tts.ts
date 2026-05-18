"use client";

/**
 * useTts
 *
 * React hook that wraps the backend TTS endpoint.
 * Handles synthesis, playback, and cleanup.
 *
 * Per the proposal:
 *  - TTS is triggered after clarification responses (speak the question)
 *  - TTS is triggered after success responses (speak the summary)
 *  - When voice mode is active, voice leads; text is always shown simultaneously
 *  - The Web Speech API's speech synthesis is NOT used — quality for
 *    Amharic / Afaan Oromo is insufficient
 */

import * as React from "react";
import { synthesizeSpeech, playBase64Audio } from "@/lib/api/navigator";
import type { LanguageCode } from "@/lib/service-navigator/types";

type TtsState = "idle" | "loading" | "playing" | "error";

export function useTts(language: LanguageCode) {
  const [state, setState] = React.useState<TtsState>("idle");
  const stopRef = React.useRef<(() => void) | null>(null);

  // Stop any current playback on unmount
  React.useEffect(() => {
    return () => {
      stopRef.current?.();
    };
  }, []);

  /**
   * Synthesize and immediately play the given text.
   * Silently swallows errors so TTS failures never break the UI flow.
   */
  async function speak(text: string): Promise<void> {
    if (!text.trim()) return;

    // Stop any currently playing audio
    stopRef.current?.();
    stopRef.current = null;

    setState("loading");

    try {
      const result = await synthesizeSpeech(text, language);
      setState("playing");
      const stop = playBase64Audio(result.audio);
      stopRef.current = () => {
        stop();
        setState("idle");
      };
    } catch {
      // TTS failure must never break the citizen flow
      setState("error");
    }
  }

  function stop() {
    stopRef.current?.();
    stopRef.current = null;
    setState("idle");
  }

  return { speak, stop, state };
}
