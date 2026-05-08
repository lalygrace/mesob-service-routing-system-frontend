/**
 * Authentication utilities integrated with backend better-auth
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator" | "viewer";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/admin/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${API_URL}/api/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
