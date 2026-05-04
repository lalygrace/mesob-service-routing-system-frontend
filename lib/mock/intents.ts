export type IntentMapping = {
  id: string;
  phrase: string;
  language: "en" | "am" | "om";
  mappedServiceIds: string[];
  mappedServiceNames: string[];
  confidence: number;
  usageCount: number;
  createdAt: string;
};

export const MOCK_INTENTS: IntentMapping[] = [
  // English
  { id: "int-1", phrase: "I lost my ID", language: "en", mappedServiceIds: ["id-lost"], mappedServiceNames: ["Replace a lost ID"], confidence: 95, usageCount: 187, createdAt: "2025-01-20" },
  { id: "int-2", phrase: "My ID is damaged", language: "en", mappedServiceIds: ["id-damaged"], mappedServiceNames: ["Replace a damaged ID"], confidence: 92, usageCount: 54, createdAt: "2025-01-20" },
  { id: "int-3", phrase: "I want a new ID", language: "en", mappedServiceIds: ["id-new"], mappedServiceNames: ["Apply for a new ID"], confidence: 88, usageCount: 134, createdAt: "2025-01-20" },
  { id: "int-4", phrase: "Fix my ID name", language: "en", mappedServiceIds: ["id-correction"], mappedServiceNames: ["Correct ID information"], confidence: 85, usageCount: 42, createdAt: "2025-01-25" },
  { id: "int-5", phrase: "Renew passport", language: "en", mappedServiceIds: ["passport-renew"], mappedServiceNames: ["Renew an expired passport"], confidence: 96, usageCount: 203, createdAt: "2025-01-20" },
  { id: "int-6", phrase: "Start a business", language: "en", mappedServiceIds: ["business-start"], mappedServiceNames: ["Start a business (registration)"], confidence: 90, usageCount: 156, createdAt: "2025-02-01" },
  { id: "int-7", phrase: "Get driving license", language: "en", mappedServiceIds: ["drivers-license"], mappedServiceNames: ["Driving license service"], confidence: 93, usageCount: 98, createdAt: "2025-02-01" },
  { id: "int-8", phrase: "Register for tax", language: "en", mappedServiceIds: ["tax-registration"], mappedServiceNames: ["Tax registration"], confidence: 91, usageCount: 87, createdAt: "2025-02-01" },
  { id: "int-9", phrase: "My passport expired", language: "en", mappedServiceIds: ["passport-renew"], mappedServiceNames: ["Renew an expired passport"], confidence: 94, usageCount: 112, createdAt: "2025-02-10" },
  { id: "int-10", phrase: "I need a business license", language: "en", mappedServiceIds: ["business-start"], mappedServiceNames: ["Start a business (registration)"], confidence: 87, usageCount: 76, createdAt: "2025-02-15" },

  // Amharic
  { id: "int-11", phrase: "መታወቂያዬን አጥቻለሁ", language: "am", mappedServiceIds: ["id-lost"], mappedServiceNames: ["Replace a lost ID"], confidence: 93, usageCount: 245, createdAt: "2025-01-20" },
  { id: "int-12", phrase: "ፓስፖርቴን ማደስ እፈልጋለሁ", language: "am", mappedServiceIds: ["passport-renew"], mappedServiceNames: ["Renew an expired passport"], confidence: 91, usageCount: 178, createdAt: "2025-01-20" },
  { id: "int-13", phrase: "ንግድ መጀመር እፈልጋለሁ", language: "am", mappedServiceIds: ["business-start"], mappedServiceNames: ["Start a business (registration)"], confidence: 88, usageCount: 134, createdAt: "2025-02-01" },
  { id: "int-14", phrase: "የግብር ምዝገባ", language: "am", mappedServiceIds: ["tax-registration"], mappedServiceNames: ["Tax registration"], confidence: 90, usageCount: 67, createdAt: "2025-02-01" },

  // Afaan Oromo
  { id: "int-15", phrase: "Waraqaa eenyummaa koo nan dhabe", language: "om", mappedServiceIds: ["id-lost"], mappedServiceNames: ["Replace a lost ID"], confidence: 89, usageCount: 78, createdAt: "2025-01-20" },
  { id: "int-16", phrase: "Paaspoortii koo haaressuu", language: "om", mappedServiceIds: ["passport-renew"], mappedServiceNames: ["Renew an expired passport"], confidence: 87, usageCount: 45, createdAt: "2025-01-20" },
];

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  am: "Amharic",
  om: "Afaan Oromo",
};
