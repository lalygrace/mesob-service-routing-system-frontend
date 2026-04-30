"use client";

import { CreditCard, Plane, Briefcase, Car, Receipt } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

const ICONS = [CreditCard, Plane, Briefcase, Car, Receipt];

export function CategoryBrowse({
  strings,
  onPick,
}: {
  strings: Strings;
  onPick: (hint: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.categories.heading}
        </h1>
        <p className="text-muted-foreground">{strings.categories.subheading}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {strings.categories.items.map((cat, i) => {
          const Icon = ICONS[i] ?? CreditCard;
          return (
            <button
              key={cat.label}
              onClick={() => onPick(cat.hint)}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold text-foreground">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
