import { apiData, apiRequest } from "./client";

export type AdminUserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER" | "super_admin" | "admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "super_admin" | "admin";
  systemRole?: AdminUserRole | null;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
  authorityId?: string | null;
};

export type AnalyticsSummary = {
  totalAuthorities: number;
  totalServices: number;
  totalAdmins: number;
  activeAdmins: number;
  totalSessions: number;
  avgRating: number | null;
  latestSnapshot: AnalyticsSnapshot | null;
};

export type AnalyticsSnapshot = {
  id: string;
  date: string;
  granularity: "DAILY" | "WEEKLY" | "MONTHLY";
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  sessionsAmharic: number;
  sessionsEnglish: number;
  sessionsAfaanOromo: number;
  voiceSessions: number;
  realtimeVoiceSessions: number;
  textSessions: number;
  categorySessions: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  avgSttConfidence: number | null;
  totalPromptTokens: number;
  totalCandidateTokens: number;
  ttsCacheHits: number;
  ttsCacheMisses: number;
  avgRating: number | null;
  helpfulCount: number;
  unhelpfulCount: number;
  topServices: Array<{ serviceId: string; count: number; name: string }> | null;
  topUnclearInputs: string[] | null;
};

export function listAdminUsers() {
  return apiData<AdminUser[]>("/api/admin/users");
}

export function createAdminUser(payload: { name: string; email: string; role?: string; authorityId?: string | null }) {
  return apiData<unknown>("/api/admin/users", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminUser(userId: string, payload: {
  name?: string;
  role?: string;
  authorityId?: string | null;
  isActive?: boolean;
}) {
  return apiData<unknown>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAdminUser(userId: string) {
  return apiRequest<{ success: boolean }>(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export function getAnalyticsSummary() {
  return apiData<AnalyticsSummary>("/api/admin/analytics/summary");
}

export function listAnalyticsSnapshots(params: {
  granularity: "DAILY" | "WEEKLY" | "MONTHLY";
  from?: string;
  to?: string;
}) {
  const search = new URLSearchParams({ granularity: params.granularity });
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  return apiData<AnalyticsSnapshot[]>(`/api/admin/analytics/snapshots?${search.toString()}`);
}

export type SystemConfig = {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export function listSystemConfig() {
  return apiData<SystemConfig[]>("/api/admin/system-config");
}

export function updateSystemConfig(key: string, payload: { value: string; description?: string | null }) {
  return apiData<SystemConfig>(`/api/admin/system-config/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: payload,
  });
}
