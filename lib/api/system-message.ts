import { apiData } from "./client";

export type SystemMessageType = "welcome" | "processing" | "closing";

export type Language = "AMHARIC" | "ENGLISH" | "AFAAN_OROMO";

export type SystemMessage = {
  id: string;
  type: SystemMessageType;
  language: Language;
  text: string;
  audioB64: string | null; // NULL for English (TTS not supported)
  ttsCacheKey: string | null;
};

export type SystemMessageListItem = {
  id: string;
  type: SystemMessageType;
  language: Language;
  text: string;
  ttsCacheKey: string | null;
  updatedAt: string;
};

/**
 * Get a system message with TTS audio
 * Used by citizen-facing app to play welcome/processing/closing messages
 */
export async function getSystemMessage(
  type: SystemMessageType,
  language: Language
): Promise<SystemMessage> {
  return apiData<SystemMessage>(
    `/api/system-message?type=${type}&language=${language}`
  );
}

/**
 * Get all system messages (admin only)
 */
export async function getAllSystemMessages(): Promise<
  SystemMessageListItem[]
> {
  return apiData<SystemMessageListItem[]>("/api/system-message/all");
}

/**
 * Update a system message (admin only)
 */
export async function updateSystemMessage(
  type: SystemMessageType,
  language: Language,
  text: string
): Promise<SystemMessage> {
  return apiData<SystemMessage>("/api/system-message", {
    method: "PUT",
    body: JSON.stringify({ type, language, text }),
  });
}

/**
 * Initialize default system messages (admin only)
 */
export async function initializeSystemMessages(): Promise<{
  initialized: boolean;
  count: number;
}> {
  return apiData<{ initialized: boolean; count: number }>(
    "/api/system-message/initialize",
    {
      method: "POST",
    }
  );
}
