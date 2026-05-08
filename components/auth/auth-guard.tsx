"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const isRedirecting = useRef(false);
  const checkInProgress = useRef(false);

  useEffect(() => {
    // Prevent infinite loop - skip if already checking or redirecting
    if (isRedirecting.current || checkInProgress.current) return;
    
    // Don't check if already on login page
    if (pathname === "/auth/login") {
      setIsChecking(false);
      return;
    }

    // Check sessionStorage to prevent rapid re-checks
    const lastCheck = sessionStorage.getItem('auth_check_timestamp');
    const now = Date.now();
    if (lastCheck && now - parseInt(lastCheck) < 5000) {
      // If checked within last 5 seconds, skip
      setIsChecking(false);
      return;
    }

    const checkAuth = async () => {
      checkInProgress.current = true;
      sessionStorage.setItem('auth_check_timestamp', now.toString());
      
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          isRedirecting.current = true;
          router.push("/auth/login");
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to login to be safe
        isRedirecting.current = true;
        router.push("/auth/login");
      } finally {
        checkInProgress.current = false;
        // Reset redirect flag after navigation
        setTimeout(() => {
          isRedirecting.current = false;
        }, 500);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
