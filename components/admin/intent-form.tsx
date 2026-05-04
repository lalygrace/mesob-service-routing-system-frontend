"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { IntentMapping } from "@/lib/mock/intents";
import { MOCK_SERVICES } from "@/lib/mock/services";

type IntentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intent?: IntentMapping | null;
  onSave: (data: Omit<IntentMapping, "id" | "createdAt" | "usageCount">) => void;
};

export function IntentForm({ open, onOpenChange, intent, onSave }: IntentFormProps) {
  const isEdit = !!intent;

  const [phrase, setPhrase] = React.useState("");
  const [language, setLanguage] = React.useState<"en" | "am" | "om">("en");
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>([]);
  const [confidence, setConfidence] = React.useState(85);

  React.useEffect(() => {
    if (intent) {
      setPhrase(intent.phrase);
      setLanguage(intent.language);
      setSelectedServiceIds(intent.mappedServiceIds);
      setConfidence(intent.confidence);
    } else {
      setPhrase("");
      setLanguage("en");
      setSelectedServiceIds([]);
      setConfidence(85);
    }
  }, [intent, open]);

  function toggleService(serviceId: string) {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mappedServiceNames = MOCK_SERVICES
      .filter((s) => selectedServiceIds.includes(s.id))
      .map((s) => s.title);

    onSave({
      phrase,
      language,
      mappedServiceIds: selectedServiceIds,
      mappedServiceNames,
      confidence,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Intent Mapping" : "Add Intent Mapping"}
            </DialogTitle>
            <DialogDescription>
              Map a common citizen phrase to one or more services.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="intent-phrase">Phrase</Label>
              <Input
                id="intent-phrase"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="e.g. I lost my ID card"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "am" | "om")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">Amharic</SelectItem>
                    <SelectItem value="om">Afaan Oromo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="intent-confidence">Confidence (%)</Label>
                <Input
                  id="intent-confidence"
                  type="number"
                  min={0}
                  max={100}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mapped Services</Label>
              <div className="rounded-lg border border-border/50 p-3 space-y-2 max-h-48 overflow-y-auto">
                {MOCK_SERVICES.map((svc) => (
                  <label
                    key={svc.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/50 rounded px-2 py-1.5 -mx-1"
                  >
                    <Checkbox
                      checked={selectedServiceIds.includes(svc.id)}
                      onCheckedChange={() => toggleService(svc.id)}
                    />
                    <span>{svc.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedServiceIds.length === 0}>
              {isEdit ? "Save Changes" : "Create Mapping"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
