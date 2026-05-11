"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { adminMeApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    async function loadUserDetails() {
      if (session?.user) {
        try {
          setIsLoadingDetails(true);
          const response = await adminMeApi.getMe();
          setUserDetails(response.data.user);
        } catch (error) {
          if (error instanceof ApiError) {
            console.error("Failed to load user details:", error.message);
          }
          // Don't show toast on every auth check, just log error
        } finally {
          setIsLoadingDetails(false);
        }
      } else {
        setUserDetails(null);
      }
    }

    loadUserDetails();
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{
        user: userDetails || session?.user || null,
        isLoading: isPending || isLoadingDetails,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
