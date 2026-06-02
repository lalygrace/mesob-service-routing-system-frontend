import type { LanguageCode } from "@/lib/service-navigator/types";

export type Strings = {
  appTitle: string;
  appSubtitle: string;
  landing: {
    headline: string;
    subheadline: string;
    selectLanguage: string;
    featureVoice: string;
    featureVoiceDesc: string;
    featureGuide: string;
    featureGuideDesc: string;
    featureLanguage: string;
    featureLanguageDesc: string;
    getStarted: string;
  };
  systemMessages: {
    welcome: string;
    processing: string;
    closing: string;
    geminiUnavailable: string;
  };
  steps: {
    intake: { title: string; description: string };
    voice: { title: string; description: string };
    case: { title: string; description: string };
    categories: { title: string; description: string };
    assistant: { title: string; description: string };
    clarify: { title: string; description: string };
    results: { title: string; description: string };
    detail: { title: string; description: string };
    review: { title: string; description: string };
    feedback: { title: string; description: string };
  };
  intake: {
    heading: string;
    subheading: string;
    voiceTitle: string;
    voiceDesc: string;
    typeTitle: string;
    typeDesc: string;
    browseTitle: string;
    browseDesc: string;
  };
  voice: {
    heading: string;
    holdToSpeak: string;
    listening: string;
    release: string;
    notSupported: string;
    notSupportedDesc: string;
    typeInstead: string;
    whatWeHeard: string;
    editHint: string;
  };
  case: {
    heading: string;
    placeholder: string;
    hint: string;
    examples: string;
    exampleItems: string[];
  };
  categories: {
    heading: string;
    subheading: string;
    items: { label: string; hint: string }[];
  };
  assistant: {
    heading: string;
    subheading: string;
    pickOne: string;
    emptyInput: string;
    failedTitle: string;
    failedDesc: string;
  };
  clarify: {
    heading: string;
    subheading: string;
    pickOne: string;
  };
  results: {
    heading: string;
    youSaid: string;
    noResults: string;
    noResultsHint: string;
  };
  detail: {
    heading: string;
    organization: string;
    location: string;
    fee: string;
    processingTime: string;
    requirements: string;
    requirementsDesc: string;
    readiness: string;
    readyMessage: string;
    notReadyMessage: string;
    itemsConfirmed: string;
  };
  success: {
    heading: string;
    subheading: string;
    goTo: string;
    whatToBring: string;
    giveFeedback: string;
    startOver: string;
  };
  feedbackForm: {
    heading: string;
    subheading: string;
    wasHelpful: string;
    helpful: string;
    notHelpful: string;
    rating: string;
    comment: string;
    commentPlaceholder: string;
    submit: string;
    thankYou: string;
    thankYouDesc: string;
  };
  actions: {
    back: string;
    continue: string;
    startOver: string;
    tryAgain: string;
    askAgain: string;
    select: string;
    selected: string;
    imReady: string;
    skip: string;
  };
  header: {
    home: string;
  };
  noServiceSelected: string;
  noServiceSelectedDesc: string;
  review: {
    heading: string;
    subheading: string;
    missingDocsTitle: string;
    missingDocsDesc: string;
    readyTitle: string;
    readyDesc: string;
  };
};

