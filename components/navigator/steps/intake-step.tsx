"use client";

import { Keyboard, Mic, Building2 } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.intake.heading}
        </h1>
        <p className="text-lg text-muted-foreground">
          {strings.intake.subheading}
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        {/* Top row: voice + type */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-4 sm:mb-6">
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
                className="group cursor-pointer transition-all hover:border-primary/50 hover:bg-card/80 shadow-xl"
              >
                <CardContent className="flex flex-col items-start gap-4 sm:gap-5 p-6 sm:p-8 text-left">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <opt.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                      {titles[opt.method]}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {descs[opt.method]}
                    </p>
                  </div>
                </CardContent>
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
          className="group cursor-pointer transition-all hover:border-primary/50 hover:bg-card/80 shadow-xl"
        >
          <CardContent className="flex items-center gap-5 p-6 sm:p-8">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {titles.browse}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {descs.browse}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
