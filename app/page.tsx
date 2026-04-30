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
      {/* Premium Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.48_0.20_268/18%)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.38_0.16_280/12%)_0%,transparent_65%)]" />
      
      {/* Premium mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.40_0.18_268/8%)_0%,transparent_50%)]" />

      {/* Enhanced floating shapes with glow */}
      <div className="absolute top-20 right-[15%] h-72 w-72 rounded-full bg-white/6 blur-3xl animate-float" style={{ filter: "blur(80px)" }} />
      <div className="absolute bottom-32 left-[10%] h-56 w-56 rounded-full bg-white/6 blur-3xl animate-float" style={{ animationDelay: "3s", filter: "blur(80px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/3 blur-3xl animate-float" style={{ animationDelay: "1.5s", filter: "blur(100px)" }} />

      {/* Premium Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-lg border border-white/30 shadow-lg shadow-black/10 transition-transform hover:scale-105">
            M
          </div>
          <span className="text-white/95 font-semibold text-lg hidden sm:block tracking-tight">
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
          {/* Premium Headline */}
          <motion.h1
            variants={item}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
          >
            {strings.landing.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg text-white/80 sm:text-xl leading-relaxed"
          >
            {strings.landing.subheadline}
          </motion.p>

          {/* Premium Language Selection */}
          <motion.div variants={item} className="mt-12 w-full max-w-lg">
            <p className="mb-5 text-sm font-semibold text-white/70 uppercase tracking-widest text-center">
              {strings.landing.selectLanguage}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`group relative flex flex-col items-center gap-2 rounded-3xl border-2 px-5 py-6 transition-all duration-300 touch-target ${
                      isSelected
                        ? "border-white bg-white/25 shadow-xl shadow-white/15 scale-105 backdrop-blur-md"
                        : "border-white/20 bg-white/8 hover:border-white/40 hover:bg-white/15 hover:scale-102 backdrop-blur-sm"
                    }`}
                  >
                    <span className={`text-xl font-bold transition-colors ${isSelected ? "text-white drop-shadow-sm" : "text-white/85"}`}>
                      {lang.native}
                    </span>
                    <span className={`text-xs font-medium transition-colors ${isSelected ? "text-white/90" : "text-white/60"}`}>
                      {lang.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="lang-indicator"
                        className="absolute -bottom-1.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white shadow-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Premium Get Started Button */}
          <motion.div variants={item} className="mt-10">
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-[#1520A6] shadow-2xl shadow-black/25 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-100 touch-target-lg"
            >
              <span className="relative z-10">{strings.landing.getStarted}</span>
              <svg className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </button>
          </motion.div>

          {/* Premium Feature highlights */}
          <motion.div variants={item} className="mt-20 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 border border-white/20 p-6 backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-lg">
                  <f.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-bold text-white text-center leading-tight">{f.title}</span>
                <span className="text-xs text-white/70 text-center leading-relaxed">{f.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Premium Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/10">
        <p className="text-sm text-white/40 font-medium">
          © {new Date().getFullYear()} Mesob Center — Addis Ababa, Ethiopia
        </p>
      </footer>
    </div>
  );
}
