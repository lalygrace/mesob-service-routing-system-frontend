/**
 * Authentication utilities
 * TODO: Replace with actual authentication implementation
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const email = localStorage.getItem("userEmail");
  if (!email) return null;

  // Mock user data
  return {
    id: "1",
    name: "Admin User",
    email: email,
    role: "super_admin",
  };
}

export function logout() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  window.location.href = "/auth/login";
}

export function requireAuth() {
  if (typeof window === "undefined") return;
  
  if (!isAuthenticated()) {
    window.location.href = "/auth/login";
  }
}
