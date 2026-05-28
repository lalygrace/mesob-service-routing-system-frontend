"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSystemMessageAudio } from "@/hooks/use-system-message-audio";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { Button } from "@/components/ui/button";

type WelcomeMessageProps = {
  language: LanguageCode;
};

/**
 * Welcome message component that plays TTS audio for Amharic/Afaan Oromo
 * No text display - audio only
 */
export function WelcomeMessage({ language }: WelcomeMessageProps) {
  const { playMessage, stopMessage, isPlaying } = useSystemMessageAudio();
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
          // Silently fail - no text fallback
        });
    }

    // Cleanup: stop audio when component unmounts
    return () => {
      stopMessage();
    };
  }, [language, hasPlayed]);

  const handleReplay = () => {
    playMessage("welcome", language).catch((err) => {
      console.error("Failed to replay welcome message:", err);
    });
  };

  // For English, don't show anything (no TTS support)
  if (language === "en") {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <>
              <Volume2 className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Playing welcome message...
              </span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Welcome message played
              </span>
            </>
          )}
        </div>
        
        {/* Replay button */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={isPlaying ? stopMessage : handleReplay}
          title={isPlaying ? "Stop audio" : "Replay audio"}
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