/* ─── English ─── */
const EN: Strings = {
  appTitle: "Mesob Navigator",
  appSubtitle: "Government Service Assistant",
  landing: {
    headline: "Find the right government service — instantly.",
    subheadline:
      "Tell us about your case. We'll guide you to the exact office, floor, and counter at Mesob Center.",
    selectLanguage: "Choose your language",
    featureVoice: "Voice Enabled",
    featureVoiceDesc: "Speak naturally — we understand.",
    featureGuide: "Step-by-Step Guide",
    featureGuideDesc: "We walk you through everything.",
    featureLanguage: "3 Languages",
    featureLanguageDesc: "Amharic, English, Afaan Oromo.",
    getStarted: "Get Started",
  },
  systemMessages: {
    welcome:
      "Welcome to Mesob One-Stop Government Service Center. How can we help you today? Please describe your need, speak to us, or browse our services by organization.",
    processing:
      "Thank you, we are looking into that for you. Just a moment please.",
    closing:
      "Thank you for using Mesob One-Stop Government Service Center. We hope we were able to help you today. Wishing you a smooth and successful experience with your service. Have a wonderful day!",
    geminiUnavailable:
      "We're sorry, our AI service is temporarily unavailable. Please continue by browsing our services directly by organization. All services are still available.",
  },
  steps: {
    intake: {
      title: "Language",
      description: "Choose your language and input method.",
    },
    voice: { title: "Speak", description: "Describe your case." },
    case: { title: "Type", description: "Describe your case." },
    categories: { title: "Browse", description: "Pick a service area." },
    assistant: {
      title: "Assistant",
      description: "Answer a quick question if needed.",
    },
    clarify: { title: "Clarify", description: "Help us narrow it down." },
    results: { title: "Results", description: "Pick the best match." },
    detail: {
      title: "Service Details",
      description: "Review your service info.",
    },
    review: {
      title: "Review",
      description: "Confirm documents and leave feedback.",
    },
    feedback: { title: "Feedback", description: "Help us improve." },
  },
  intake: {
    heading: "How can we help you today?",
    subheading: "Choose the easiest option for you.",
    voiceTitle: "Speak your case",
    voiceDesc: "Tap and speak — the fastest option.",
    typeTitle: "Type your case",
    typeDesc: "Describe it in a short sentence.",
    browseTitle: "Browse categories",
    browseDesc: "Choose from common service areas.",
  },
  voice: {
    heading: "Speak your case",
    holdToSpeak: "Hold to speak",
    listening: "Listening…",
    release: "Release to stop",
    notSupported: "Voice not supported",
    notSupportedDesc: "Your browser doesn't support speech recognition.",
    typeInstead: "Type instead",
    whatWeHeard: "What we heard",
    editHint: "You can edit the text before continuing.",
  },
  case: {
    heading: "Type your case",
    placeholder: 'Example: "I lost my ID"',
    hint: "Keep it short. We'll ask if anything is unclear.",
    examples: "Popular services",
    exampleItems: [
      "I lost my ID",
      "My passport expired",
      "I want to start a business",
      "I need tax registration",
    ],
  },
  categories: {
    heading: "Browse categories",
    subheading: "Pick a category and we'll find the right service.",
    items: [
      { label: "ID Services", hint: "ID" },
      { label: "Passport Services", hint: "Passport" },
      { label: "Business Services", hint: "Business registration" },
      { label: "Transport Services", hint: "Driving license" },
      { label: "Revenue & Tax", hint: "Tax registration" },
    ],
  },
  assistant: {
    heading: "Assistant response",
    subheading: "If anything is unclear, we'll ask one quick question.",
    pickOne: "Choose one option",
    emptyInput: "(no input)",
    failedTitle: "We couldn't understand that",
    failedDesc: "Please try again, or switch to typing.",
  },
  clarify: {
    heading: "Let us narrow it down",
    subheading: "Pick the option closest to your need.",
    pickOne: "Choose one option",
  },
  results: {
    heading: "Matched government services",
    youSaid: "You said",
    noResults: "No confident match yet",
    noResultsHint:
      "Add a little more detail, or choose a service from the list.",
  },
  detail: {
    heading: "Service Information",
    organization: "Organization",
    location: "Location",
    fee: "Fee",
    processingTime: "Processing Time",
    requirements: "Required Documents",
    requirementsDesc: "Check what you already have.",
    readiness: "Your Readiness",
    readyMessage: "You're all set! Head to the counter.",
    notReadyMessage: "Missing items? You can still proceed.",
    itemsConfirmed: "items confirmed",
  },
  success: {
    heading: "You're ready!",
    subheading: "Here's where to go next.",
    goTo: "Go to",
    whatToBring: "What to bring",
    giveFeedback: "Give feedback",
    startOver: "Help someone else",
  },
  feedbackForm: {
    heading: "Quick Feedback",
    subheading: "Help us serve you better.",
    wasHelpful: "Was this helpful?",
    helpful: "Yes, helpful",
    notHelpful: "Not helpful",
    rating: "Rate your experience",
    comment: "Optional comment",
    commentPlaceholder: "What could be better?",
    submit: "Submit",
    thankYou: "Thank you!",
    thankYouDesc: "Your feedback helps us improve.",
  },
  actions: {
    back: "Back",
    continue: "Continue",
    startOver: "Start Over",
    tryAgain: "Try again",
    askAgain: "Ask again",
    select: "Select",
    selected: "Selected",
    imReady: "I'm Ready",
    skip: "Skip",
  },
  header: {
    home: "Home",
  },
  noServiceSelected: "No service selected",
  noServiceSelectedDesc: "Go back and select a service.",
  review: {
    heading: "Review and finish",
    subheading: "Confirm required documents and leave feedback.",
    missingDocsTitle: "Missing required documents",
    missingDocsDesc:
      "These documents are mandatory. If you're missing them, you may be asked to return later.",
    readyTitle: "All documents confirmed",
    readyDesc: "You're ready to go to the office.",
  },
};

