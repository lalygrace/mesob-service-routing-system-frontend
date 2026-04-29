"use client";

import { motion } from "framer-motion";
import { Mic, Keyboard, LayoutGrid } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

type IntakeMethod = "voice" | "type" | "categories";

const options: { method: IntakeMethod; icon: typeof Mic; color: string }[] = [
  { method: "voice", icon: Mic, color: "from-blue-500/10 to-indigo-500/10" },
  { method: "type", icon: Keyboard, color: "from-emerald-500/10 to-teal-500/10" },
  { method: "categories", icon: LayoutGrid, color: "from-amber-500/10 to-orange-500/10" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    categories: strings.intake.browseTitle,
  };
  const descs: Record<IntakeMethod, string> = {
    voice: strings.intake.voiceDesc,
    type: strings.intake.typeDesc,
    categories: strings.intake.browseDesc,
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.intake.heading}
        </h1>
        <p className="text-muted-foreground">{strings.intake.subheading}</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
        {options.map((opt) => (
          <motion.button
            key={opt.method}
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(opt.method)}
            className={`group flex items-center gap-5 rounded-2xl border border-border bg-gradient-to-r ${opt.color} p-5 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <opt.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">{titles[opt.method]}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{descs[opt.method]}</p>
            </div>
            <svg className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
