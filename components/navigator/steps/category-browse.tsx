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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.categories.heading}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">{strings.categories.subheading}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {strings.categories.items.map((cat, i) => {
          const Icon = ICONS[i] ?? CreditCard;
          return (
            <button
              key={cat.label}
              onClick={() => onPick(cat.hint)}
              className="group relative overflow-hidden rounded-3xl border-2 border-border/50 bg-card p-6 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.02] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[140px]"
            >
              {/* Decorative blue curved shape */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  viewBox="0 0 400 200"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0,0 L 0,200 Q 150,130 400,180 L 400,0 Z"
                    className="fill-primary/15"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105 mb-auto">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <div className="mt-4">
                  <p className="text-xl font-bold text-foreground leading-tight">
                    {cat.label}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
