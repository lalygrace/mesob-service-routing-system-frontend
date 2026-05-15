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
  MapPin,
  Loader2,
} from "lucide-react";
import { getAdminMe, listSessions, revokeSession, revokeOtherSessions, type Session } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { logout } from "@/lib/auth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SessionView = Session & {
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location?: string;
  isCurrent: boolean;
};

function parseUserAgent(userAgent: string | null | undefined): {
  browser: string;
  deviceType: "desktop" | "mobile" | "tablet";
} {
  if (!userAgent) {
    return { browser: "Unknown", deviceType: "desktop" };
  }

  const agent = userAgent.toLowerCase();
  
  // Detect browser
  let browser = "Unknown";
  if (agent.includes("edg/")) browser = "Microsoft Edge";
  else if (agent.includes("chrome/")) browser = "Chrome";
  else if (agent.includes("firefox/")) browser = "Firefox";
  else if (agent.includes("safari/") && !agent.includes("chrome/")) browser = "Safari";
  else if (agent.includes("opera/") || agent.includes("opr/")) browser = "Opera";

  // Detect device type
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (agent.includes("ipad") || agent.includes("tablet")) deviceType = "tablet";
  else if (
    agent.includes("mobile") ||
    agent.includes("iphone") ||
    agent.includes("android")
  ) {
    deviceType = "mobile";
  }

  return { browser, deviceType };
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
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

  async function loadSessions() {
    try {
      const [meData, sessionsData] = await Promise.all([
        getAdminMe(),
        listSessions(),
      ]);

      const currentId = meData.session.id;
      setCurrentSessionId(currentId);

      const sessionViews: SessionView[] = sessionsData.map((session) => {
        const { browser, deviceType } = parseUserAgent(session.userAgent);
        return {
          ...session,
          browser,
          deviceType,
          isCurrent: session.id === currentId,
        };
      });

      // Sort: current session first, then by creation date (newest first)
      sessionViews.sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setSessions(sessionViews);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load sessions"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (mounted) {
        await loadSessions();
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleRevokeSession(sessionId: string, isCurrent: boolean) {
    if (isCurrent) {
      // Sign out current session
      try {
        await logout();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to sign out"));
      }
      return;
    }

    setRevokingSessionId(sessionId);
    try {
      await revokeSession(sessionId);
      toast.success("Session revoked successfully");
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to revoke session"));
    } finally {
      setRevokingSessionId(null);
      setSessionToRevoke(null);
    }
  }

  async function handleRevokeOtherSessions() {
    setIsRevokingOthers(true);
    try {
      await revokeOtherSessions();
      toast.success("All other sessions revoked successfully");
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to revoke other sessions"));
    } finally {
      setIsRevokingOthers(false);
    }
  }

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
          <p className="text-muted-foreground">
            Manage your active sessions across all devices
          </p>
        </div>
        {otherSessionsCount > 0 && (
          <Button
            variant="destructive"
            onClick={handleRevokeOtherSessions}
            disabled={isRevokingOthers || isLoading}
          >
            {isRevokingOthers ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revoking...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Revoke All Other Sessions
              </>
            )}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading sessions..."
              : `You have ${sessions.length} active ${sessions.length === 1 ? "session" : "sessions"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No active sessions found.
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const expiresAtLabel = new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(session.expiresAt));

                const createdAtLabel = new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(session.createdAt));

                const isRevoking = revokingSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div className="flex gap-4">
                      <div className="mt-1">{getDeviceIcon(session.deviceType)}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {session.isCurrent ? "Current Device" : session.browser}
                          </h3>
                          {session.isCurrent && (
                            <Badge variant="default">Current Session</Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-3 w-3" />
                            <span>{session.browser}</span>
                          </div>
                          {session.ipAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{session.ipAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Created: {createdAtLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Expires: {expiresAtLabel}</span>
                          </div>
                          <div className="text-xs">Session ID: {session.id}</div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={session.isCurrent ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setSessionToRevoke(session.id)}
                      disabled={isRevoking}
                    >
                      {isRevoking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Revoking...
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          {session.isCurrent ? "Sign Out" : "Revoke"}
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
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
                  Revoke unknown sessions and change your password immediately.
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

      <AlertDialog open={!!sessionToRevoke} onOpenChange={(open) => !open && setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session</AlertDialogTitle>
            <AlertDialogDescription>
              {sessions.find((s) => s.id === sessionToRevoke)?.isCurrent
                ? "This will sign you out of your current session. You will need to sign in again."
                : "This will revoke the selected session. The user will be signed out from that device."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (sessionToRevoke) {
                  const session = sessions.find((s) => s.id === sessionToRevoke);
                  handleRevokeSession(sessionToRevoke, session?.isCurrent ?? false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {sessions.find((s) => s.id === sessionToRevoke)?.isCurrent
                ? "Sign Out"
                : "Revoke Session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
