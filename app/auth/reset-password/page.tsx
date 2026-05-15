"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { PublicRoute } from "@/components/auth/public-route";
import { resetPassword, acceptAdminInvitation } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [missingToken, setMissingToken] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [flow, setFlow] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const flowParam = searchParams.get("flow");

    queueMicrotask(() => {
      if (!tokenParam) {
        setMissingToken(true);
        toast.error("Invalid or missing reset token");
      } else {
        setToken(tokenParam);
        setFlow(flowParam);
        setMissingToken(false);
      }
    });
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    // For admin invitations, use the backend's validation (min 10 characters)
    const minLength = flow === "admin-invitation" || flow === "super-admin-setup" ? 10 : 8;
    
    if (pwd.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);

    try {
      // Check if this is an admin invitation or password reset
      if (flow === "admin-invitation" || flow === "super-admin-setup") {
        await acceptAdminInvitation(token, password);
        toast.success("Password set successfully. You can now log in.");
      } else {
        await resetPassword(token, password);
        toast.success("Password reset successfully");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Failed to set password. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {flow === "admin-invitation" || flow === "super-admin-setup"
                ? "Password Set Successfully"
                : "Password Reset Successful"}
            </CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully {flow === "admin-invitation" || flow === "super-admin-setup" ? "set" : "reset"}. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {flow === "admin-invitation" || flow === "super-admin-setup"
              ? "Set Your Password"
              : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {flow === "admin-invitation" || flow === "super-admin-setup"
              ? "Create a password for your admin account"
              : "Enter your new password below"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least {flow === "admin-invitation" || flow === "super-admin-setup" ? "10" : "8"} characters with uppercase, lowercase, and
                numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || missingToken || !token}
            >
              {isLoading 
                ? "Setting Password..." 
                : flow === "admin-invitation" || flow === "super-admin-setup"
                  ? "Set Password"
                  : "Reset Password"}
            </Button>
            <Link href="/auth/login" className="w-full">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <PublicRoute>
      <Suspense fallback={null}>
        <ResetPasswordPageContent />
      </Suspense>
    </PublicRoute>
  );
}
