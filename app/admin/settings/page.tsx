"use client";

import * as React from "react";
import { Globe, Palette, Bell, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { systemConfigApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [systemName, setSystemName] = React.useState("Mesob Service Navigator");
  const [defaultLang, setDefaultLang] = React.useState("en");
  const [kioskMode, setKioskMode] = React.useState(true);
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [autoTimeout, setAutoTimeout] = React.useState(120);
  const [emailAlerts, setEmailAlerts] = React.useState(false);
  const [dailyReports, setDailyReports] = React.useState(true);

  React.useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const configs = await systemConfigApi.list();
      configs.forEach((config: any) => {
        switch (config.key) {
          case "system_name":
            setSystemName(config.value);
            break;
          case "default_language":
            setDefaultLang(config.value);
            break;
          case "kiosk_mode":
            setKioskMode(config.value === "true");
            break;
          case "voice_enabled":
            setVoiceEnabled(config.value === "true");
            break;
          case "auto_timeout":
            setAutoTimeout(Number(config.value));
            break;
          case "email_alerts":
            setEmailAlerts(config.value === "true");
            break;
          case "daily_reports":
            setDailyReports(config.value === "true");
            break;
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load settings: ${error.message}`);
      } else {
        toast.error("Failed to load settings");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const settings = [
        { key: "system_name", value: systemName, description: "System display name" },
        { key: "default_language", value: defaultLang, description: "Default language for kiosk" },
        { key: "kiosk_mode", value: String(kioskMode), description: "Kiosk fullscreen mode" },
        { key: "voice_enabled", value: String(voiceEnabled), description: "Enable voice interaction" },
        { key: "auto_timeout", value: String(autoTimeout), description: "Auto-reset timeout in seconds" },
        { key: "email_alerts", value: String(emailAlerts), description: "Email error alerts" },
        { key: "daily_reports", value: String(dailyReports), description: "Daily usage reports" },
      ];

      for (const setting of settings) {
        await systemConfigApi.upsert(setting.key, {
          value: setting.value,
          description: setting.description,
        });
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to save settings: ${error.message}`);
      } else {
        toast.error("Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and behavior
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── General Settings ──────────────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">General</CardTitle>
                <CardDescription>System name and language</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="sys-name">System Name</Label>
              <Input
                id="sys-name"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select value={defaultLang} onValueChange={setDefaultLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="am">Amharic</SelectItem>
                  <SelectItem value="om">Afaan Oromo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Initial language shown to citizens on the kiosk
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-toggle" className="font-medium">
                  Voice Interaction
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable voice input and text-to-speech responses
                </p>
              </div>
              <Switch
                id="voice-toggle"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Kiosk Settings ───────────────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Monitor className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Kiosk Display</CardTitle>
                <CardDescription>Kiosk behavior and timeouts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="kiosk-toggle" className="font-medium">
                  Kiosk Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Fullscreen, touch-optimized interface
                </p>
              </div>
              <Switch
                id="kiosk-toggle"
                checked={kioskMode}
                onCheckedChange={setKioskMode}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="timeout">Auto-Reset Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min={30}
                max={600}
                value={autoTimeout}
                onChange={(e) => setAutoTimeout(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Kiosk resets to the language selection after this idle period
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
                  <img
                    src="/mesoblogo.png"
                    alt="Mesob Logo"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">mesoblogo.png</p>
                  <p className="text-xs text-muted-foreground">Current brand logo</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Appearance ───────────────────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription>Theme and branding</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border border-border"
                  style={{ backgroundColor: "#1520A6" }}
                />
                <div>
                  <p className="text-sm font-medium">Azure #1520A6</p>
                  <p className="text-xs text-muted-foreground">
                    Primary brand color
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs font-mono">
                  oklch(0.33 0.22 268)
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <p className="text-xs text-muted-foreground">
                Managed via the theme toggle in the header. System preference is
                respected by default.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Notifications ────────────────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Alerts and reports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts" className="font-medium">
                  Email Alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when the system encounters errors
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reports" className="font-medium">
                  Daily Reports
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive a daily summary of usage metrics
                </p>
              </div>
              <Switch
                id="daily-reports"
                checked={dailyReports}
                onCheckedChange={setDailyReports}
              />
            </div>

            <Separator />

            <Button variant="outline" className="w-full" disabled>
              Configure Email Recipients
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="lg" className="px-8" onClick={handleSave} disabled={loading || saving}>
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
