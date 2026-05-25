"use client";

import { Keyboard, Mic, Building2 } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type IntakeMethod = "voice" | "type" | "browse";

const options: { method: IntakeMethod; icon: typeof Mic }[] = [
  { method: "voice", icon: Mic },
  { method: "type", icon: Keyboard },
  { method: "browse", icon: Building2 },
];

export function IntakeStep({
  strings,
  onPick,
}: {
  strings: Strings;
  onPick: (method: IntakeMethod) => void;
}) {
  const titles: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceTitle,
    type: strings.intake.typeTitle,
    browse: strings.intake.browseTitle,
  };
  const descs: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceDesc,
    type: strings.intake.typeDesc,
    browse: strings.intake.browseDesc,
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.intake.heading}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          {strings.intake.subheading}
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        {/* Top row: voice + type */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {options
            .filter((o) => o.method !== "browse")
            .map((opt) => (
              <Card
                key={opt.method}
                role="button"
                tabIndex={0}
                onClick={() => onPick(opt.method)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPick(opt.method);
                  }
                }}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-border/50 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.02] shadow-lg"
              >
                <div className="relative h-full min-h-[220px] p-8 flex flex-col">
                  {/* Decorative blue curved shape - ALWAYS VISIBLE */}
                  <div className="absolute inset-0 opacity-70">
                    <svg
                      viewBox="0 0 400 300"
                      className="absolute inset-0 w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0,0 L 0,300 Q 150,200 400,280 L 400,0 Z"
                        className="fill-primary/15"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105 mb-auto">
                      <opt.icon className="h-8 w-8" strokeWidth={2} />
                    </div>
                    <div className="space-y-2 mt-6">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {titles[opt.method]}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                        {descs[opt.method]}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Bottom row: browse by organization — full width */}
        <Card
          role="button"
          tabIndex={0}
          onClick={() => onPick("browse")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPick("browse");
            }
          }}
          className="group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-border/50 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.01] shadow-lg"
        >
          <div className="relative p-8 flex items-center gap-6">
            {/* Decorative blue curved shape - ALWAYS VISIBLE */}
            <div className="absolute inset-0 opacity-70">
              <svg
                viewBox="0 0 800 150"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 0,150 Q 300,100 800,140 L 800,0 Z"
                  className="fill-primary/15"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-6 w-full">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                <Building2 className="h-8 w-8" strokeWidth={2} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  {titles.browse}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  {descs.browse}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
