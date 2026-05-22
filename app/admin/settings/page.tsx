"use client";

import * as React from "react";
import Image from "next/image";
import {
  Globe,
  Palette,
  Bell,
  Monitor,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { listSystemConfig, updateSystemConfig } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";
import { RequireSuperAdmin } from "@/components/auth/require-super-admin";

function SettingsPageContent() {
  const [systemName, setSystemName] = React.useState("Mesob Service Navigator");
  const [defaultLang, setDefaultLang] = React.useState("en");
  const [kioskMode, setKioskMode] = React.useState(true);
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [autoTimeout, setAutoTimeout] = React.useState(120);
  const [emailAlerts, setEmailAlerts] = React.useState(false);
  const [dailyReports, setDailyReports] = React.useState(true);

  // AI Engine state
  const [geminiApiKey, setGeminiApiKey] = React.useState("");
  const [geminiApiKeyVisible, setGeminiApiKeyVisible] = React.useState(false);
  const [geminiModel, setGeminiModel] = React.useState("gemini-2.5-flash");
  const [geminiTemperature, setGeminiTemperature] = React.useState(0.0);
  const [geminiMaxTokens, setGeminiMaxTokens] = React.useState(2000);
  
  const [addisAiApiKey, setAddisAiApiKey] = React.useState("");
  const [addisAiApiKeyVisible, setAddisAiApiKeyVisible] = React.useState(false);
  const [addisAiBaseUrl, setAddisAiBaseUrl] = React.useState(
    "https://api.addisassistant.com",
  );
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      listSystemConfig()
        .then((configs) => {
          if (!mounted) return;
          const byKey = new Map(
            configs.map((config) => [config.key, config.value]),
          );
          setSystemName(byKey.get("system_name") ?? "Mesob Service Navigator");
          setDefaultLang(byKey.get("default_language") ?? "en");
          setKioskMode((byKey.get("kiosk_mode") ?? "true") === "true");
          setVoiceEnabled((byKey.get("voice_enabled") ?? "true") === "true");
          setAutoTimeout(
            Number(byKey.get("auto_reset_timeout_seconds") ?? 120),
          );
          setEmailAlerts(
            (byKey.get("email_alerts_enabled") ?? "false") === "true",
          );
          setDailyReports(
            (byKey.get("daily_reports_enabled") ?? "true") === "true",
          );
          
          // Gemini Configuration
          setGeminiApiKey(byKey.get("gemini_api_key") ?? "");
          setGeminiModel(byKey.get("gemini_model") ?? "gemini-2.5-flash");
          setGeminiTemperature(Number(byKey.get("gemini_temperature") ?? 0.0));
          setGeminiMaxTokens(Number(byKey.get("gemini_max_tokens") ?? 2000));
          
          // AddisAI Configuration
          setAddisAiApiKey(byKey.get("addis_ai_api_key") ?? "");
          setAddisAiBaseUrl(
            byKey.get("addis_ai_base_url") ?? "https://api.addisassistant.com",
          );
        })
        .catch((error) => {
          toast.error(getApiErrorMessage(error, "Failed to load settings"));
        })
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSaveSettings() {
    setIsSaving(true);

    try {
      await Promise.all([
        updateSystemConfig("system_name", { value: systemName }),
        updateSystemConfig("default_language", { value: defaultLang }),
        updateSystemConfig("kiosk_mode", { value: String(kioskMode) }),
        updateSystemConfig("voice_enabled", { value: String(voiceEnabled) }),
        updateSystemConfig("auto_reset_timeout_seconds", {
          value: String(autoTimeout),
        }),
        updateSystemConfig("email_alerts_enabled", {
          value: String(emailAlerts),
        }),
        updateSystemConfig("daily_reports_enabled", {
          value: String(dailyReports),
        }),
        // Gemini Configuration
        updateSystemConfig("gemini_api_key", { value: geminiApiKey }),
        updateSystemConfig("gemini_model", { value: geminiModel }),
        updateSystemConfig("gemini_temperature", {
          value: String(geminiTemperature),
        }),
        updateSystemConfig("gemini_max_tokens", {
          value: String(geminiMaxTokens),
        }),
        // AddisAI Configuration
        updateSystemConfig("addis_ai_api_key", { value: addisAiApiKey }),
        updateSystemConfig("addis_ai_base_url", { value: addisAiBaseUrl }),
      ]);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save settings"));
    } finally {
      setIsSaving(false);
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
                  <Image
                    src="/mesoblogo.png"
                    alt="Mesob Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">mesoblogo.png</p>
                  <p className="text-xs text-muted-foreground">
                    Current brand logo
                  </p>
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

        {/* ── AI Engine: Gemini (Primary Intelligence) ──────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">
                  Gemini AI (Primary Intelligence Layer)
                </CardTitle>
                <CardDescription>
                  Google Gemini Flash for intent understanding and service routing
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Primary
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="gemini-api-key">GEMINI_API_KEY</Label>
              <div className="relative">
                <Input
                  id="gemini-api-key"
                  type={geminiApiKeyVisible ? "text" : "password"}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setGeminiApiKeyVisible(!geminiApiKeyVisible)}
                >
                  {geminiApiKeyVisible ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gemini-model">Model</Label>
                <Select value={geminiModel} onValueChange={setGeminiModel}>
                  <SelectTrigger id="gemini-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.5-flash">
                      gemini-2.5-flash (Recommended)
                    </SelectItem>
                    <SelectItem value="gemini-2.0-flash">
                      gemini-2.0-flash
                    </SelectItem>
                    <SelectItem value="gemini-1.5-flash">
                      gemini-1.5-flash
                    </SelectItem>
                    <SelectItem value="gemini-1.5-flash-8b">
                      gemini-1.5-flash-8b
                    </SelectItem>
                    <SelectItem value="gemini-1.5-pro">
                      gemini-1.5-pro
                    </SelectItem>
                    <SelectItem value="gemini-pro">
                      gemini-pro (Legacy)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Flash models are optimized for speed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemini-temperature">Temperature</Label>
                <Input
                  id="gemini-temperature"
                  type="number"
                  min={0.0}
                  max={2.0}
                  step={0.1}
                  value={geminiTemperature}
                  onChange={(e) => setGeminiTemperature(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  0.0 = deterministic (recommended for routing)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemini-max-tokens">Max Output Tokens</Label>
                <Input
                  id="gemini-max-tokens"
                  type="number"
                  min={100}
                  max={8192}
                  step={100}
                  value={geminiMaxTokens}
                  onChange={(e) => setGeminiMaxTokens(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum response length
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">About Gemini Integration</p>
                  <p className="text-xs text-muted-foreground">
                    Gemini Flash is the primary intelligence layer responsible for understanding citizen requests,
                    matching them to services, and generating clarification questions. It processes all natural
                    language input and makes routing decisions based on the service catalog.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── AI Engine: AddisAI (Audio Processing) ──────────────────────────── */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">
                  AddisAI (Audio Processing Layer)
                </CardTitle>
                <CardDescription>
                  Speech-to-Text and Text-to-Speech for Ethiopian languages
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Audio
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="addis-ai-api-key">ADDIS_AI_API_KEY</Label>
              <div className="relative">
                <Input
                  id="addis-ai-api-key"
                  type={addisAiApiKeyVisible ? "text" : "password"}
                  value={addisAiApiKey}
                  onChange={(e) => setAddisAiApiKey(e.target.value)}
                  placeholder="sk_..."
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setAddisAiApiKeyVisible(!addisAiApiKeyVisible)}
                >
                  {addisAiApiKeyVisible ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your secret API key from the{" "}
                <a
                  href="https://platform.addisassistant.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  AddisAI Dashboard
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addis-ai-base-url">ADDIS_AI_BASE_URL</Label>
              <Input
                id="addis-ai-base-url"
                value={addisAiBaseUrl}
                onChange={(e) => setAddisAiBaseUrl(e.target.value)}
                placeholder="https://api.addisassistant.com"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Production API base URL. Change only for custom deployments.
              </p>
            </div>

            <Separator />

            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">About AddisAI Integration</p>
                  <p className="text-xs text-muted-foreground">
                    AddisAI provides specialized audio processing for Ethiopian languages. It handles Speech-to-Text
                    (STT) transcription using the addis-whisper model and Text-to-Speech (TTS) synthesis using
                    አሌፍ-Audio-AM (Amharic) and አሌፍ-Audio-OM (Afaan Oromo) models. These models are purpose-built
                    for Ethiopian languages and provide superior accuracy compared to generic alternatives.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">STT Model</p>
                <p className="mt-1 text-sm font-semibold">addis-whisper</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Speech-to-Text for am, om, en
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">TTS Model (Amharic)</p>
                <p className="mt-1 text-sm font-semibold">አሌፍ-Audio-AM</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Natural Amharic voice synthesis
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">TTS Model (Oromo)</p>
                <p className="mt-1 text-sm font-semibold">አሌፍ-Audio-OM</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Natural Afaan Oromo voice synthesis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="px-8"
          onClick={handleSaveSettings}
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireSuperAdmin>
      <SettingsPageContent />
    </RequireSuperAdmin>
  );
}
