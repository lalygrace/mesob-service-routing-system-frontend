"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  return <>{children}</>;
}
