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
import { Switch } from "@/components/ui/switch";
import type { Category } from "@/lib/mock/categories";

type CategoryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSave: (data: Omit<Category, "id" | "createdAt" | "serviceCount">) => void;
};

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryFormProps) {
  const isEdit = !!category;

  const [slug, setSlug] = React.useState("");
  const [iconName, setIconName] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (category) {
      setSlug(category.slug);
      setIconName(category.iconName || "");
      setSortOrder(category.sortOrder);
      setIsActive(category.isActive);
    } else {
      setSlug("");
      setIconName("");
      setSortOrder(0);
      setIsActive(true);
    }
  }, [category, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ slug, iconName, sortOrder, isActive, name: slug.charAt(0).toUpperCase() + slug.slice(1) });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the category details below."
                : "Fill in the details for the new service category."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. identity-services"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier for the category
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-icon">Icon Name</Label>
              <Input
                id="cat-icon"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="e.g. 🆔 or folder"
              />
              <p className="text-xs text-muted-foreground">
                Emoji or icon name for display
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input
                id="cat-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label htmlFor="cat-active" className="font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive categories are hidden from the kiosk
                </p>
              </div>
              <Switch
                id="cat-active"
                checked={isActive}
                onCheckedChange={setIsActive}
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
            <Button type="submit">{isEdit ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