/* ─── Amharic ─── */
const AM: Strings = {
  appTitle: "መሶብ ናቪጌተር",
  appSubtitle: "የመንግስት አገልግሎት ረዳት",
  landing: {
    headline: "ትክክለኛውን የመንግስት አገልግሎት — ወዲያውኑ ያግኙ።",
    subheadline: "ጉዳይዎን ይንገሩን። ወደ ትክክለኛው ቢሮ፣ ፎቅ እና ካውንተር እንመራዎታለን።",
    selectLanguage: "ቋንቋ ይምረጡ",
    featureVoice: "በድምጽ የሚሰራ",
    featureVoiceDesc: "በተፈጥሮ ይናገሩ — እንረዳለን።",
    featureGuide: "ደረጃ-በ-ደረጃ መመሪያ",
    featureGuideDesc: "ሁሉንም ነገር እንመራዎታለን።",
    featureLanguage: "3 ቋንቋዎች",
    featureLanguageDesc: "አማርኛ፣ እንግሊዝኛ፣ አፋን ኦሮሞ።",
    getStarted: "ጀምር",
  },
  systemMessages: {
    welcome:
      "እንኳን ወደ መሶብ አንድ-ማዕከል መንግሥታዊ አገልግሎት ማዕከል ደህና መጡ። ዛሬ እንዴት ልንረዳዎት እንችላለን? የሚፈልጉትን አገልግሎት ይግለጹ፣ ይናገሩን፣ ወይም አገልግሎቶቻችንን በድርጅት ያስሱ።",
    processing: "እናመሰግናለን፣ ለእርስዎ እየፈለግን ነው። እባክዎ ትንሽ ይጠብቁ።",
    closing:
      "መሶብ አንድ-ማዕከል መንግሥታዊ አገልግሎት ማዕከልን ስለተጠቀሙ እናመሰግናለን። ዛሬ ልንረዳዎት መቻላችንን ተስፋ እናደርጋለን። ከአገልግሎትዎ ጋር ለስላሳ እና ስኬታማ ልምድ እንመኝልዎታለን። መልካም ቀን ይሁንልዎት!",
    geminiUnavailable:
      "ይቅርታ፣ የእኛ AI አገልግሎት ጊዜያዊ ስራ ላይ የለም። እባክዎ አገልግሎቶቻችንን በቀጥታ በድርጅት በማሰስ ይቀጥሉ። ሁሉም አገልግሎቶች አሁንም ይገኛሉ።",
  },
  steps: {
    intake: { title: "ቋንቋ", description: "ቋንቋዎን እና የመግቢያ መንገድዎን ይምረጡ።" },
    voice: { title: "ይናገሩ", description: "ጉዳይዎን ይንገሩን።" },
    case: { title: "ይጻፉ", description: "ጉዳይዎን ይግለጹ።" },
    categories: { title: "ያስሱ", description: "የአገልግሎት ዘርፍ ይምረጡ።" },
    assistant: { title: "ረዳት", description: "ካስፈለገ ፈጣን ጥያቄ ይመልሱ።" },
    clarify: { title: "ያብራሩ", description: "እንድናጠብዎ ይርዱን።" },
    results: { title: "ውጤቶች", description: "ምርጥ ተዛማጁን ይምረጡ።" },
    detail: { title: "የአገልግሎት ዝርዝር", description: "መረጃውን ይገምግሙ።" },
    review: { title: "ማረጋገጫ", description: "ሰነዶችን ያረጋግጡ እና ግብረመልስ ይስጡ።" },
    feedback: { title: "ግብረመልስ", description: "እንድንሻሻል ይርዱን።" },
  },
  intake: {
    heading: "ዛሬ እንዴት ልንረዳዎ እንችላለን?",
    subheading: "ለእርስዎ ቀላሉን አማራጭ ይምረጡ።",
    voiceTitle: "ጉዳይዎን ይናገሩ",
    voiceDesc: "ይንኩ እና ይናገሩ — ፈጣን አማራጭ።",
    typeTitle: "ጉዳይዎን ይጻፉ",
    typeDesc: "በአጭር ዓረፍተ ነገር ይግለጹ።",
    browseTitle: "ምድቦችን ያስሱ",
    browseDesc: "ከተለመዱ አገልግሎት ዘርፎች ይምረጡ።",
  },
  voice: {
    heading: "ጉዳይዎን ይናገሩ",
    holdToSpeak: "ለመናገር ይያዙ",
    listening: "በማዳመጥ ላይ…",
    release: "ለማቆም ይልቀቁ",
    notSupported: "ድምጽ አይደገፍም",
    notSupportedDesc: "አሳሽዎ የድምጽ ቅጂ አይደግፍም።",
    typeInstead: "በምትኩ ይጻፉ",
    whatWeHeard: "የሰማነው",
    editHint: "ከመቀጠልዎ በፊት ጽሑፉን ማስተካከል ይችላሉ።",
  },
  case: {
    heading: "ጉዳይዎን ይጻፉ",
    placeholder: 'ምሳሌ: "መታወቂያዬ ጠፋ"',
    hint: "አጭር ያድርጉት። ግልጽ ያልሆነ ነገር ካለ እንጠይቃለን።",
    examples: "ታዋቂ አገልግሎቶች",
    exampleItems: [
      "መታወቂያዬ ጠፋ",
      "ፓስፖርቴ ጊዜው አልፏል",
      "ንግድ መጀመር እፈልጋለሁ",
      "የግብር ምዝገባ እፈልጋለሁ",
    ],
  },
  categories: {
    heading: "ምድቦችን ያስሱ",
    subheading: "ምድብ ይምረጡ ትክክለኛውን አገልግሎት እናገኛለን።",
    items: [
      { label: "የመታወቂያ አገልግሎቶች", hint: "ID" },
      { label: "የፓስፖርት አገልግሎቶች", hint: "Passport" },
      { label: "የንግድ አገልግሎቶች", hint: "Business registration" },
      { label: "የትራንስፖርት አገልግሎቶች", hint: "Driving license" },
      { label: "ገቢ እና ግብር", hint: "Tax registration" },
    ],
  },
  assistant: {
    heading: "የረዳት መልስ",
    subheading: "ግልጽ ካልሆነ ነገር ካለ አንድ ፈጣን ጥያቄ እንጠይቃለን።",
    pickOne: "አንድ አማራጭ ይምረጡ",
    emptyInput: "(ግብዓት የለም)",
    failedTitle: "መረዳት አልቻልንም",
    failedDesc: "እባክዎ እንደገና ይሞክሩ ወይም በመጻፍ ይግቡ።",
  },
  clarify: {
    heading: "እንጠብበው",
    subheading: "ለፍላጎትዎ ቅርብ የሆነውን ይምረጡ።",
    pickOne: "አንድ አማራጭ ይምረጡ",
  },
  results: {
    heading: "ተዛማጅ የመንግስት አገልግሎቶች",
    youSaid: "ያሉት",
    noResults: "አስተማማኝ ተዛማጅ አልተገኘም",
    noResultsHint: "ተጨማሪ ዝርዝር ይጨምሩ ወይም ከዝርዝሩ አገልግሎት ይምረጡ።",
  },
  detail: {
    heading: "የአገልግሎት መረጃ",
    organization: "ድርጅት",
    location: "አድራሻ",
    fee: "ክፍያ",
    processingTime: "የማስኬድ ጊዜ",
    requirements: "ያስፈልጉ ሰነዶች",
    requirementsDesc: "ያሉዎትን ያረጋግጡ።",
    readiness: "ዝግጁነትዎ",
    readyMessage: "ዝግጁ ነዎት! ወደ ካውንተሩ ይሂዱ።",
    notReadyMessage: "የጎደሉ ነገሮች? አሁንም መቀጠል ይችላሉ።",
    itemsConfirmed: "ዕቃዎች ተረጋግጠዋል",
  },
  success: {
    heading: "ዝግጁ ነዎት!",
    subheading: "ቀጥሎ የሚሄዱበት ይኸው ነው።",
    goTo: "ይሂዱ ወደ",
    whatToBring: "ይዘው የሚመጡት",
    giveFeedback: "ግብረመልስ ይስጡ",
    startOver: "ሌላ ሰው ይርዱ",
  },
  feedbackForm: {
    heading: "ፈጣን ግብረመልስ",
    subheading: "የተሻለ ለማገልገል ይርዱን።",
    wasHelpful: "ረድቶዎታል?",
    helpful: "አዎ፣ ረድቶኛል",
    notHelpful: "አልረዳኝም",
    rating: "ተሞክሮዎን ይደርጉ",
    comment: "አስተያየት (አማራጭ)",
    commentPlaceholder: "ምን ሊሻሻል ይችላል?",
    submit: "ያስገቡ",
    thankYou: "አመሰግናለሁ!",
    thankYouDesc: "ግብረመልስዎ እንድንሻሻል ይረዳናል።",
  },
  actions: {
    back: "ተመለስ",
    continue: "ቀጥል",
    startOver: "እንደገና ጀምር",
    tryAgain: "እንደገና ይሞክሩ",
    askAgain: "እንደገና ጠይቅ",
    select: "ምረጥ",
    selected: "ተመርጧል",
    imReady: "ዝግጁ ነኝ",
    skip: "ዝለል",
  },
  header: {
    home: "መነሻ",
  },
  noServiceSelected: "ምንም አገልግሎት አልተመረጠም",
  noServiceSelectedDesc: "ተመልሰው አገልግሎት ይምረጡ።",
  review: {
    heading: "ያረጋግጡ እና ያጠናቅቁ",
    subheading: "ያስፈልጉ ሰነዶችን ያረጋግጡ እና ግብረመልስ ይስጡ።",
    missingDocsTitle: "የሚጎዱ አስፈላጊ ሰነዶች",
    missingDocsDesc: "እነዚህ ሰነዶች አስፈላጊ ናቸው። ካልተዘጋጁ ሊመለሱ ይችላሉ።",
    readyTitle: "ሰነዶች ሁሉ ተረጋግጠዋል",
    readyDesc: "ወደ ቢሮው ለመሄድ ዝግጁ ነዎት።",
  },
};

