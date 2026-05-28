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
  const { playMessage, stopMessage } = useSystemMessageAudio();
  const [hasPlayed, setHasPlayed] = React.useState(false);

  // Auto-play welcome message when component mounts
  React.useEffect(() => {
    if (!hasPlayed && language !== "en") {
      playMessage("welcome", language)
        .then(() => {
          setHasPlayed(true);
        })
        .catch((err) => {
          console.error("Failed to play welcome message:", err);
          // Silently fail - no visual feedback
        });
    }

    // Cleanup: stop audio when component unmounts
    return () => {
      stopMessage();
    };
  }, [language, hasPlayed]);

  // No visual component - just plays audio in background
  return null;
}

