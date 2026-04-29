export type LanguageCode = "am" | "en" | "om";

export type ServiceTopicId =
  | "id"
  | "passport"
  | "business"
  | "transport"
  | "revenue";

export type Service = {
  id: string;
  title: string;
  authority: string;
  locationHint: string;
  feeHint: string;
  durationHint: string;
  requirements: string[];

  topicId: ServiceTopicId;
  keywords: Record<LanguageCode, string[]>;
};

export type MatchCandidate = {
  service: Service;
  score: number;
  matched: string[];
};

export type DecisionMode = "suggest" | "clarify";

export type ClarifyOption = {
  id: string;
  label: string;
  serviceIds: string[];
};

export type Decision = {
  mode: DecisionMode;
  candidates: MatchCandidate[];
  reason: "high-confidence" | "low-confidence" | "ambiguous" | "no-match";
  clarify?: {
    question: string;
    options: ClarifyOption[];
  };
};
