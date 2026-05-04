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
import type { Authority } from "@/lib/mock/authorities";

type AuthorityFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authority?: Authority | null;
  onSave: (data: Omit<Authority, "id" | "createdAt" | "serviceCount">) => void;
};

export function AuthorityForm({
  open,
  onOpenChange,
  authority,
  onSave,
}: AuthorityFormProps) {
  const isEdit = !!authority;

  const [name, setName] = React.useState("");
  const [abbreviation, setAbbreviation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [status, setStatus] = React.useState<"active" | "inactive">("active");

  React.useEffect(() => {
    if (authority) {
      setName(authority.name);
      setAbbreviation(authority.abbreviation);
      setDescription(authority.description);
      setFloor(authority.floor);
      setRoom(authority.room);
      setContactPhone(authority.contactPhone);
      setStatus(authority.status);
    } else {
      setName("");
      setAbbreviation("");
      setDescription("");
      setFloor("");
      setRoom("");
      setContactPhone("");
      setStatus("active");
    }
  }, [authority, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, abbreviation, description, floor, room, contactPhone, status });
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
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="auth-name">Name</Label>
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

            <div className="space-y-2">
              <Label htmlFor="auth-desc">Description</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-room">Room / Counter</Label>
                <Input
                  id="auth-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Counter A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-phone">Contact Phone</Label>
              <Input
                id="auth-phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+251-111-234567"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label htmlFor="auth-status" className="font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive authorities are hidden from the kiosk
                </p>
              </div>
              <Switch
                id="auth-status"
                checked={status === "active"}
                onCheckedChange={(checked) =>
                  setStatus(checked ? "active" : "inactive")
                }
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
            <Button type="submit">{isEdit ? "Save Changes" : "Create Authority"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
