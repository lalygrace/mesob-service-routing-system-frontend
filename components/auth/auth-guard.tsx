"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isChecking, setIsChecking] = useState(true);
  const isRedirecting = useRef(false);
  const checkInProgress = useRef(false);

  useEffect(() => {
    // Prevent infinite loop - skip if already checking or redirecting
    if (isRedirecting.current || checkInProgress.current) return;
    
    // Don't check if already on login page or other auth pages
    if (pathname.startsWith("/auth/")) {
      setIsChecking(false);
      return;
    }

    const checkAuth = () => {
      checkInProgress.current = true;
      
      try {
        if (!session?.user) {
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
  }, [router, pathname, session]);

  if (isChecking || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
