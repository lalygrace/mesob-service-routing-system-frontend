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
  twoFactorEnabled?: boolean | null;
};

export type AdminMe = {
  session: {
    id: string;
    expiresAt: string;
  };
  user: AuthUser | null;
};

export type SignInResponse = {
  user?: AuthUser;
  session?: {
    id: string;
    expiresAt: string;
  };
  twoFactorRedirect?: boolean;
};

export function signInWithEmail(email: string, password: string, captchaToken?: string) {
  const headers: Record<string, string> = {};
  if (captchaToken) {
    headers['x-captcha-response'] = captchaToken;
  }
  
  return apiData<SignInResponse>("/api/auth/sign-in/email", {
    method: "POST",
    body: { email, password },
    headers,
  });
}

export function signOut() {
  return apiRequest<unknown>("/api/auth/sign-out", {
    method: "POST",
  });
}

export function requestPasswordReset(email: string, captchaToken?: string) {
  const headers: Record<string, string> = {};
  if (captchaToken) {
    headers['x-captcha-response'] = captchaToken;
  }
  
  return apiRequest<unknown>("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
    headers,
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

// Two-Factor Authentication
export type Enable2FAResponse = {
  totpURI: string;
  backupCodes: string[];
};

export function enable2FA(password: string) {
  return apiData<Enable2FAResponse>("/api/auth/two-factor/enable", {
    method: "POST",
    body: { password },
  });
}

export function disable2FA(password: string) {
  return apiRequest<{ success: boolean }>("/api/auth/two-factor/disable", {
    method: "POST",
    body: { password },
  });
}

export function verify2FATOTP(code: string, trustDevice: boolean = false) {
  return apiRequest<{ success: boolean }>("/api/auth/two-factor/verify-totp", {
    method: "POST",
    body: { code, trustDevice },
  });
}

export function get2FAURI(password: string) {
  return apiData<{ totpURI: string }>("/api/auth/two-factor/get-totp-uri", {
    method: "POST",
    body: { password },
  });
}
