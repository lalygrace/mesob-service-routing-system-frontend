"use client";

import { motion } from "framer-motion";
import { Mic, Keyboard, LayoutGrid, Sparkles } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

type IntakeMethod = "voice" | "type" | "categories";

const options: { method: IntakeMethod; icon: typeof Mic; gradient: string; glow: string }[] = [
  { method: "voice", icon: Mic, gradient: "from-blue-500 via-indigo-500 to-purple-600", glow: "shadow-blue-500/50" },
  { method: "type", icon: Keyboard, gradient: "from-emerald-500 via-teal-500 to-cyan-600", glow: "shadow-emerald-500/50" },
  { method: "categories", icon: LayoutGrid, gradient: "from-amber-500 via-orange-500 to-red-600", glow: "shadow-amber-500/50" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-fit"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
              <Sparkles className="h-10 w-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
          {strings.intake.heading}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">{strings.intake.subheading}</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 max-w-3xl mx-auto">
        {options.map((opt, idx) => (
          <motion.button
            key={opt.method}
            variants={item}
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(opt.method)}
            className={`group relative overflow-hidden flex items-center gap-8 rounded-3xl border-2 border-border bg-card p-8 text-left transition-all duration-500 hover:border-primary/40 hover:shadow-2xl ${opt.glow} touch-target-lg`}
          >
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            {/* Animated glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.3,
              }}
              className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} blur-2xl`}
            />
            
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${opt.gradient} shadow-2xl ${opt.glow} transition-all duration-500 group-hover:shadow-3xl`}
            >
              <opt.icon className="h-12 w-12 text-white" strokeWidth={2.5} />
            </motion.div>
            
            <div className="relative min-w-0 flex-1">
              <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors mb-2">{titles[opt.method]}</p>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">{descs[opt.method]}</p>
            </div>
            
            <motion.svg
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-8 shrink-0 text-muted-foreground/40 transition-all duration-500 group-hover:text-primary group-hover:scale-125"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
