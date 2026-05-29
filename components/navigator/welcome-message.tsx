"use client";

import * as React from "react";
import { useSystemMessageAudio } from "@/hooks/use-system-message-audio";
import type { LanguageCode } from "@/lib/service-navigator/types";

type WelcomeMessageProps = {
  language: LanguageCode;
};

/**
 * Welcome message component that silently plays TTS audio
 * No visual display - audio only
 */
export function WelcomeMessage({ language }: WelcomeMessageProps) {
  const { playMessage } = useSystemMessageAudio();
  const playedRef = React.useRef(false);

  // Auto-play welcome message when component mounts
  React.useEffect(() => {
    // Only play once per language
    if (!playedRef.current && language !== "en") {
      playedRef.current = true;
      
      playMessage("welcome", language)
        .catch((err) => {
          console.error("Failed to play welcome message:", err);
          // Silently fail - no visual feedback
        });
    }
  }, [language]); // Remove playMessage from dependencies

  // No visual component - just plays audio in background
  return null;
}

