import { apiData } from "./client";
import type { LanguageCode, Service } from "@/lib/service-navigator/types";

export type CitizenInputMode = "voice" | "realtime_voice" | "text" | "category_select";

export type CitizenMatch = {
  rank: number;
  matchScore: number | null;
  serviceId: string;
  serviceCode: string;
  serviceName: string;
  authority: { id: string; code: string };
};

export type CitizenInteractionResult = {
  sessionId: string;
  turnNumber: number;
  systemAction: "ASK_CLARIFICATION" | "SHOW_OPTIONS" | "SHOW_FINAL_SUMMARY" | string;
  message: string;
  matches: CitizenMatch[];
};

export type CitizenSessionCreated = {
  id: string;
  status: string;
};

export function createCitizenSession(payload: {
  lang: LanguageCode;
  inputMode: CitizenInputMode;
  rawInput?: string;
  deviceType?: string;
}) {
  return apiData<CitizenSessionCreated>("/api/citizen/sessions", {
    method: "POST",
    body: payload,
  });
}

export function createCitizenInteraction(sessionId: string, payload: {
  userInput?: string;
  inputMode?: CitizenInputMode;
}) {
  return apiData<CitizenInteractionResult>(`/api/citizen/sessions/${sessionId}/interactions`, {
    method: "POST",
    body: payload,
  });
}

export function clarifyCitizenSession(sessionId: string, userInput: string) {
  return apiData<CitizenInteractionResult>(`/api/citizen/sessions/${sessionId}/clarify`, {
    method: "POST",
    body: { userInput },
  });
}

export function selectCitizenService(sessionId: string, serviceId: string) {
  return apiData<{ sessionId: string; serviceId: string; service: unknown }>(
    `/api/citizen/sessions/${sessionId}/select`,
    {
      method: "POST",
      body: { serviceId },
    },
  );
}

export function completeCitizenSession(sessionId: string, wasSuccessful: boolean) {
  return apiData<{ sessionId: string; status: string }>(`/api/citizen/sessions/${sessionId}/complete`, {
    method: "POST",
    body: { wasSuccessful },
  });
}

export function submitCitizenFeedback(sessionId: string, payload: {
  serviceId?: string;
  wasHelpful?: boolean;
  rating?: number;
  comment?: string;
}) {
  return apiData<unknown>(`/api/citizen/sessions/${sessionId}/feedback`, {
    method: "POST",
    body: payload,
  });
}

export function matchesToServices(matches: CitizenMatch[], services: Service[]) {
  const serviceById = new Map(services.map((service) => [service.id, service]));

  return matches.flatMap((match) => {
    const service = serviceById.get(match.serviceId);
    if (!service) return [];
    return [{ service, score: match.matchScore ?? 0, matched: [] }];
  });
}
