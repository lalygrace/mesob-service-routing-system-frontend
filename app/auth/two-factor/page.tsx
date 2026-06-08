"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, ArrowLeft, ShieldCheck, Check, AlertCircle, Loader2 } from "lucide-react";
import { PublicRoute } from "@/components/auth/public-route";
import { verify2FATOTP } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import Link from "next/link";

function TwoFactorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user came from login
  useEffect(() => {
    const from = searchParams.get("from");
    if (!from || from !== "login") {
      // Redirect to login if not coming from login flow
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (code.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      await verify2FATOTP(code.trim(), trustDevice);
      toast.success("Verification successful");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Invalid verification code. Please try again."),
      );
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value);
    
    // Auto-submit when 6 digits are entered
    if (value.length === 6 && !isLoading) {
      // Small delay to show the complete code
      setTimeout(() => {
        const form = e.target.form;
        if (form) {
          form.requestSubmit();
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center pb-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Two-Factor Verification
            </CardTitle>
            <CardDescription className="text-base">
              Enter the 6-digit code from your authenticator app to continue
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-base">
                Verification Code
              </Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="• • • • • •"
                value={code}
                onChange={handleCodeInput}
                className="text-center text-3xl tracking-[0.5em] font-bold h-16 px-4"
                required
                disabled={isLoading}
                autoFocus
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground text-center pt-1">
                The code refreshes every 30 seconds
              </p>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trust-device"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="trust-device"
                    className="text-sm font-medium cursor-pointer leading-none"
                  >
                    Trust this device for 30 days
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You won't need to verify on this device again for 30 days
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Need help?</AlertTitle>
              <AlertDescription className="text-sm">
                If you don't have access to your authenticator app, contact your system administrator for assistance.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 text-base" 
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verify and Continue
                </>
              )}
            </Button>

            <Link href="/auth/login" className="w-full">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <PublicRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <TwoFactorPageContent />
      </Suspense>
    </PublicRoute>
  );
}
