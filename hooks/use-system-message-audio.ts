import { useEffect, useRef, useState } from "react";
import { getSystemMessage, SystemMessageType } from "@/lib/api/system-message";
import type { LanguageCode } from "@/lib/service-navigator/types";

// Map frontend language codes to backend Language enum
function mapLanguageCode(lang: LanguageCode): "AMHARIC" | "ENGLISH" | "AFAAN_OROMO" {
  switch (lang) {
    case "am":
      return "AMHARIC";
    case "en":
      return "ENGLISH";
    case "om":
      return "AFAAN_OROMO";
    default:
      return "ENGLISH";
  }
}

/**
 * Hook to play system message TTS audio
 * Automatically fetches and plays audio for Amharic and Afaan Oromo
 * For English, returns the text (TTS not supported)
 */
export function useSystemMessageAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * Play a system message
   * For Amharic/Afaan Oromo: plays TTS audio
   * For English: returns text (caller should display it)
   */
  const playMessage = async (
    type: SystemMessageType,
    language: LanguageCode
  ): Promise<{ text: string; isAudio: boolean }> => {
    try {
      setError(null);
      const backendLanguage = mapLanguageCode(language);

      // Fetch the system message
      const message = await getSystemMessage(type, backendLanguage);

      // For English, return text (no TTS)
      if (language === "en" || !message.audioB64) {
        return { text: message.text, isAudio: false };
      }

      // For Amharic/Afaan Oromo, play audio
      setIsPlaying(true);

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create audio element from base64
      const audio = new Audio(`data:audio/wav;base64,${message.audioB64}`);
      audioRef.current = audio;

      // Set up event listeners
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setError("Failed to play audio");
        audioRef.current = null;
      };

      // Play the audio
      await audio.play();

      return { text: message.text, isAudio: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load message");
      setIsPlaying(false);
      throw err;
    }
  };

  /**
   * Stop currently playing audio
   */
  const stopMessage = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  return {
    playMessage,
    stopMessage,
    isPlaying,
    error,
  };
}
