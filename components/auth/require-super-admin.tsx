"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminMe } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";

interface RequireSuperAdminProps {
  children: React.ReactNode;
}

/**
 * Client-side guard that ensures only SUPER_ADMIN users can access the wrapped content.
 * Redirects non-super-admin users to the dashboard.
 */
export function RequireSuperAdmin({ children }: RequireSuperAdminProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuthorization() {
      try {
        const data = await getAdminMe();
        
        if (!mounted) return;

        // Check if user has SUPER_ADMIN role
        const role = Array.isArray(data.user?.role) 
          ? data.user.role[0] 
          : data.user?.role;

        if (role === "SUPER_ADMIN" || role === "super_admin") {
          setIsAuthorized(true);
        } else {
          // Not authorized - redirect to dashboard
          router.push("/admin");
        }
      } catch (error) {
        // Authentication failed - redirect to login
        if (mounted) {
          router.push("/auth/login");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthorization();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect, so don't render anything
  }

  return <>{children}</>;
}
