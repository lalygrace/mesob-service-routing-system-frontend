import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "./permissions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  plugins: [
    adminClient({
      ac,
      roles,
    }),
  ],
});

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
