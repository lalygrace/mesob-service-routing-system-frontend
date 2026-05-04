// ── Analytics mock data ──────────────────────────────────────────────

export type DailyUsage = {
  date: string;
  sessions: number;
  resolved: number;
  clarifications: number;
};

export type ServicePopularity = {
  serviceId: string;
  serviceName: string;
  requests: number;
  successRate: number;
};

export type RatingDistribution = {
  rating: number;
  count: number;
};

export type LanguageUsage = {
  language: string;
  code: string;
  sessions: number;
  percentage: number;
};

export type HourlyUsage = {
  hour: string;
  sessions: number;
};

export type RecentSession = {
  id: string;
  query: string;
  language: string;
  result: "resolved" | "clarified" | "failed";
  service: string | null;
  timestamp: string;
};

// Generate last 30 days of usage data
function generateDailyUsage(): DailyUsage[] {
  const data: DailyUsage[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const base = 40 + Math.floor(Math.random() * 60);
    const resolved = Math.floor(base * (0.6 + Math.random() * 0.25));
    data.push({
      date: d.toISOString().slice(0, 10),
      sessions: base,
      resolved,
      clarifications: base - resolved,
    });
  }

  return data;
}

export const MOCK_DAILY_USAGE: DailyUsage[] = generateDailyUsage();

export const MOCK_SERVICE_POPULARITY: ServicePopularity[] = [
  { serviceId: "id-lost", serviceName: "Replace a lost ID", requests: 342, successRate: 89 },
  { serviceId: "passport-renew", serviceName: "Renew an expired passport", requests: 287, successRate: 92 },
  { serviceId: "business-start", serviceName: "Start a business", requests: 198, successRate: 78 },
  { serviceId: "id-new", serviceName: "Apply for a new ID", requests: 176, successRate: 85 },
  { serviceId: "drivers-license", serviceName: "Driving license service", requests: 154, successRate: 81 },
  { serviceId: "tax-registration", serviceName: "Tax registration", requests: 132, successRate: 94 },
  { serviceId: "id-damaged", serviceName: "Replace a damaged ID", requests: 98, successRate: 91 },
  { serviceId: "id-correction", serviceName: "Correct ID information", requests: 67, successRate: 76 },
];

export const MOCK_RATING_DISTRIBUTION: RatingDistribution[] = [
  { rating: 5, count: 312 },
  { rating: 4, count: 445 },
  { rating: 3, count: 198 },
  { rating: 2, count: 67 },
  { rating: 1, count: 32 },
];

export const MOCK_LANGUAGE_USAGE: LanguageUsage[] = [
  { language: "Amharic", code: "am", sessions: 580, percentage: 55 },
  { language: "English", code: "en", sessions: 326, percentage: 31 },
  { language: "Afaan Oromo", code: "om", sessions: 148, percentage: 14 },
];

export const MOCK_HOURLY_USAGE: HourlyUsage[] = [
  { hour: "6AM", sessions: 8 },
  { hour: "7AM", sessions: 22 },
  { hour: "8AM", sessions: 65 },
  { hour: "9AM", sessions: 89 },
  { hour: "10AM", sessions: 94 },
  { hour: "11AM", sessions: 78 },
  { hour: "12PM", sessions: 45 },
  { hour: "1PM", sessions: 56 },
  { hour: "2PM", sessions: 82 },
  { hour: "3PM", sessions: 76 },
  { hour: "4PM", sessions: 58 },
  { hour: "5PM", sessions: 34 },
  { hour: "6PM", sessions: 12 },
];

export const MOCK_RECENT_SESSIONS: RecentSession[] = [
  { id: "s1", query: "I lost my ID card", language: "en", result: "resolved", service: "Replace a lost ID", timestamp: "2 min ago" },
  { id: "s2", query: "መታወቂያዬን ፈልጋለሁ", language: "am", result: "clarified", service: null, timestamp: "5 min ago" },
  { id: "s3", query: "I want to renew my passport", language: "en", result: "resolved", service: "Renew an expired passport", timestamp: "8 min ago" },
  { id: "s4", query: "Business license", language: "en", result: "resolved", service: "Start a business", timestamp: "12 min ago" },
  { id: "s5", query: "Help me please", language: "en", result: "failed", service: null, timestamp: "15 min ago" },
  { id: "s6", query: "Tax registration process", language: "en", result: "resolved", service: "Tax registration", timestamp: "18 min ago" },
  { id: "s7", query: "Waraqaa eenyummaa koo", language: "om", result: "clarified", service: null, timestamp: "22 min ago" },
  { id: "s8", query: "Driving permit", language: "en", result: "resolved", service: "Driving license service", timestamp: "25 min ago" },
];

// Aggregate KPIs
export const MOCK_KPIS = {
  totalServices: 8,
  totalAuthorities: 6,
  todaySessions: MOCK_DAILY_USAGE[MOCK_DAILY_USAGE.length - 1]?.sessions ?? 0,
  avgSatisfaction: 4.2,
  totalSessions: MOCK_DAILY_USAGE.reduce((sum, d) => sum + d.sessions, 0),
  clarificationRate: 28,
  avgResolutionTimeSec: 45,
  sessionsTrend: 12.5,
  satisfactionTrend: 3.2,
  authoritiesTrend: 0,
  serviceTrend: 14.3,
};
