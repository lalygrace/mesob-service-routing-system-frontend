"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSystemMessageAudio } from "@/hooks/use-system-message-audio";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { Button } from "@/components/ui/button";

type WelcomeMessageProps = {
  language: LanguageCode;
  text: string; // Fallback text for English or if audio fails
};

/**
 * Welcome message component that plays TTS audio for Amharic/Afaan Oromo
 * and displays text for English
 */
export function WelcomeMessage({ language, text }: WelcomeMessageProps) {
  const { playMessage, stopMessage, isPlaying, error } = useSystemMessageAudio();
  const [hasPlayed, setHasPlayed] = React.useState(false);
  const [displayText, setDisplayText] = React.useState(text);
  const [isAudio, setIsAudio] = React.useState(false);

  // Auto-play welcome message when component mounts
  React.useEffect(() => {
    if (!hasPlayed) {
      playMessage("welcome", language)
        .then((result) => {
          setDisplayText(result.text);
          setIsAudio(result.isAudio);
          setHasPlayed(true);
        })
        .catch((err) => {
          console.error("Failed to play welcome message:", err);
          // Fallback to text display
          setDisplayText(text);
          setIsAudio(false);
        });
    }

    // Cleanup: stop audio when component unmounts
    return () => {
      stopMessage();
    };
  }, [language, hasPlayed]); // Only run once per language change

  const handleReplay = () => {
    playMessage("welcome", language)
      .then((result) => {
        setDisplayText(result.text);
        setIsAudio(result.isAudio);
      })
      .catch((err) => {
        console.error("Failed to replay welcome message:", err);
      });
  };

  return (
    <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {displayText}
          </p>
          {error && (
            <p className="mt-2 text-xs text-destructive">
              Audio playback failed. Showing text instead.
            </p>
          )}
        </div>
        
        {/* Show replay button for audio messages (Amharic/Afaan Oromo) */}
        {isAudio && language !== "en" && (
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
        )}
      </div>
    </div>
  );
}
