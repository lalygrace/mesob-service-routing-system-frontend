"use client";

import * as React from "react";
import {
  Save,
  Globe2,
  ListTodo,
  Clock,
  Banknote,
  FileText,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Service, LanguageCode } from "@/lib/service-navigator/types";

type PremiumServiceEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  organizationId: string;
  organizationName: string;
  onSave: (data: Omit<Service, "id">) => Promise<boolean>;
};

function DynamicListInput({
  items,
  onChange,
  placeholder = "Add an item...",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
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
    <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            {i + 1}
          </div>
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-background"
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
        className="gap-2 border-dashed w-full bg-transparent hover:bg-muted/50"
        onClick={add}
      >
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}

function LanguageTab({ 
  data,
  updateField,
  lang, 
  titleKey, 
  feeKey, 
  durationKey, 
  reqKey, 
  workKey,
  isAmharic = false,
}: { 
  data: Record<string, string | string[]>;
  updateField: (field: string, value: string | string[]) => void;
  lang: string; 
  titleKey: string;
  feeKey: string;
  durationKey: string;
  reqKey: string;
  workKey: string;
  isAmharic?: boolean;
}) {
  return (
    <div className="space-y-8 py-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Basic Details ({lang})</h3>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Service Name {titleKey === "title" && <span className="text-destructive">*</span>}</Label>
          <Input 
            value={data[titleKey] as string} 
            onChange={(e) => updateField(titleKey, e.target.value)} 
            placeholder={`e.g. Passport Renewal (${lang})`}
            className="text-base h-11"
            required={titleKey === "title"}
            dir={isAmharic ? "auto" : "ltr"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Service Fee
            </Label>
            <Input 
              value={data[feeKey] as string} 
              onChange={(e) => updateField(feeKey, e.target.value)} 
              placeholder="e.g. 500 ETB / Free"
              dir={isAmharic ? "auto" : "ltr"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Processing Time
            </Label>
            <Input 
              value={data[durationKey] as string} 
              onChange={(e) => updateField(durationKey, e.target.value)} 
              placeholder="e.g. 3 Working Days"
              dir={isAmharic ? "auto" : "ltr"}
            />
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ListTodo className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Requirements ({lang})</h3>
        </div>
        <p className="text-sm text-muted-foreground">What documents or prerequisites are needed?</p>
        <DynamicListInput 
          items={data[reqKey] as string[]} 
          onChange={(items) => updateField(reqKey, items)} 
          placeholder="e.g. Renewed Kebele ID"
        />
      </div>

      {/* Workflow Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Globe2 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Process Steps ({lang})</h3>
        </div>
        <p className="text-sm text-muted-foreground">What are the steps to complete this service?</p>
        <DynamicListInput 
          items={data[workKey] as string[]} 
          onChange={(items) => updateField(workKey, items)} 
          placeholder="e.g. Submit application at Window 3"
        />
      </div>
    </div>
  );
}

export function PremiumServiceEditor({
  open,
  onOpenChange,
  service,
  organizationId,
  organizationName,
  onSave,
}: PremiumServiceEditorProps) {
  const isEdit = !!service;
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [data, setData] = React.useState({
    // EN
    title: "",
    feeHint: "",
    durationHint: "",
    requirements: [""],
    workflowSteps: [""],
    notice: "",

    // AM
    titleAm: "",
    feeHintAm: "",
    durationHintAm: "",
    requirementsAm: [""],
    workflowStepsAm: [""],

    // OM
    titleOm: "",
    feeHintOm: "",
    durationHintOm: "",
    requirementsOm: [""],
    workflowStepsOm: [""],
  });

  React.useEffect(() => {
    queueMicrotask(() => {
      if (open) {
        if (service) {
          setData({
            title: service.title || "",
            feeHint: service.feeHint || "",
            durationHint: service.durationHint || "",
            requirements: service.requirements?.length ? service.requirements : [""],
            workflowSteps: service.workflowSteps?.length ? service.workflowSteps : [""],
            notice: service.notice || "",

            titleAm: service.titleAm || "",
            feeHintAm: service.feeHintAm || "",
            durationHintAm: service.durationHintAm || "",
            requirementsAm: service.requirementsAm?.length ? service.requirementsAm : [""],
            workflowStepsAm: service.workflowStepsAm?.length ? service.workflowStepsAm : [""],

            titleOm: service.titleOm || "",
            feeHintOm: service.feeHintOm || "",
            durationHintOm: service.durationHintOm || "",
            requirementsOm: service.requirementsOm?.length ? service.requirementsOm : [""],
            workflowStepsOm: service.workflowStepsOm?.length ? service.workflowStepsOm : [""],
          });
        } else {
          setData({
            title: "", feeHint: "", durationHint: "", requirements: [""], workflowSteps: [""], notice: "",
            titleAm: "", feeHintAm: "", durationHintAm: "", requirementsAm: [""], workflowStepsAm: [""],
            titleOm: "", feeHintOm: "", durationHintOm: "", requirementsOm: [""], workflowStepsOm: [""],
          });
        }
      }
    });
  }, [service, open]);

  const updateField = React.useCallback((field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    // Auto-generate keywords
    const titleWords = data.title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const keywords: Record<LanguageCode, string[]> = {
      en: titleWords,
      am: data.titleAm ? data.titleAm.split(/\s+/).filter(Boolean) : titleWords,
      om: data.titleOm ? data.titleOm.split(/\s+/).filter(Boolean) : titleWords,
    };

    const success = await onSave({
      title: data.title,
      titleAm: data.titleAm,
      titleOm: data.titleOm,
      organizationId,
      organization: organizationName,
      topicId: "id", // Default for CMS
      locationHint: "", // Derived usually, but passing empty string as it's required by type
      feeHint: data.feeHint,
      feeHintAm: data.feeHintAm,
      feeHintOm: data.feeHintOm,
      durationHint: data.durationHint,
      durationHintAm: data.durationHintAm,
      durationHintOm: data.durationHintOm,
      notice: data.notice.trim() || null,
      requirements: data.requirements.filter(Boolean),
      requirementsAm: data.requirementsAm.filter(Boolean),
      requirementsOm: data.requirementsOm.filter(Boolean),
      workflowSteps: data.workflowSteps.filter(Boolean),
      workflowStepsAm: data.workflowStepsAm.filter(Boolean),
      workflowStepsOm: data.workflowStepsOm.filter(Boolean),
      keywords,
    });

    setIsSaving(false);
    if (success) {
      onOpenChange(false);
    }
  }

  const LanguageTab = ({ 
    lang, 
    titleKey, 
    feeKey, 
    durationKey, 
    reqKey, 
    workKey,
    isAmharic = false,
  }: { 
    lang: string, 
    titleKey: keyof typeof data,
    feeKey: keyof typeof data,
    durationKey: keyof typeof data,
    reqKey: keyof typeof data,
    workKey: keyof typeof data,
    isAmharic?: boolean,
  }) => (
    <div className="space-y-8 py-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Basic Details ({lang})</h3>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Service Name <span className="text-destructive">*</span></Label>
          <Input 
            value={data[titleKey] as string} 
            onChange={(e) => updateField(titleKey, e.target.value)} 
            placeholder={`e.g. Passport Renewal (${lang})`}
            className="text-base h-11"
            required={titleKey === "title"} // Only EN is strictly required, others fallback
            dir={isAmharic ? "auto" : "ltr"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Service Fee
            </Label>
            <Input 
              value={data[feeKey] as string} 
              onChange={(e) => updateField(feeKey, e.target.value)} 
              placeholder="e.g. 500 ETB / Free"
              dir={isAmharic ? "auto" : "ltr"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Processing Time
            </Label>
            <Input 
              value={data[durationKey] as string} 
              onChange={(e) => updateField(durationKey, e.target.value)} 
              placeholder="e.g. 3 Working Days"
              dir={isAmharic ? "auto" : "ltr"}
            />
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ListTodo className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Requirements ({lang})</h3>
        </div>
        <p className="text-sm text-muted-foreground">What documents or prerequisites are needed?</p>
        <DynamicListInput 
          items={data[reqKey] as string[]} 
          onChange={(items) => updateField(reqKey, items)} 
          placeholder="e.g. Renewed Kebele ID"
        />
      </div>

      {/* Workflow Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Globe2 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-lg">Process Steps ({lang})</h3>
        </div>
        <p className="text-sm text-muted-foreground">What are the steps to complete this service?</p>
        <DynamicListInput 
          items={data[workKey] as string[]} 
          onChange={(items) => updateField(workKey, items)} 
          placeholder="e.g. Submit application at Window 3"
        />
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl flex flex-col p-0 border-l border-border/50">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <SheetHeader className="px-6 py-5 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-xl">
                  {isEdit ? "Edit Service Configuration" : "Create New Service"}
                </SheetTitle>
                <SheetDescription>
                  Configure multilingual details for this service in {organizationName}.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-6">
              {/* Universal Notice (Applies across languages visually, mostly internal context) */}
              <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl dark:bg-amber-500/5">
                <Label className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  Global Notice / Alert (Optional)
                </Label>
                <Textarea 
                  value={data.notice} 
                  onChange={(e) => updateField("notice", e.target.value)} 
                  placeholder="e.g. Service temporarily unavailable due to system upgrade..."
                  className="bg-background resize-none"
                  rows={2}
                />
                <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                  This will prominently alert users about conditions regardless of language.
                </p>
              </div>

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl bg-muted/50 p-1">
                  <TabsTrigger value="en" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
                    <span className="text-base">🇬🇧</span> English
                  </TabsTrigger>
                  <TabsTrigger value="am" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
                    <span className="text-base">🇪🇹</span> አማርኛ
                  </TabsTrigger>
                  <TabsTrigger value="om" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
                    <span className="text-base">🇪🇹</span> Afaan Oromoo
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-4">
                  <TabsContent value="en" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <LanguageTab 
                      lang="English" 
                      titleKey="title" 
                      feeKey="feeHint" 
                      durationKey="durationHint" 
                      reqKey="requirements" 
                      workKey="workflowSteps" 
                    />
                  </TabsContent>
                  <TabsContent value="am" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <LanguageTab 
                      lang="Amharic" 
                      titleKey="titleAm" 
                      feeKey="feeHintAm" 
                      durationKey="durationHintAm" 
                      reqKey="requirementsAm" 
                      workKey="workflowStepsAm" 
                      isAmharic
                    />
                  </TabsContent>
                  <TabsContent value="om" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <LanguageTab 
                      lang="Afaan Oromoo" 
                      titleKey="titleOm" 
                      feeKey="feeHintOm" 
                      durationKey="durationHintOm" 
                      reqKey="requirementsOm" 
                      workKey="workflowStepsOm" 
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ScrollArea>

          <SheetFooter className="px-6 py-4 border-t border-border/50 bg-background sticky bottom-0">
            <div className="flex w-full justify-between items-center">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2 px-6">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : isEdit ? "Update Service" : "Publish Service"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
