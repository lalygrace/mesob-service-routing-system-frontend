"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PublicRoute } from "@/components/auth/public-route";
import { signInWithEmail } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { LoginFormData } from "@/components/auth/login-form-data";

function LoginPageContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmail(email.trim(), password);
      toast.success("Signed in successfully");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Invalid credentials. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginFormData onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginPageContent />
    </PublicRoute>
  );
}
