"use client";

import { useState } from "react";
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
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Windows PC",
      deviceType: "desktop",
      browser: "Chrome 120",
      location: "Addis Ababa, Ethiopia",
      ipAddress: "196.188.123.45",
      lastActive: "2 minutes ago",
      createdAt: "2024-05-04 10:30",
      isCurrent: true,
    },
    {
      id: "2",
      device: "iPhone 14",
      deviceType: "mobile",
      browser: "Safari 17",
      location: "Addis Ababa, Ethiopia",
      ipAddress: "196.188.123.46",
      lastActive: "1 hour ago",
      createdAt: "2024-05-03 14:20",
      isCurrent: false,
    },
    {
      id: "3",
      device: "iPad Pro",
      deviceType: "tablet",
      browser: "Safari 17",
      location: "Dire Dawa, Ethiopia",
      ipAddress: "196.188.124.12",
      lastActive: "3 hours ago",
      createdAt: "2024-05-02 09:15",
      isCurrent: false,
    },
  ]);

  const [success, setSuccess] = useState("");

  const handleRevokeSession = (id: string) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      setSessions(sessions.filter((session) => session.id !== id));
      setSuccess("Session revoked successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleRevokeAllSessions = () => {
    if (
      confirm(
        "Are you sure you want to revoke all other sessions? You will remain logged in on this device."
      )
    ) {
      setSessions(sessions.filter((session) => session.isCurrent));
      setSuccess("All other sessions revoked successfully");
      setTimeout(() => setSuccess(""), 3000);
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
