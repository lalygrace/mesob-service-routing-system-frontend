/**
 * navigator.ts
 *
 * API client functions for the citizen-facing AI navigation flow.
 * Covers:
 *  - STT  (audio → text via backend → addis.ai)
 *  - TTS  (text → base64 WAV via backend → addis.ai, with DB cache)
 *  - Public authority list (for Browse-by-Authority path)
 *  - Services by authority (Browse-by-Authority path — no AI involved)
 */

import { apiData, getApiBaseUrl } from "./client";
import type { LanguageCode, Service } from "@/lib/service-navigator/types";

// ─── Public Authority (Browse path) ──────────────────────────────────────────

export type PublicAuthority = {
  id: string;
  code: string;
  floor: string | null;
  wing: string | null;
  logoUrl: string | null;
  name: string;
  description: string | null;
};

export function listPublicAuthorities(language: LanguageCode) {
  return apiData<PublicAuthority[]>(`/api/public/authorities?lang=${language}`);
}

export function listServicesByAuthority(
  authorityId: string,
  language: LanguageCode,
) {
  return apiData<Service[]>(
    `/api/public/authorities/${authorityId}/services?lang=${language}`,
  );
}

// ─── STT — Speech-to-Text ─────────────────────────────────────────────────────
//
// The proposal explicitly forbids using the browser Web Speech API for
// Amharic / Afaan Oromo. All voice transcription goes through the backend
// which proxies to addis.ai /api/v2/stt (addis-whisper).

export type SttResult = {
  transcription: string;
  confidence: number;
  language: string;
  usageMetadata: {
    totalBilledDuration: string;
    requestId: string;
  };
};

/**
 * Sends a recorded audio Blob to the backend STT endpoint.
 * Returns the transcription text and confidence score.
 *
 * @param audioBlob  - Raw audio captured from MediaRecorder (webm/wav/mp4)
 * @param language   - Citizen's selected language code
 */
export async function transcribeAudio(
  audioBlob: Blob,
  language: LanguageCode,
): Promise<SttResult> {
  const prismaLang = languageToPrisma(language);

  const formData = new FormData();
  formData.append("audio", audioBlob, `recording.${blobExtension(audioBlob)}`);
  formData.append("fileName", `recording.${blobExtension(audioBlob)}`);
  formData.append("mimeType", audioBlob.type || "audio/webm");
  formData.append("language", prismaLang);

  const response = await fetch(`${getApiBaseUrl()}/api/stt/transcribe`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`STT failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<SttResult>;
}

// ─── TTS — Text-to-Speech ─────────────────────────────────────────────────────
//
// The proposal requires TTS for:
//   1. After a clarification response — speak the question aloud
//   2. After a success response — speak the summary sentence aloud
//
// The backend caches TTS audio by SHA-256(text + language + voiceId) in the
// TtsCache table, so repeated system messages are never re-generated.

export type TtsResult = {
  audio: string;       // Base64-encoded WAV
  cacheKey: string;
  wasCached: boolean;
  language: string;
  voiceId: string;
};

/**
 * Requests TTS synthesis from the backend.
 * Returns a base64-encoded WAV string that can be played directly in the browser.
 *
 * @param text      - Text to synthesize (in the citizen's language)
 * @param language  - Citizen's selected language code
 */
export async function synthesizeSpeech(
  text: string,
  language: LanguageCode,
): Promise<TtsResult> {
  const prismaLang = languageToPrisma(language);

  return apiData<TtsResult>("/api/tts/synthesize", {
    method: "POST",
    body: {
      text,
      language: prismaLang,
    },
  });
}

/**
 * Plays a base64-encoded WAV string in the browser.
 * Returns a cleanup function that stops playback.
 */
export function playBase64Audio(base64Wav: string): () => void {
  const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
  audio.play().catch(() => {
    // Autoplay may be blocked — silently ignore
  });
  return () => {
    audio.pause();
    audio.src = "";
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function languageToPrisma(lang: LanguageCode): string {
  switch (lang) {
    case "am":
      return "AMHARIC";
    case "om":
      return "AFAAN_OROMO";
    case "en":
    default:
      return "ENGLISH";
  }
}

function blobExtension(blob: Blob): string {
  const type = blob.type;
  if (type.includes("webm")) return "webm";
  if (type.includes("mp4") || type.includes("m4a")) return "m4a";
  if (type.includes("mpeg") || type.includes("mp3")) return "mp3";
  return "wav";
}