/* ─── Afaan Oromo ─── */
const OM: Strings = {
  appTitle: "Mesob Navigator",
  appSubtitle: "Gargaaraa Tajaajila Mootummaa",
  landing: {
    headline: "Tajaajila mootummaa sirrii — dafqaan argadhu.",
    subheadline:
      "Dhimma kee nutti himi. Gara waajjira, darbii fi kaawuntaraa sirrii si qajeelchina.",
    selectLanguage: "Afaan filadhu",
    featureVoice: "Sagaleen Hojjeta",
    featureVoiceDesc: "Akka uumamaatti dubbadhu.",
    featureGuide: "Qajeelfama Tartiibaan",
    featureGuideDesc: "Waan hundaa si qajeelchina.",
    featureLanguage: "Afaan 3",
    featureLanguageDesc: "Amaariffaa, Ingiliffaa, Afaan Oromoo.",
    getStarted: "Jalqabi",
  },
  systemMessages: {
    welcome:
      "Gara Wiirtuu Tajaajila Mootummaa Tokkicha Mesob Nagaan Dhuftan. Har'a akkamitti isin gargaaruu dandeenya? Tajaajila barbaaddan ibsaa, nutti himaa, yookaan tajaajiloota keenya dhaabbata keessaa sakattaʼaa.",
    processing: "Galatoomaa; isinii barbaadaa jirra. Mee xinnoo obsa.",
    closing:
      "Wiirtuu Tajaajila Mootummaa Tokkicha Mesob fayyadamuu keessaniif galatoomaa. Har'a isin gargaaruu dandeenyee abdii qabna. Tajaajila keessan waliin muuxannoo sirrii fi milkaaʼaa akka qabaattan hawwina. Guyyaa gaarii qabaataa!",
    geminiUnavailable:
      "Dhiifama; tajaajilli AI keenya yeroo muraasaaf hin hojjetu. Mee tajaajiloota keenya kallattiin dhaabbata keessaa sakattaʼuun itti fufaa. Tajaajiloota hundi ammallee ni argamu.",
  },
  steps: {
    intake: {
      title: "Afaan",
      description: "Afaan fi karaa galtee filadhu.",
    },
    voice: { title: "Dubbadhu", description: "Dhimma kee nutti himi." },
    case: { title: "Barreessi", description: "Dhimma kee ibsi." },
    categories: { title: "Sakatta'i", description: "Gosa tajaajilaa filadhu." },
    assistant: {
      title: "Gargaaraa",
      description: "Yoo barbaachise gaaffii gabaabaa deebisi.",
    },
    clarify: { title: "Ibsi", description: "Akka dhiphisnuuf nu gargaari." },
    results: {
      title: "Bu'aa",
      description: "Kan irra caalaa walsimatu filadhu.",
    },
    detail: {
      title: "Ibsa Tajaajilaa",
      description: "Odeeffannoo kee ilaali.",
    },
    review: {
      title: "Mirkaneessi",
      description: "Sanadoota mirkaneessi, yaada kenni.",
    },
    feedback: { title: "Yaada", description: "Akka fooyya'inuuf nu gargaari." },
  },
  intake: {
    heading: "Har'a akkamiin si gargaaruu dandeenya?",
    subheading: "Filannoo siif salphaa ta'e filadhu.",
    voiceTitle: "Dhimma kee dubbadhu",
    voiceDesc: "Tuqi dubbadhu — filannoo dafqa.",
    typeTitle: "Dhimma kee barreessi",
    typeDesc: "Himaamsa gabaabaadhaan ibsi.",
    browseTitle: "Ramaddii sakatta'i",
    browseDesc: "Gosa tajaajila beekamoo keessaa filadhu.",
  },
  voice: {
    heading: "Dhimma kee dubbadhu",
    holdToSpeak: "Dubbachuuf qabi",
    listening: "Dhaggeeffachaa…",
    release: "Dhaabachuuf gadi lakkisi",
    notSupported: "Sagaleen hin deeggamu",
    notSupportedDesc: "Browseriin kee beekamtii sagalee hin deeggamu.",
    typeInstead: "Qooda barreessi",
    whatWeHeard: "Kan dhageenye",
    editHint: "Osoo hin itti fufiin barreeffama fooyyessuu dandeessa.",
  },
  case: {
    heading: "Dhimma kee barreessi",
    placeholder: 'Fkn: "Waraqaa eenyummaa koo dhabee"',
    hint: "Gabaabsi. Yoo hin ifa ta'iin ni gaafanna.",
    examples: "Tajaajila beekamoo",
    exampleItems: [
      "Waraqaa eenyummaa koo dhabee",
      "Paaspoortiin koo dhumateera",
      "Daldala jalqabuu barbaada",
      "Galmee gibiraa barbaada",
    ],
  },
  categories: {
    heading: "Ramaddii sakatta'i",
    subheading: "Ramaddii filadhu tajaajila sirrii arganna.",
    items: [
      { label: "Tajaajila Eenyummaa", hint: "ID" },
      { label: "Tajaajila Paaspootii", hint: "Passport" },
      { label: "Tajaajila Daldalaa", hint: "Business registration" },
      { label: "Tajaajila Geejjibaa", hint: "Driving license" },
      { label: "Galii fi Gibiraa", hint: "Tax registration" },
    ],
  },
  assistant: {
    heading: "Deebii gargaaraa",
    subheading: "Yoo hin ifa ta'iin gaaffii gabaabaa si gaafanna.",
    pickOne: "Filannoo tokko filadhu",
    emptyInput: "(galtee hin jiru)",
    failedTitle: "Hubachuu hin dandeenye",
    failedDesc: "Mee irra deebi'ii yaali, yookaan barreessuun galchi.",
  },
  clarify: {
    heading: "Haa dhiphisnu",
    subheading: "Kan fedhii keetti dhiyaatu filadhu.",
    pickOne: "Filannoo tokko filadhu",
  },
  results: {
    heading: "Tajaajiloota mootummaa walsiman",
    youSaid: "Kan jette",
    noResults: "Walsimni amanamaa hin argamne",
    noResultsHint:
      "Odeeffannoo dabalataa kenni yookaan tarree irraa tajaajila filadhu.",
  },
  detail: {
    heading: "Odeeffannoo Tajaajilaa",
    organization: "Dhaabbata",
    location: "Bakka",
    fee: "Kaffaltii",
    processingTime: "Yeroo Raawwii",
    requirements: "Sanadoota Barbaachisan",
    requirementsDesc: "Kan qabdu mirkaneessi.",
    readiness: "Qophaa'ummaa Kee",
    readyMessage: "Qophaa'aa dha! Gara kaawuntaraatti deemi.",
    notReadyMessage: "Waan hafe jiraa? Itti fufuu dandeessa.",
    itemsConfirmed: "meeshaaleen mirkanaa'an",
  },
  success: {
    heading: "Qophaa'aa dha!",
    subheading: "Itti aansuun bakka deemtu kunooti.",
    goTo: "Deemi gara",
    whatToBring: "Waan fiddu",
    giveFeedback: "Yaada kenni",
    startOver: "Nama biraa gargaari",
  },
  feedbackForm: {
    heading: "Yaada Dafqa",
    subheading: "Fooyya'iinsa keenyaaf nu gargaari.",
    wasHelpful: "Faayidaa qabaa?",
    helpful: "Eeyyee, na gargaareera",
    notHelpful: "Na hin gargaarre",
    rating: "Muuxannoo kee madaali",
    comment: "Yaada (dirqama miti)",
    commentPlaceholder: "Maaltu fooyya'uu danda'a?",
    submit: "Galchi",
    thankYou: "Galatoomaa!",
    thankYouDesc: "Yaadni kee akka fooyya'inuuf nu gargaara.",
  },
  actions: {
    back: "Duuba",
    continue: "Itti fufi",
    startOver: "Irra deebi'i",
    tryAgain: "Irra deebi'ii yaali",
    askAgain: "Irra deebi'ii gaafadhu",
    select: "Filadhu",
    selected: "Filatameera",
    imReady: "Qophaa'eera",
    skip: "Darbi",
  },
  header: {
    home: "Mana",
  },
  noServiceSelected: "Tajaajilli hin filatamne",
  noServiceSelectedDesc: "Duuba deebi'ii tajaajila filadhu.",
  review: {
    heading: "Mirkaneessi fi xumuri",
    subheading: "Sanadoota barbaachisan mirkaneessi, yaada kenni.",
    missingDocsTitle: "Sanadoota barbaachisan hafu",
    missingDocsDesc:
      "Sanadootni kunneen dirqama. Yoo hin qabne, deebitee dhufuu dandeessa.",
    readyTitle: "Sanadootni hundi mirkanaa'an",
    readyDesc: "Gara waajjiraatti deemuu dandeessa.",
  },
};

const STRINGS_MAP: Record<LanguageCode, Strings> = {
  en: EN,
  am: AM,
  om: OM,
};

export function getStrings(language: LanguageCode): Strings {
  return STRINGS_MAP[language] ?? EN;
}
