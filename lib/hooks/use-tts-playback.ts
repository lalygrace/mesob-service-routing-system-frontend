"use client";

import { useState, useRef, useCallback } from "react";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { apiData } from "@/lib/api/client";

type TtsResponse = {
  audio: string; // base64 encoded WAV
  cacheKey: string;
  wasCached: boolean;
  language: string;
  voiceId: string;
};

/**
 * Hook for managing TTS audio playback
 * 
 * Features:
 * - Synthesizes speech from text using AddisAI TTS
 * - Manages audio playback state
 * - Provides play/pause/stop controls
 * - Auto-plays on synthesis (configurable)
 * - Handles errors gracefully
 */
export function useTtsPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Synthesize and play text as speech
   * Only works for Amharic and Afaan Oromo (AddisAI limitation)
   */
  const playText = useCallback(
    async (
      text: string,
      language: LanguageCode,
      options?: {
        voiceId?: string;
        autoPlay?: boolean;
      }
    ) => {
      const { voiceId = "male_1", autoPlay = true } = options || {};

      // AddisAI TTS only supports Amharic and Afaan Oromo
      if (language === "en") {
        console.warn("TTS not supported for English");
        return;
      }

      // Stop any currently playing audio
      stop();

      setIsLoading(true);
      setError(null);

      try {
        // Convert language code to backend format
        const languageMap: Record<LanguageCode, string> = {
          am: "AMHARIC",
          om: "AFAAN_OROMO",
          en: "ENGLISH",
        };

        // Call TTS API
        const response = await apiData<TtsResponse>("/api/tts/synthesize", {
          method: "POST",
          body: {
            text,
            language: languageMap[language],
            voiceId,
          },
        });

        // Convert base64 to audio URL
        const audioBlob = base64ToBlob(response.audio, "audio/wav");
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create and configure audio element
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setError("Failed to play audio");
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        if (autoPlay) {
          await audio.play();
        }

        setIsLoading(false);
      } catch (err) {
        console.error("TTS playback failed:", err);
        setError(err instanceof Error ? err.message : "TTS failed");
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Pause current playback
   */
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  /**
   * Resume paused playback
   */
  const resume = useCallback(async () => {
    if (audioRef.current && audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Failed to resume audio:", err);
      }
    }
  }, []);

  /**
   * Stop and cleanup current playback
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setError(null);
  }, []);

  return {
    playText,
    pause,
    resume,
    stop,
    isPlaying,
    isLoading,
    error,
  };
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
