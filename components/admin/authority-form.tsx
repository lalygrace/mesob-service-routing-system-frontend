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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Authority } from "@/lib/mock/authorities";

type AuthorityFormData = Omit<Authority, "id" | "createdAt" | "serviceCount">;

type AuthorityFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authority?: Authority | null;
  onSave: (data: AuthorityFormData) => void;
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

export function AuthorityForm({
  open,
  onOpenChange,
  authority,
  onSave,
}: AuthorityFormProps) {
  const isEdit = !!authority;

  const [name, setName] = React.useState("");
  const [nameAm, setNameAm] = React.useState("");
  const [nameOm, setNameOm] = React.useState("");
  const [abbreviation, setAbbreviation] = React.useState("");
  const [abbreviationAm, setAbbreviationAm] = React.useState("");
  const [abbreviationOm, setAbbreviationOm] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [room, setRoom] = React.useState("");

  React.useEffect(() => {
    if (authority) {
      setName(authority.name);
      setNameAm(authority.nameAm);
      setNameOm(authority.nameOm);
      setAbbreviation(authority.abbreviation);
      setAbbreviationAm(authority.abbreviationAm);
      setAbbreviationOm(authority.abbreviationOm);
      setDescription(authority.description ?? "");
      setFloor(authority.floor);
      setRoom(authority.room ?? "");
    } else {
      setName("");
      setNameAm("");
      setNameOm("");
      setAbbreviation("");
      setAbbreviationAm("");
      setAbbreviationOm("");
      setDescription("");
      setFloor("");
      setRoom("");
    }
  }, [authority, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name,
      nameAm,
      nameOm,
      abbreviation,
      abbreviationAm,
      abbreviationOm,
      description: description || undefined,
      floor,
      room: room || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Authority" : "Add New Authority"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the authority details below."
                : "Fill in the details for the new government authority in all supported languages."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            {/* ── English ─────────────────────────────────────── */}
            <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="auth-name">Authority Name</Label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. National ID Authority"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-abbr">Abbreviation</Label>
                <Input
                  id="auth-abbr"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  placeholder="e.g. NIDA"
                  required
                />
              </div>
            </div>

            {/* ── Amharic ────────────────────────────────────── */}
            <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="auth-name-am">Authority Name in Amharic</Label>
                <Input
                  id="auth-name-am"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
                  placeholder="e.g. ብሔራዊ መታወቂያ ባለስልጣን"
                  required
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-abbr-am">Abbreviation</Label>
                <Input
                  id="auth-abbr-am"
                  value={abbreviationAm}
                  onChange={(e) => setAbbreviationAm(e.target.value)}
                  placeholder="e.g. ብመባ"
                  required
                  dir="auto"
                />
              </div>
            </div>

            {/* ── Afaan Oromo ─────────────────────────────────── */}
            <LanguageSectionHeader
              flag="🇪🇹"
              label="Afaan Oromo"
              code="OM"
            />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="auth-name-om">
                  Authority Name in Afaan Oromo
                </Label>
                <Input
                  id="auth-name-om"
                  value={nameOm}
                  onChange={(e) => setNameOm(e.target.value)}
                  placeholder="e.g. Abbaa Taayitaa Eenyummaa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-abbr-om">Abbreviation</Label>
                <Input
                  id="auth-abbr-om"
                  value={abbreviationOm}
                  onChange={(e) => setAbbreviationOm(e.target.value)}
                  placeholder="e.g. ATEB"
                  required
                />
              </div>
            </div>

            {/* ── Common Fields ───────────────────────────────── */}
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="auth-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="auth-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this authority's role..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auth-floor">Floor</Label>
                <Input
                  id="auth-floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. Floor 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-room">
                  Room / Counter{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="auth-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Counter A"
                />
              </div>
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
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Authority"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
