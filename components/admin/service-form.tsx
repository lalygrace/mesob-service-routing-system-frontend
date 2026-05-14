"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Service, LanguageCode } from "@/lib/service-navigator/types";
import type { Authority } from "@/lib/api/authorities";

type ServiceFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  authorities: Authority[];
  onSave: (data: Omit<Service, "id">) => void;
};

function LanguageSectionHeader({
  flag,
  label,
  code,
}: {
  flag: string;
  label: string;
  code: string;
}) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <Badge
        variant="outline"
        className="gap-1.5 text-xs font-medium px-2.5 py-0.5"
      >
        <span>{flag}</span>
        {code}
      </Badge>
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  authorities,
  onSave,
}: ServiceFormProps) {
  const isEdit = !!service;

  const [title, setTitle] = React.useState("");
  const [titleAm, setTitleAm] = React.useState("");
  const [titleOm, setTitleOm] = React.useState("");
  const [authorityId, setAuthorityId] = React.useState("");
  const [locationHint, setLocationHint] = React.useState("");
  const [feeHint, setFeeHint] = React.useState("");
  const [durationHint, setDurationHint] = React.useState("");
  const [requirements, setRequirements] = React.useState<string[]>([""]);
  const [workflowSteps, setWorkflowSteps] = React.useState<string[]>([""]);

  // Auto-fill location when authority changes
  const selectedAuthority = React.useMemo(
    () => authorities.find((a) => a.id === authorityId),
    [authorityId, authorities],
  );

  React.useEffect(() => {
    if (!selectedAuthority) return;

    const loc = selectedAuthority.room
      ? `${selectedAuthority.floor} • ${selectedAuthority.room}`
      : selectedAuthority.floor;

    queueMicrotask(() => setLocationHint(loc));
  }, [selectedAuthority]);

  React.useEffect(() => {
    queueMicrotask(() => {
      if (service) {
        setTitle(service.title);
        setTitleAm("");
        setTitleOm("");
        // Try to find matching authority by name
        const matchedAuth = authorities.find(
          (a) => a.name === service.authority,
        );
        setAuthorityId(matchedAuth?.id ?? "");
        setLocationHint(service.locationHint);
        setFeeHint(service.feeHint);
        setDurationHint(service.durationHint);
        setRequirements(
          service.requirements.length > 0 ? service.requirements : [""],
        );
        setWorkflowSteps([""]);
      } else {
        setTitle("");
        setTitleAm("");
        setTitleOm("");
        setAuthorityId("");
        setLocationHint("");
        setFeeHint("");
        setDurationHint("");
        setRequirements([""]);
        setWorkflowSteps([""]);
      }
    });
  }, [service, open, authorities]);

  function addRequirement() {
    setRequirements((prev) => [...prev, ""]);
  }

  function removeRequirement(index: number) {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, value: string) {
    setRequirements((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addStep() {
    setWorkflowSteps((prev) => [...prev, ""]);
  }

  function removeStep(index: number) {
    setWorkflowSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, value: string) {
    setWorkflowSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const authorityName = selectedAuthority?.name ?? "";
    // Build keywords from title words as a baseline
    const titleWords = title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const keywords: Record<LanguageCode, string[]> = {
      en: titleWords,
      am: titleAm ? titleAm.split(/\s+/).filter(Boolean) : titleWords,
      om: titleOm ? titleOm.split(/\s+/).filter(Boolean) : titleWords,
    };
    onSave({
      title,
      authority: authorityName,
      topicId: "id", // Default — AI engine handles routing, not manual topicId
      locationHint,
      feeHint,
      durationHint,
      requirements: requirements.filter(Boolean),
      keywords,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the service configuration."
                : "Define a new service for citizens in all supported languages."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
            </TabsList>

            {/* ── General Tab ─────────────────────────────────────── */}
            <TabsContent value="general" className="space-y-4 mt-4">
              {/* English */}
              <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />
              <div className="space-y-2">
                <Label htmlFor="svc-title">Service Title</Label>
                <Input
                  id="svc-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Replace a lost ID"
                  required
                />
              </div>

              {/* Amharic */}
              <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />
              <div className="space-y-2">
                <Label htmlFor="svc-title-am">Service Title in Amharic</Label>
                <Input
                  id="svc-title-am"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  placeholder="e.g. የጠፋ መታወቂያ መተካት"
                  required
                  dir="auto"
                />
              </div>

              {/* Afaan Oromo */}
              <LanguageSectionHeader flag="🇪🇹" label="Afaan Oromo" code="OM" />
              <div className="space-y-2">
                <Label htmlFor="svc-title-om">
                  Service Title in Afaan Oromo
                </Label>
                <Input
                  id="svc-title-om"
                  value={titleOm}
                  onChange={(e) => setTitleOm(e.target.value)}
                  placeholder="e.g. Eenyummaa bade bakka buusuu"
                  required
                />
              </div>

              <Separator />

              {/* Authority & Location */}
              <div className="space-y-2">
                <Label>Authority</Label>
                <Select value={authorityId} onValueChange={setAuthorityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorities.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="svc-location">Location Hint</Label>
                <Input
                  id="svc-location"
                  value={locationHint}
                  readOnly
                  className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                  placeholder="Auto-filled from authority"
                />
                <p className="text-xs text-muted-foreground">
                  Automatically set from the selected authority location
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="svc-fee">Fee</Label>
                  <Input
                    id="svc-fee"
                    value={feeHint}
                    onChange={(e) => setFeeHint(e.target.value)}
                    placeholder="e.g. 200 ETB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="svc-duration">Processing Time</Label>
                  <Input
                    id="svc-duration"
                    value={durationHint}
                    onChange={(e) => setDurationHint(e.target.value)}
                    placeholder="e.g. Same day"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Requirements Tab ────────────────────────────────── */}
            <TabsContent value="requirements" className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground">
                Documents and items the citizen must bring.
              </p>
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="shrink-0 text-xs font-mono w-6 justify-center"
                  >
                    {i + 1}
                  </Badge>
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder={`Requirement ${i + 1}`}
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={() => removeRequirement(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={addRequirement}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Requirement
              </Button>
            </TabsContent>

            {/* ── Workflow Tab ────────────────────────────────────── */}
            <TabsContent value="workflow" className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground">
                Step-by-step process the citizen follows.
              </p>
              {workflowSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-xs font-mono w-6 justify-center"
                  >
                    {i + 1}
                  </Badge>
                  <Input
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={`Step ${i + 1}...`}
                  />
                  {workflowSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={() => removeStep(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={addStep}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Step
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
