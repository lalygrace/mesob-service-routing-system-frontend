import { apiData, apiRequest } from "./client";

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "VIEWER"
  | "super_admin"
  | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: AdminRole | AdminRole[] | null;
  organizationId?: string | null;
  isActive?: boolean | null;
  phone?: string | null;
  location?: string | null;
};

export type AdminMe = {
  session: {
    id: string;
    expiresAt: string;
  };
  user: AuthUser | null;
};

export function signInWithEmail(email: string, password: string) {
  return apiRequest<unknown>("/api/auth/sign-in/email", {
    method: "POST",
    body: { email, password },
  });
}

export function signOut() {
  return apiRequest<unknown>("/api/auth/sign-out", {
    method: "POST",
  });
}

export function requestPasswordReset(email: string) {
  return apiRequest<unknown>("/api/auth/request-password-reset", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(token: string, password: string) {
  return apiRequest<unknown>("/api/auth/reset-password", {
    method: "POST",
    body: { token, newPassword: password },
  });
}

export function acceptAdminInvitation(token: string, password: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/admin-invitation/accept",
    {
      method: "POST",
      body: { token, password },
    },
  );
}

export function getAdminMe() {
  return apiData<AdminMe>("/api/admin/me");
}

export function updateAdminMe(
  payload: Pick<AuthUser, "name" | "phone" | "location" | "image">,
) {
  return apiData<AuthUser>("/api/admin/me", {
    method: "PATCH",
    body: payload,
  });
}

export function changeAdminPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiRequest<{ success: boolean; message: string }>(
    "/api/admin/change-password",
    {
      method: "POST",
      body: payload,
    },
  );
}

// Session Management
export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function listSessions() {
  return apiData<Session[]>("/api/auth/list-sessions");
}

export function revokeSession(sessionId: string) {
  return apiRequest<{ success: boolean }>("/api/auth/revoke-session", {
    method: "POST",
    body: { token: sessionId }, // Better Auth expects 'token' not 'sessionId'
  });
}

export function revokeOtherSessions() {
  return apiRequest<{ success: boolean }>("/api/auth/revoke-other-sessions", {
    method: "POST",
  });
}
