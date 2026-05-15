"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getAdminMe } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

type SessionView = {
  id: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  expiresAt: string;
  isCurrent: boolean;
};

function detectDeviceType(): SessionView["deviceType"] {
  if (typeof navigator === "undefined") return "desktop";
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("ipad") || agent.includes("tablet")) return "tablet";
  if (
    agent.includes("mobile") ||
    agent.includes("iphone") ||
    agent.includes("android")
  ) {
    return "mobile";
  }
  return "desktop";
}

function detectBrowser() {
  if (typeof navigator === "undefined") return "Current browser";
  const agent = navigator.userAgent;
  if (agent.includes("Edg/")) return "Microsoft Edge";
  if (agent.includes("Chrome/")) return "Chrome";
  if (agent.includes("Firefox/")) return "Firefox";
  if (agent.includes("Safari/") && !agent.includes("Chrome/")) return "Safari";
  return "Current browser";
}

function getDeviceIcon(deviceType: SessionView["deviceType"]) {
  switch (deviceType) {
    case "desktop":
      return <Monitor className="h-5 w-5" />;
    case "mobile":
      return <Smartphone className="h-5 w-5" />;
    case "tablet":
      return <Tablet className="h-5 w-5" />;
  }
}

export default function SessionsPage() {
  const [session, setSession] = useState<SessionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const data = await getAdminMe();
        if (!mounted) return;
        setSession({
          id: data.session.id,
          expiresAt: data.session.expiresAt,
          deviceType: detectDeviceType(),
          browser: detectBrowser(),
          isCurrent: true,
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load active session"));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const expiresAtLabel = session?.expiresAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(session.expiresAt))
    : "Unknown";

  async function handleSignOutCurrentSession() {
    setIsSigningOut(true);
    try {
      await logout();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to sign out"));
      setIsSigningOut(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
          <p className="text-muted-foreground">
            Manage your current authenticated backend session
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleSignOutCurrentSession}
          disabled={isSigningOut || isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? "Signing Out..." : "Sign Out Current Session"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Session</CardTitle>
          <CardDescription>
            The backend currently exposes your authenticated session.
            Other-device session management can be added when the backend
            exposes those endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">
              Loading session...
            </div>
          ) : !session ? (
            <div className="p-4 text-sm text-muted-foreground">
              No active session found.
            </div>
          ) : (
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="flex gap-4">
                <div className="mt-1">{getDeviceIcon(session.deviceType)}</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Current Device</h3>
                    <Badge variant="default">Current Session</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <span>{session.browser}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Expires: {expiresAtLabel}</span>
                    </div>
                    <div className="text-xs">Session ID: {session.id}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">
                  Do not recognize account activity?
                </p>
                <p className="text-sm text-muted-foreground">
                  Sign out and change your password immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Keep your account secure</p>
                <p className="text-sm text-muted-foreground">
                  Always sign out from shared or public devices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
