"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function redirectIfAuthenticated() {
      const authenticated = await isAuthenticated();
      if (mounted && authenticated) {
        router.push("/admin");
      }
    }

    redirectIfAuthenticated();

    return () => {
      mounted = false;
    };
  }, [router]);

  return <>{children}</>;
}
