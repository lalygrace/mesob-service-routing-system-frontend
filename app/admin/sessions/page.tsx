"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MoreVertical,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
// import { sessionsApi, ApiError } from "@/lib/api-client";
// import { toast } from "sonner";

// NOTE: Admin sessions management is not implemented in backend
// Citizen sessions are managed via citizenSessionsApi for kiosk flow

interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // async function loadSessions() {
  //   try {
  //     setLoading(true);
  //     const data = await sessionsApi.list();
  //     setSessions(data);
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       toast.error(`Failed to load sessions: ${error.message}`);
  //     } else {
  //       toast.error("Failed to load sessions");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleRevokeSession = async (id: string) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      try {
        // Note: Session revocation would need a backend endpoint
        // For now, we'll just update local state
        setSessions(sessions.filter((session) => session.id !== id));
        // toast.success("Session revoked successfully");
      } catch (error) {
        // toast.error("Failed to revoke session");
      }
    }
  };

  const handleRevokeAllSessions = () => {
    if (
      confirm(
        "Are you sure you want to revoke all other sessions? You will remain logged in on this device."
      )
    ) {
      try {
        // Note: This would need a backend endpoint
        setSessions(sessions.filter((session) => session.isCurrent));
        // toast.success("All other sessions revoked successfully");
      } catch (error) {
        // toast.error("Failed to revoke sessions");
      }
    }
  };

  const getDeviceIcon = (deviceType: Session["deviceType"]) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="h-5 w-5" />;
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
          <p className="text-muted-foreground">
            Manage your active login sessions across devices
          </p>
        </div>
        <Button variant="destructive" onClick={handleRevokeAllSessions}>
          <LogOut className="mr-2 h-4 w-4" />
          Revoke All Other Sessions
        </Button>
      </div>

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
          <CardDescription>
            These are the devices currently logged into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex gap-4">
                    <div className="mt-1">{getDeviceIcon(session.deviceType)}</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{session.device}</h3>
                        {session.isCurrent && (
                          <Badge variant="default">Current Session</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-3 w-3" />
                          <span>{session.browser}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {session.location} • {session.ipAddress}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Last active: {session.lastActive}</span>
                        </div>
                        <div className="text-xs">
                          Signed in: {session.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Revoke Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
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
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">
                  Don't recognize a session?
                </p>
                <p className="text-sm text-muted-foreground">
                  If you see a session you don't recognize, revoke it immediately
                  and change your password.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Keep your account secure</p>
                <p className="text-sm text-muted-foreground">
                  Always log out from shared or public devices. Use strong,
                  unique passwords.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
