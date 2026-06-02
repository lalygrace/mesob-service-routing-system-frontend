"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setCode(value);
                }}
                className="text-center text-2xl tracking-widest"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trust-device"
                checked={trustDevice}
                onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="trust-device"
                className="text-sm font-normal cursor-pointer"
              >
                Trust this device for 30 days
              </Label>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground text-center">
                Don't have access to your authenticator app?
                <br />
                Contact your system administrator for assistance.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <Link href="/auth/login" className="w-full">
              <Button
                type="button"
                variant="outline"
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
      <TwoFactorPageContent />
    </PublicRoute>
  );
}
