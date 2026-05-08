"use client";

import * as React from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { systemConfigApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

type SystemConfigItem = {
  key: string;
  value: string;
  description: string;
  category: string;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
};

const DEFAULT_CONFIGS: SystemConfigItem[] = [
  {
    key: "addisai_nlp_temperature",
    value: "0.2",
    description: "Controls AI randomness. Lower = more factual intent extraction.",
    category: "AI Behavior",
    type: "number",
  },
  {
    key: "addisai_nlp_max_tokens",
    value: "500",
    description: "Maximum tokens the AI can generate in a single response.",
    category: "AI Behavior",
    type: "number",
  },
  {
    key: "addisai_tts_voice_am",
    value: "male_1",
    description: "Voice profile for Amharic text-to-speech.",
    category: "Voice Settings",
    type: "select",
    options: ["male_1", "female_1", "male_2", "female_2"],
  },
  {
    key: "addisai_tts_voice_om",
    value: "male_1",
    description: "Voice profile for Afaan Oromo text-to-speech.",
    category: "Voice Settings",
    type: "select",
    options: ["male_1", "female_1", "male_2", "female_2"],
  },
  {
    key: "ai_confidence_high_threshold",
    value: "0.80",
    description: "Confidence threshold for HIGH confidence (direct result).",
    category: "AI Confidence",
    type: "number",
  },
  {
    key: "ai_confidence_medium_threshold",
    value: "0.50",
    description: "Confidence threshold for MEDIUM confidence (clarification).",
    category: "AI Confidence",
    type: "number",
  },
  {
    key: "max_clarification_rounds",
    value: "3",
    description: "Maximum number of clarification questions before giving up.",
    category: "Session Limits",
    type: "number",
  },
  {
    key: "max_service_suggestions",
    value: "3",
    description: "Maximum number of service suggestions to show.",
    category: "Session Limits",
    type: "number",
  },
  {
    key: "stt_max_duration_seconds",
    value: "60",
    description: "Maximum duration for speech-to-text input (addis.ai hard limit).",
    category: "Voice Settings",
    type: "number",
  },
  {
    key: "kiosk_idle_timeout_seconds",
    value: "120",
    description: "Seconds of inactivity before kiosk resets to language selection.",
    category: "Kiosk Behavior",
    type: "number",
  },
  {
    key: "default_language",
    value: "AMHARIC",
    description: "Default language shown to citizens on the kiosk.",
    category: "Kiosk Behavior",
    type: "select",
    options: ["AMHARIC", "ENGLISH", "AFAAN_OROMO"],
  },
];

export default function SystemConfigPage() {
  const [configs, setConfigs] = React.useState<SystemConfigItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      setLoading(true);
      const data = await systemConfigApi.list();
      // Convert backend array to our config format
      const formattedConfigs: SystemConfigItem[] = DEFAULT_CONFIGS.map((defaultConfig) => {
        const backendConfig = data.find((c: any) => c.key === defaultConfig.key);
        return {
          ...defaultConfig,
          value: backendConfig?.value || defaultConfig.value,
          description: backendConfig?.description || defaultConfig.description,
        };
      });
      setConfigs(formattedConfigs);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load system config: ${error.message}`);
      } else {
        toast.error("Failed to load system config");
      }
    } finally {
      setLoading(false);
    }
  }

  const groupedConfigs = React.useMemo(() => {
    const groups: Record<string, SystemConfigItem[]> = {};
    configs.forEach((config) => {
      if (!groups[config.category]) {
        groups[config.category] = [];
      }
      groups[config.category].push(config);
    });
    return groups;
  }, [configs]);

  function updateConfig(key: string, value: string) {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value } : c)),
    );
    setHasChanges(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // Save each config item
      for (const config of configs) {
        await systemConfigApi.upsert(config.key, {
          value: config.value,
          description: config.description,
        });
      }
      toast.success("System configuration saved successfully");
      setHasChanges(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to save system config: ${error.message}`);
      } else {
        toast.error("Failed to save system config");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    setIsSaving(true);
    try {
      await loadConfigs();
      setHasChanges(false);
      toast.success("System configuration reset to server values");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to reset system config: ${error.message}`);
      } else {
        toast.error("Failed to reset system config");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function renderConfigInput(config: SystemConfigItem) {
    if (config.type === "select" && config.options) {
      return (
        <Select
          value={config.value}
          onValueChange={(value) => updateConfig(config.key, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (config.type === "number") {
      return (
        <Input
          type="number"
          step="0.01"
          value={config.value}
          onChange={(e) => updateConfig(config.key, e.target.value)}
        />
      );
    }

    if (config.type === "boolean") {
      return (
        <Switch
          checked={config.value === "true"}
          onCheckedChange={(checked) => updateConfig(config.key, checked ? "true" : "false")}
        />
      );
    }

    return (
      <Input
        value={config.value}
        onChange={(e) => updateConfig(config.key, e.target.value)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage AI behavior, thresholds, and system settings (SUPER_ADMIN only)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Config groups */}
      {loading ? (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading system configuration...</div>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedConfigs).map(([category, items]) => (
          <Card key={category} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">{category}</CardTitle>
              <CardDescription>
                Configure {category.toLowerCase()} settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((config) => (
                <div key={config.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={config.key} className="font-mono text-sm">
                      {config.key}
                    </Label>
                  </div>
                  {renderConfigInput(config)}
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                  {items.indexOf(config) < items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
