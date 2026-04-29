import type { LanguageCode } from "@/lib/service-navigator/types";

export type Strings = {
  appTitle: string;
  steps: {
    language: { title: string; description: string };
    intake: { title: string; description: string };
    voice: { title: string; description: string };
    problem: { title: string; description: string };
    categories: { title: string; description: string };
    clarify: { title: string; description: string };
    suggestions: { title: string; description: string };
    details: { title: string; description: string };
    requirements: { title: string; description: string };
    summary: { title: string; description: string };
    feedback: { title: string; description: string };
  };
  actions: {
    back: string;
    continue: string;
    startOver: string;
    select: string;
    selected: string;
    confirmAndFinish: string;
  };
  labels: {
    language: string;
  };
};

const EN: Strings = {
  appTitle: "Mesob Service Navigator",
  steps: {
    language: {
      title: "Welcome",
      description: "Choose your language to begin.",
    },
    intake: {
      title: "How can we help?",
      description: "Choose how you want to describe your problem.",
    },
    voice: {
      title: "Speak",
      description: "Hold to speak. We will show the text.",
    },
    problem: {
      title: "Type",
      description: "Type a short sentence about your problem.",
    },
    categories: {
      title: "Categories",
      description: "Browse common service areas.",
    },
    clarify: {
      title: "Clarify",
      description: "Help us narrow it down.",
    },
    suggestions: {
      title: "Suggestions",
      description: "Pick the best match.",
    },
    details: {
      title: "Details",
      description: "See where to go and what to bring.",
    },
    requirements: {
      title: "Checklist",
      description: "Confirm required documents.",
    },
    summary: {
      title: "Confirm",
      description: "Review and confirm before proceeding.",
    },
    feedback: {
      title: "Feedback",
      description: "Help us improve.",
    },
  },
  actions: {
    back: "Back",
    continue: "Continue",
    startOver: "Start over",
    select: "Select",
    selected: "Selected",
    confirmAndFinish: "Confirm & finish",
  },
  labels: {
    language: "Language",
  },
};

export function getStrings(language: LanguageCode): Strings {
  // We keep UI copy in English for now to avoid incorrect translations.
  // Add real translations once provided/verified.
  void language;
  return EN;
}
