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
import type { Service, ServiceTopicId, LanguageCode } from "@/lib/service-navigator/types";

const TOPICS: { value: ServiceTopicId; label: string }[] = [
  { value: "id", label: "Identity" },
  { value: "passport", label: "Passport" },
  { value: "business", label: "Business" },
  { value: "transport", label: "Transport" },
  { value: "revenue", label: "Revenue / Tax" },
];

const AUTHORITIES = [
  { value: "Identity Services (placeholder)", label: "National ID Authority" },
  { value: "Passport Services (placeholder)", label: "Immigration & Passport Services" },
  { value: "Business Services (placeholder)", label: "Business Registration & Licensing" },
  { value: "Transport Services (placeholder)", label: "Transport Authority" },
  { value: "Revenue Services (placeholder)", label: "Revenue & Customs Authority" },
];

type ServiceFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSave: (data: Omit<Service, "id">) => void;
};

export function ServiceForm({ open, onOpenChange, service, onSave }: ServiceFormProps) {
  const isEdit = !!service;

  const [title, setTitle] = React.useState("");
  const [authority, setAuthority] = React.useState("");
  const [topicId, setTopicId] = React.useState<ServiceTopicId>("id");
  const [locationHint, setLocationHint] = React.useState("");
  const [feeHint, setFeeHint] = React.useState("");
  const [durationHint, setDurationHint] = React.useState("");
  const [requirements, setRequirements] = React.useState<string[]>([""]);
  const [workflowSteps, setWorkflowSteps] = React.useState<string[]>([""]);
  const [keywordsEn, setKeywordsEn] = React.useState("");
  const [keywordsAm, setKeywordsAm] = React.useState("");
  const [keywordsOm, setKeywordsOm] = React.useState("");

  React.useEffect(() => {
    if (service) {
      setTitle(service.title);
      setAuthority(service.authority);
      setTopicId(service.topicId);
      setLocationHint(service.locationHint);
      setFeeHint(service.feeHint);
      setDurationHint(service.durationHint);
      setRequirements(service.requirements.length > 0 ? service.requirements : [""]);
      setWorkflowSteps([""]);
      setKeywordsEn(service.keywords.en.join(", "));
      setKeywordsAm(service.keywords.am.join(", "));
      setKeywordsOm(service.keywords.om.join(", "));
    } else {
      setTitle("");
      setAuthority("");
      setTopicId("id");
      setLocationHint("");
      setFeeHint("");
      setDurationHint("");
      setRequirements([""]);
      setWorkflowSteps([""]);
      setKeywordsEn("");
      setKeywordsAm("");
      setKeywordsOm("");
    }
  }, [service, open]);

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

  function parseKeywords(str: string): string[] {
    return str
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const keywords: Record<LanguageCode, string[]> = {
      en: parseKeywords(keywordsEn),
      am: parseKeywords(keywordsAm),
      om: parseKeywords(keywordsOm),
    };
    onSave({
      title,
      authority,
      topicId,
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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the service configuration."
                : "Define a new service for citizens."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>

            {/* ── General Tab ─────────────────────────────────────── */}
            <TabsContent value="general" className="space-y-4 mt-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Authority</Label>
                  <Select value={authority} onValueChange={setAuthority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select authority" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTHORITIES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select value={topicId} onValueChange={(v) => setTopicId(v as ServiceTopicId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="svc-location">Location Hint</Label>
                <Input
                  id="svc-location"
                  value={locationHint}
                  onChange={(e) => setLocationHint(e.target.value)}
                  placeholder="e.g. Floor 1 • Counter A"
                />
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
                  <Badge variant="outline" className="shrink-0 text-xs font-mono w-6 justify-center">
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
                  <Badge variant="secondary" className="shrink-0 text-xs font-mono w-6 justify-center">
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

            {/* ── Keywords Tab ────────────────────────────────────── */}
            <TabsContent value="keywords" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Comma-separated keywords used by the matching engine.
              </p>
              <div className="space-y-2">
                <Label htmlFor="kw-en">English Keywords</Label>
                <Input
                  id="kw-en"
                  value={keywordsEn}
                  onChange={(e) => setKeywordsEn(e.target.value)}
                  placeholder="id, lost, replace, missing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kw-am">Amharic Keywords</Label>
                <Input
                  id="kw-am"
                  value={keywordsAm}
                  onChange={(e) => setKeywordsAm(e.target.value)}
                  placeholder="መታወቂያ, ጠፋ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kw-om">Afaan Oromo Keywords</Label>
                <Input
                  id="kw-om"
                  value={keywordsOm}
                  onChange={(e) => setKeywordsOm(e.target.value)}
                  placeholder="eenyummaa, dhabe"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Create Service"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
