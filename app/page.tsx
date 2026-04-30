"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, Route, Languages } from "lucide-react";
import { getStrings } from "@/lib/service-navigator/strings";
import type { LanguageCode } from "@/lib/service-navigator/types";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "en", label: "English", native: "English" },
  { code: "om", label: "Afaan Oromo", native: "Afaan Oromoo" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = React.useState<LanguageCode>("en");
  const strings = getStrings(language);

  function handleLanguageSelect(code: LanguageCode) {
    setLanguage(code);
  }

  function handleGetStarted() {
    router.push(`/navigate?lang=${language}`);
  }

  const features = [
    { icon: Mic, title: strings.landing.featureVoice, desc: strings.landing.featureVoiceDesc },
    { icon: Route, title: strings.landing.featureGuide, desc: strings.landing.featureGuideDesc },
    { icon: Languages, title: strings.landing.featureLanguage, desc: strings.landing.featureLanguageDesc },
  ];

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.18_268/15%)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.35_0.15_280/10%)_0%,transparent_60%)]" />

      {/* Floating shapes */}
      <div className="absolute top-20 right-[15%] h-64 w-64 rounded-full bg-white/5 blur-3xl animate-float" />
      <div className="absolute bottom-32 left-[10%] h-48 w-48 rounded-full bg-white/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white font-bold text-base border border-white/20">
            M
          </div>
          <span className="text-white/90 font-semibold text-base hidden sm:block">
            {strings.appTitle}
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full max-w-2xl flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {strings.landing.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-base text-white/70 sm:text-lg"
          >
            {strings.landing.subheadline}
          </motion.p>

          {/* Language Selection */}
          <motion.div variants={item} className="mt-10 w-full max-w-md">
            <p className="mb-4 text-sm font-medium text-white/60 uppercase tracking-wider">
              {strings.landing.selectLanguage}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 px-4 py-5 transition-all duration-300 ${
                      isSelected
                        ? "border-white bg-white/20 shadow-lg shadow-white/10 scale-105"
                        : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-lg font-bold transition-colors ${isSelected ? "text-white" : "text-white/80"}`}>
                      {lang.native}
                    </span>
                    <span className={`text-xs transition-colors ${isSelected ? "text-white/80" : "text-white/50"}`}>
                      {lang.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="lang-indicator"
                        className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Get Started Button */}
          <motion.div variants={item} className="mt-8">
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1520A6] shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-100"
            >
              {strings.landing.getStarted}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div variants={item} className="mt-16 grid w-full max-w-lg grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <f.icon className="h-5 w-5 text-white/80" />
                </div>
                <span className="text-xs font-semibold text-white/90 text-center leading-tight">{f.title}</span>
                <span className="text-[10px] text-white/50 text-center leading-tight hidden sm:block">{f.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Mesob Center — Addis Ababa, Ethiopia
        </p>
      </footer>
    </div>
  );
}
