"use client";

import * as React from "react";
import { useSystemMessageAudio } from "@/hooks/use-system-message-audio";
import type { LanguageCode } from "@/lib/service-navigator/types";

type WelcomeMessageProps = {
  language: LanguageCode;
  sessionCount: number; // Track session resets
};

/**
 * Welcome message component that silently plays TTS audio
 * No visual display - audio only
 * Plays only once per session (not on back navigation)
 */
export function WelcomeMessage({ language, sessionCount }: WelcomeMessageProps) {
  const { playMessage } = useSystemMessageAudio();
  const lastPlayedSessionRef = React.useRef<number>(-1);

  // Auto-play welcome message only once per session
  React.useEffect(() => {
    // Only play if this is a new session and language is not English
    if (lastPlayedSessionRef.current !== sessionCount && language !== "en") {
      lastPlayedSessionRef.current = sessionCount;
      
      playMessage("welcome", language)
        .catch((err) => {
          console.error("Failed to play welcome message:", err);
          // Silently fail - no visual feedback
        });
    }
  }, [sessionCount, language, playMessage]);

  // No visual component - just plays audio in background
  return null;
}

