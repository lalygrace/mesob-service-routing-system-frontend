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
import type { Organization } from "@/lib/api/organizations";

type OrganizationFormData = Omit<
  Organization,
  "id" | "createdAt" | "serviceCount" | "syncedFromCms"
>;

type OrganizationFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  onSave: (data: OrganizationFormData) => void;
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

export function OrganizationForm({
  open,
  onOpenChange,
  organization,
  onSave,
}: OrganizationFormProps) {
  const isEdit = !!organization;

  // English fields (required)
  const [name, setName] = React.useState("");
  const [abbreviation, setAbbreviation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [room, setRoom] = React.useState("");

  // Amharic fields (required)
  const [nameAm, setNameAm] = React.useState("");
  const [abbreviationAm, setAbbreviationAm] = React.useState("");
  const [descriptionAm, setDescriptionAm] = React.useState("");
  const [floorAm, setFloorAm] = React.useState("");
  const [roomAm, setRoomAm] = React.useState("");

  // Afaan Oromo fields (optional)
  const [nameOm, setNameOm] = React.useState("");
  const [abbreviationOm, setAbbreviationOm] = React.useState("");
  const [descriptionOm, setDescriptionOm] = React.useState("");
  const [floorOm, setFloorOm] = React.useState("");
  const [roomOm, setRoomOm] = React.useState("");

  // Logo URL
  const [logoUrl, setLogoUrl] = React.useState("");

  React.useEffect(() => {
    queueMicrotask(() => {
      if (organization) {
        setName(organization.name);
        setAbbreviation(organization.abbreviation);
        setDescription(organization.description ?? "");
        setFloor(organization.floor ?? "");
        setRoom(organization.room ?? "");

        setNameAm(organization.nameAm);
        setAbbreviationAm(organization.abbreviationAm);
        setDescriptionAm(organization.descriptionAm ?? "");
        setFloorAm(organization.floorAm ?? "");
        setRoomAm(organization.roomAm ?? "");

        setNameOm(organization.nameOm ?? "");
        setAbbreviationOm(organization.abbreviationOm ?? "");
        setDescriptionOm(organization.descriptionOm ?? "");
        setFloorOm(organization.floorOm ?? "");
        setRoomOm(organization.roomOm ?? "");

        setLogoUrl(organization.logoUrl ?? "");
      } else {
        setName("");
        setAbbreviation("");
        setDescription("");
        setFloor("");
        setRoom("");

        setNameAm("");
        setAbbreviationAm("");
        setDescriptionAm("");
        setFloorAm("");
        setRoomAm("");

        setNameOm("");
        setAbbreviationOm("");
        setDescriptionOm("");
        setFloorOm("");
        setRoomOm("");

        setLogoUrl("");
      }
    });
  }, [organization, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name,
      abbreviation,
      description: description || undefined,
      floor: floor || undefined,
      room: room || undefined,

      nameAm,
      abbreviationAm,
      descriptionAm: descriptionAm || undefined,
      floorAm: floorAm || undefined,
      roomAm: roomAm || undefined,

      nameOm: nameOm || undefined,
      abbreviationOm: abbreviationOm || undefined,
      descriptionOm: descriptionOm || undefined,
      floorOm: floorOm || undefined,
      roomOm: roomOm || undefined,

      logoUrl: logoUrl || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Organization" : "Add New Organization"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the organization details below."
                : "Fill in the details for the new government organization in all supported languages."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            {/* ── English (Required) ─────────────────────────────────────── */}
            <LanguageSectionHeader flag="🇬🇧" label="English" code="EN" />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. National ID Organization"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-abbr">Abbreviation *</Label>
                <Input
                  id="org-abbr"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  placeholder="e.g. NIDA"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="org-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this organization's role..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-floor">
                  Floor{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. Floor 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-room">
                  Room / Counter{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room 101"
                />
              </div>
            </div>

            {/* ── Amharic (Required) ────────────────────────────────────── */}
            <LanguageSectionHeader flag="🇪🇹" label="Amharic" code="አማ" />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="org-name-am">
                  Organization Name in Amharic *
                </Label>
                <Input
                  id="org-name-am"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
                  placeholder="e.g. ብሔራዊ መታወቂያ ባለስልጣን"
                  required
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-abbr-am">Abbreviation *</Label>
                <Input
                  id="org-abbr-am"
                  value={abbreviationAm}
                  onChange={(e) => setAbbreviationAm(e.target.value)}
                  placeholder="e.g. ብመባ"
                  required
                  dir="auto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-desc-am">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="org-desc-am"
                value={descriptionAm}
                onChange={(e) => setDescriptionAm(e.target.value)}
                placeholder="የድርጅቱ ሚና አጭር መግለጫ..."
                rows={2}
                dir="auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-floor-am">
                  Floor{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-floor-am"
                  value={floorAm}
                  onChange={(e) => setFloorAm(e.target.value)}
                  placeholder="e.g. ፎቅ 1"
                  dir="auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-room-am">
                  Room / Counter{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-room-am"
                  value={roomAm}
                  onChange={(e) => setRoomAm(e.target.value)}
                  placeholder="e.g. ክፍል 101"
                  dir="auto"
                />
              </div>
            </div>

            {/* ── Afaan Oromo (Optional) ─────────────────────────────────── */}
            <LanguageSectionHeader flag="🇪🇹" label="Afaan Oromo" code="OM" />

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="org-name-om">
                  Organization Name in Afaan Oromo{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-name-om"
                  value={nameOm}
                  onChange={(e) => setNameOm(e.target.value)}
                  placeholder="e.g. Abbaa Taayitaa Eenyummaa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-abbr-om">
                  Abbreviation{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-abbr-om"
                  value={abbreviationOm}
                  onChange={(e) => setAbbreviationOm(e.target.value)}
                  placeholder="e.g. ATEB"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-desc-om">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="org-desc-om"
                value={descriptionOm}
                onChange={(e) => setDescriptionOm(e.target.value)}
                placeholder="Ibsa gabaabaa gahee dhaabbatichaa..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-floor-om">
                  Floor{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-floor-om"
                  value={floorOm}
                  onChange={(e) => setFloorOm(e.target.value)}
                  placeholder="e.g. Sadarkaa 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-room-om">
                  Room / Counter{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="org-room-om"
                  value={roomOm}
                  onChange={(e) => setRoomOm(e.target.value)}
                  placeholder="e.g. Kutaa 101"
                />
              </div>
            </div>

            {/* ── Common Fields ───────────────────────────────────────────── */}
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="org-logo">
                Logo URL{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="org-logo"
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
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
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
