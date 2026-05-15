import {
  getAdminMe,
  signOut,
  type AdminMe,
  type AuthUser,
} from "@/lib/api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  rawRole?: AuthUser["role"];
  authorityId?: string | null;
  phone?: string | null;
  location?: string | null;
}

function normalizeRole(role: AuthUser["role"]): User["role"] {
  const value = Array.isArray(role) ? role[0] : role;
  if (value === "SUPER_ADMIN" || value === "super_admin") return "super_admin";
  if (value === "EDITOR" || value === "VIEWER") return "moderator";
  return "admin";
}

export function toUser(user: AuthUser | null | undefined): User | null {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    rawRole: user.role,
    authorityId: user.authorityId,
    phone: user.phone,
    location: user.location,
  };
}

export async function getCurrentSession(): Promise<AdminMe | null> {
  try {
    return await getAdminMe();
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return Boolean(session?.user);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession();
  return toUser(session?.user);
}

export async function logout() {
  try {
    await signOut();
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
}

export async function requireAuth() {
  if (typeof window === "undefined") return;

  if (!(await isAuthenticated())) {
    window.location.href = "/auth/login";
  }
}
