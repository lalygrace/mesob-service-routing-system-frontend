"use client";

import { motion } from "framer-motion";
import { CreditCard, Plane, Briefcase, Car, Receipt } from "lucide-react";
import type { Strings } from "@/lib/service-navigator/strings";

const ICONS = [CreditCard, Plane, Briefcase, Car, Receipt];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function CategoryBrowse({
  strings, onPick,
}: {
  strings: Strings; onPick: (hint: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.categories.heading}
        </h1>
        <p className="text-muted-foreground">{strings.categories.subheading}</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2"
      >
        {strings.categories.items.map((cat, i) => {
          const Icon = ICONS[i] ?? CreditCard;
          return (
            <motion.button
              key={cat.label}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(cat.hint)}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold text-foreground">{cat.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
