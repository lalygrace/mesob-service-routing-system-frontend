/**
 * Authentication utilities integrated with backend better-auth
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
}

// Note: Most auth operations should use the auth-client from @/lib/auth-client
// This file is kept for backward compatibility and type definitions
