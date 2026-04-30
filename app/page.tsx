"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mic, Route, Languages, Sparkles, Zap, Shield } from "lucide-react";
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
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = React.useState<LanguageCode>("en");
  const [isHovering, setIsHovering] = React.useState(false);
  const strings = getStrings(language);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);

  function handleLanguageSelect(code: LanguageCode) {
    setLanguage(code);
  }

  function handleGetStarted() {
    router.push(`/navigate?lang=${language}`);
  }

  const features = [
    { icon: Sparkles, title: strings.landing.featureVoice, desc: strings.landing.featureVoiceDesc, gradient: "from-blue-500 via-indigo-500 to-purple-500" },
    { icon: Zap, title: strings.landing.featureGuide, desc: strings.landing.featureGuideDesc, gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    { icon: Shield, title: strings.landing.featureLanguage, desc: strings.landing.featureLanguageDesc, gradient: "from-amber-500 via-orange-500 to-red-500" },
  ];

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1520A6] to-[#0f1729]">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.3)_0%,transparent_50%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.25)_0%,transparent_50%)] animate-pulse-slower" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2)_0%,transparent_60%)] animate-pulse-slowest" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      {/* Floating orbs with glow */}
      <motion.div style={{ y: y1 }} className="absolute top-20 right-[10%] h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-float-slow" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 left-[10%] h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl animate-pulse-slowest" />

      {/* Ultra-premium glassmorphic header */}
      <header className="relative z-50 mx-auto w-full max-w-7xl px-6 py-6 sm:px-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-2xl shadow-2xl shadow-black/20"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-2xl shadow-lg shadow-blue-500/50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative">M</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-white tracking-tight">{strings.appTitle}</h1>
              <p className="text-xs text-white/60 font-medium">Government Service Navigator</p>
            </div>
          </div>
          <ThemeToggle />
        </motion.div>
      </header>

      {/* Main content with stunning visuals */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full max-w-5xl flex-col items-center text-center"
        >
          {/* Spectacular headline with gradient text */}
          <motion.div variants={item} className="relative">
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-3xl"
            />
            <h1 className="relative text-5xl font-black leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl">
              {strings.landing.headline}
            </h1>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-xl text-white/80 sm:text-2xl leading-relaxed font-medium"
          >
            {strings.landing.subheadline}
          </motion.p>

          {/* Stunning language selector with 3D effect */}
          <motion.div variants={item} className="mt-16 w-full max-w-2xl">
            <p className="mb-6 text-sm font-bold text-white/70 uppercase tracking-[0.3em] text-center">
              {strings.landing.selectLanguage}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {LANGUAGES.map((lang, idx) => {
                const isSelected = language === lang.code;
                return (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-500 ${
                      isSelected
                        ? "border-white/40 bg-gradient-to-br from-white/20 to-white/5 shadow-2xl shadow-white/20"
                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 backdrop-blur-xl"
                    }`}
                  >
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isSelected ? 'opacity-50' : ''}`} />
                    
                    <div className="relative z-10">
                      <span className={`block text-2xl font-black transition-all duration-300 ${isSelected ? "text-white scale-110" : "text-white/90"}`}>
                        {lang.native}
                      </span>
                      <span className={`mt-2 block text-xs font-bold uppercase tracking-wider transition-colors ${isSelected ? "text-white/90" : "text-white/60"}`}>
                        {lang.label}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        layoutId="lang-indicator"
                        className="absolute -bottom-0.5 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg shadow-blue-500/50"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Spectacular CTA button */}
          <motion.div variants={item} className="mt-16">
            <motion.button
              onClick={handleGetStarted}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-12 py-6 text-xl font-black text-white shadow-2xl shadow-blue-500/50 transition-all duration-300"
            >
              {/* Animated shine effect */}
              <motion.div
                animate={{
                  x: isHovering ? ["-100%", "200%"] : "-100%",
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              
              {/* Pulsing glow */}
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
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl"
              />
              
              <span className="relative z-10 flex items-center gap-3">
                {strings.landing.getStarted}
                <motion.svg
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Stunning feature cards with 3D effect */}
          <motion.div variants={item} className="mt-24 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10"
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}
                  >
                    <f.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-lg font-black text-white">{f.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">{f.desc}</p>
                </div>

                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${f.gradient} blur-xl opacity-50`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Elegant footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-white/50 font-medium">
            © {new Date().getFullYear()} Mesob Center — Addis Ababa, Ethiopia
          </p>
          <p className="mt-2 text-xs text-white/30">
            Powered by AI • Built with Excellence
          </p>
        </div>
      </footer>
    </div>
  );
}
