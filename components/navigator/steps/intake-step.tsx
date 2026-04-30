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
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    <div className="space-y-10 animate-fade-in-up">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {strings.intake.heading}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{strings.intake.subheading}</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5 max-w-2xl mx-auto">
        {options.map((opt) => (
          <motion.button
            key={opt.method}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(opt.method)}
            className={`group flex items-center gap-6 rounded-3xl border-2 border-border bg-gradient-to-br ${opt.color} p-6 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 touch-target-lg`}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg">
              <opt.icon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{titles[opt.method]}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{descs[opt.method]}</p>
            </div>
            <svg className="h-6 w-6 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
