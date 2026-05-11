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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Authority {
  id: string;
  code: string;
  isActive: boolean;
  floor: string | null;
  wing: string | null;
  logoUrl: string | null;
  translations: {
    id: string;
    authorityId: string;
    language: string;
    name: string;
    description: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

type AuthorityFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authority?: Authority | null;
  onSave: (data: { code: string; isActive?: boolean; floor?: string; wing?: string; logoUrl?: string }) => void;
};

export function AuthorityForm({
  open,
  onOpenChange,
  authority,
  onSave,
}: AuthorityFormProps) {
  const isEdit = !!authority;

  const [code, setCode] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [wing, setWing] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (authority) {
      setCode(authority.code);
      setFloor(authority.floor || "");
      setWing(authority.wing || "");
      setLogoUrl(authority.logoUrl || "");
      setIsActive(authority.isActive);
    } else {
      setCode("");
      setFloor("");
      setWing("");
      setLogoUrl("");
      setIsActive(true);
    }
  }, [authority, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ 
      code: code.toUpperCase(),
      floor: floor || undefined,
      wing: wing || undefined,
      logoUrl: logoUrl || undefined,
      isActive,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Authority" : "Add New Authority"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the authority details below."
                : "Fill in the details for the new government authority."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="auth-code">Code (Abbreviation)</Label>
              <Input
                id="auth-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. NIDA"
                required
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Authority code (max 20 characters, will be uppercase)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auth-floor">Floor</Label>
                <Input
                  id="auth-floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. Floor 1"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-wing">Wing</Label>
                <Input
                  id="auth-wing"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  placeholder="e.g. North"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-logo">Logo URL</Label>
              <Input
                id="auth-logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label htmlFor="auth-active" className="font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive authorities are hidden from the kiosk
                </p>
              </div>
              <Switch
                id="auth-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
            
            <div className="rounded-lg border border-border/50 p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Translations (name, description) are managed separately after creating the authority.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Create Authority"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
