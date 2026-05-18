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
import type { Organization } from "@/lib/api/organizations";

type ServiceFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  organizations: Organization[];
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

function DynamicListInput({
  items,
  onChange,
  placeholderPrefix = "Item",
  addLabel = "Add Item",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholderPrefix?: string;
  addLabel?: string;
}) {
  function add() {
    onChange([...items, ""]);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function update(index: number, value: string) {
    onChange(items.map((r, i) => (i === index ? value : r)));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="shrink-0 text-xs font-mono w-6 justify-center"
          >
            {i + 1}
          </Badge>
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`${placeholderPrefix} ${i + 1}`}
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={() => remove(i)}
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
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  organizations,
  onSave,
}: ServiceFormProps) {
  const isEdit = !!service;

  const [title, setTitle] = React.useState("");
  const [titleAm, setTitleAm] = React.useState("");
  const [titleOm, setTitleOm] = React.useState("");
  const [organizationId, setOrganizationId] = React.useState("");
  const [locationHint, setLocationHint] = React.useState("");
  const [feeHint, setFeeHint] = React.useState("");
  const [feeHintAm, setFeeHintAm] = React.useState("");
  const [feeHintOm, setFeeHintOm] = React.useState("");
  const [durationHint, setDurationHint] = React.useState("");
  const [durationHintAm, setDurationHintAm] = React.useState("");
  const [durationHintOm, setDurationHintOm] = React.useState("");
  const [requirements, setRequirements] = React.useState<string[]>([""]);
  const [requirementsAm, setRequirementsAm] = React.useState<string[]>([""]);
  const [requirementsOm, setRequirementsOm] = React.useState<string[]>([""]);
  const [workflowSteps, setWorkflowSteps] = React.useState<string[]>([""]);
  const [workflowStepsAm, setWorkflowStepsAm] = React.useState<string[]>([""]);
  const [workflowStepsOm, setWorkflowStepsOm] = React.useState<string[]>([""]);

  // Auto-fill location when organization changes
  const selectedOrganization = React.useMemo(
    () => organizations.find((org) => org.id === organizationId),
    [organizationId, organizations],
  );

  React.useEffect(() => {
    if (!selectedOrganization) return;

    const loc = [selectedOrganization.floor, selectedOrganization.room]
      .filter(Boolean)
      .join(" • ");

    queueMicrotask(() => setLocationHint(loc));
  }, [selectedOrganization]);

  React.useEffect(() => {
    queueMicrotask(() => {
      if (service) {
        setTitle(service.title);
        setTitleAm(service.titleAm || "");
        setTitleOm(service.titleOm || "");
        // Try to find matching organization by name
        const matchedOrg = organizations.find(
          (org) => org.name === service.organization,
        );
        setOrganizationId(matchedOrg?.id ?? "");
        setLocationHint(service.locationHint);
        setFeeHint(service.feeHint);
        setFeeHintAm(service.feeHintAm || "");
        setFeeHintOm(service.feeHintOm || "");
        setDurationHint(service.durationHint);
        setDurationHintAm(service.durationHintAm || "");
        setDurationHintOm(service.durationHintOm || "");
        setRequirements(
          service.requirements.length > 0 ? service.requirements : [""],
        );
        setRequirementsAm(
          service.requirementsAm?.length ? service.requirementsAm : [""],
        );
        setRequirementsOm(
          service.requirementsOm?.length ? service.requirementsOm : [""],
        );
        setWorkflowSteps(
          service.workflowSteps?.length ? service.workflowSteps : [""],
        );
        setWorkflowStepsAm(
          service.workflowStepsAm?.length ? service.workflowStepsAm : [""],
        );
        setWorkflowStepsOm(
          service.workflowStepsOm?.length ? service.workflowStepsOm : [""],
        );
      } else {
        setTitle("");
        setTitleAm("");
        setTitleOm("");
        setOrganizationId("");
        setLocationHint("");
        setFeeHint("");
        setFeeHintAm("");
        setFeeHintOm("");
        setDurationHint("");
        setDurationHintAm("");
        setDurationHintOm("");
        setRequirements([""]);
        setRequirementsAm([""]);
        setRequirementsOm([""]);
        setWorkflowSteps([""]);
        setWorkflowStepsAm([""]);
        setWorkflowStepsOm([""]);
      }
    });
  }, [service, open, organizations]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const organizationName = selectedOrganization?.name ?? "";
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
      titleAm,
      titleOm,
      organization: organizationName,
      topicId: "id", // Default — AI engine handles routing, not manual topicId
      locationHint,
      feeHint,
      feeHintAm,
      feeHintOm,
      durationHint,
      durationHintAm,
      durationHintOm,
      requirements: requirements.filter(Boolean),
      requirementsAm: requirementsAm.filter(Boolean),
      requirementsOm: requirementsOm.filter(Boolean),
      workflowSteps: workflowSteps.filter(Boolean),
      workflowStepsAm: workflowStepsAm.filter(Boolean),
      workflowStepsOm: workflowStepsOm.filter(Boolean),
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
                  Service Title in Afaan Oromo (Optional)
                </Label>
                <Input
                  id="svc-title-om"
                  value={titleOm}
                  onChange={(e) => setTitleOm(e.target.value)}
                  placeholder="e.g. Eenyummaa bade bakka buusuu"
                />
              </div>

              <Separator />

              {/* Organization & Location */}
              <div className="space-y-2">
                <Label>Organization</Label>
                <Select
                  value={organizationId}
                  onValueChange={setOrganizationId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
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
                  placeholder="Auto-filled from organization"
                />
                <p className="text-xs text-muted-foreground">
                  Automatically set from the selected organization location
                </p>
              </div>

              <Separator />

              {/* Fee - Multilingual */}
              <div className="space-y-4">
                <Label>Service Fee</Label>

                {/* English */}
                <div className="space-y-2">
                  <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />
                  <Input
                    id="svc-fee"
                    value={feeHint}
                    onChange={(e) => setFeeHint(e.target.value)}
                    placeholder="e.g. 200 ETB"
                    required
                  />
                </div>

                {/* Amharic */}
                <div className="space-y-2">
                  <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />
                  <Input
                    id="svc-fee-am"
                    value={feeHintAm}
                    onChange={(e) => setFeeHintAm(e.target.value)}
                    placeholder="e.g. 200 ብር"
                    required
                    dir="auto"
                  />
                </div>

                {/* Afaan Oromo */}
                <div className="space-y-2">
                  <LanguageSectionHeader
                    flag="🇪🇹"
                    label="Afaan Oromo (Optional)"
                    code="OM"
                  />
                  <Input
                    id="svc-fee-om"
                    value={feeHintOm}
                    onChange={(e) => setFeeHintOm(e.target.value)}
                    placeholder="e.g. 200 qarshii"
                  />
                </div>
              </div>

              <Separator />

              {/* Processing Time - Multilingual */}
              <div className="space-y-4">
                <Label>Processing Time</Label>

                {/* English */}
                <div className="space-y-2">
                  <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />
                  <Input
                    id="svc-duration"
                    value={durationHint}
                    onChange={(e) => setDurationHint(e.target.value)}
                    placeholder="e.g. Same day"
                    required
                  />
                </div>

                {/* Amharic */}
                <div className="space-y-2">
                  <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />
                  <Input
                    id="svc-duration-am"
                    value={durationHintAm}
                    onChange={(e) => setDurationHintAm(e.target.value)}
                    placeholder="e.g. በተመሳሳይ ቀን"
                    required
                    dir="auto"
                  />
                </div>

                {/* Afaan Oromo */}
                <div className="space-y-2">
                  <LanguageSectionHeader
                    flag="🇪🇹"
                    label="Afaan Oromo (Optional)"
                    code="OM"
                  />
                  <Input
                    id="svc-duration-om"
                    value={durationHintOm}
                    onChange={(e) => setDurationHintOm(e.target.value)}
                    placeholder="e.g. Guyyaa walfakkaataa"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Requirements Tab ────────────────────────────────── */}
            <TabsContent value="requirements" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Documents and items the citizen must bring.
              </p>

              {/* English */}
              <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />
              <DynamicListInput
                items={requirements}
                onChange={setRequirements}
                placeholderPrefix="Requirement"
                addLabel="Add Requirement"
              />

              {/* Amharic */}
              <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />
              <DynamicListInput
                items={requirementsAm}
                onChange={setRequirementsAm}
                placeholderPrefix="መስፈርት"
                addLabel="መስፈርት አክል"
              />

              {/* Afaan Oromo */}
              <LanguageSectionHeader
                flag="🇪🇹"
                label="Afaan Oromo (Optional)"
                code="OM"
              />
              <DynamicListInput
                items={requirementsOm}
                onChange={setRequirementsOm}
                placeholderPrefix="Ulaagaa"
                addLabel="Ulaagaa dabali"
              />
            </TabsContent>

            {/* ── Workflow Tab ────────────────────────────────────── */}
            <TabsContent value="workflow" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Step-by-step process the citizen follows.
              </p>

              {/* English */}
              <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />
              <DynamicListInput
                items={workflowSteps}
                onChange={setWorkflowSteps}
                placeholderPrefix="Step"
                addLabel="Add Step"
              />

              {/* Amharic */}
              <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />
              <DynamicListInput
                items={workflowStepsAm}
                onChange={setWorkflowStepsAm}
                placeholderPrefix="ደረጃ"
                addLabel="ደረጃ አክል"
              />

              {/* Afaan Oromo */}
              <LanguageSectionHeader
                flag="🇪🇹"
                label="Afaan Oromo (Optional)"
                code="OM"
              />
              <DynamicListInput
                items={workflowStepsOm}
                onChange={setWorkflowStepsOm}
                placeholderPrefix="Tarkaanfii"
                addLabel="Tarkaanfii dabali"
              />
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
