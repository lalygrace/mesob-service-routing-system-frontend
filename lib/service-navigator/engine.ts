import type {
  ClarifyOption,
  Decision,
  LanguageCode,
  MatchCandidate,
  Service,
  ServiceTopicId,
} from "@/lib/service-navigator/types";

function normalizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input: string) {
  const normalized = normalizeText(input);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function scoreService(
  service: Service,
  tokens: string[],
  language: LanguageCode,
) {
  const keywords = service.keywords[language] ?? [];
  if (tokens.length === 0 || keywords.length === 0) {
    return { score: 0, matched: [] as string[] };
  }

  const matched: string[] = [];
  let score = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;

    // Phrase match
    if (normalizedKeyword.includes(" ")) {
      const phrase = normalizedKeyword;
      if (normalizeText(tokens.join(" ")).includes(phrase)) {
        score += 3;
        matched.push(keyword);
      }
      continue;
    }

    // Token match
    if (tokens.includes(normalizedKeyword)) {
      score += 1;
      matched.push(keyword);
    }
  }

  return { score, matched: unique(matched) };
}

export function matchServices({
  services,
  input,
  language,
  maxCandidates = 3,
}: {
  services: Service[];
  input: string;
  language: LanguageCode;
  maxCandidates?: number;
}): MatchCandidate[] {
  const tokens = tokenize(input);

  const candidates = services
    .map((service) => {
      const { score, matched } = scoreService(service, tokens, language);
      return { service, score, matched };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return candidates.slice(0, maxCandidates);
}

function topicsFromCandidates(candidates: MatchCandidate[]) {
  return unique(candidates.map((c) => c.service.topicId));
}

function buildTopicClarify({
  topicId,
  services,
}: {
  topicId: ServiceTopicId;
  services: Service[];
}): { question: string; options: ClarifyOption[] } | null {
  const byTopic = services.filter((s) => s.topicId === topicId);

  if (topicId === "id") {
    const options: ClarifyOption[] = [
      { id: "id-lost", label: "Lost ID", serviceIds: ["id-lost"] },
      { id: "id-damaged", label: "Damaged ID", serviceIds: ["id-damaged"] },
      { id: "id-new", label: "New ID", serviceIds: ["id-new"] },
      {
        id: "id-correction",
        label: "Correction (name/date/etc.)",
        serviceIds: ["id-correction"],
      },
    ].filter((o) =>
      o.serviceIds.every((id) => byTopic.some((s) => s.id === id)),
    );

    if (options.length >= 2) {
      return {
        question: "What kind of ID issue are you facing?",
        options,
      };
    }
  }

  // Fallback: clarify by listing topic services
  if (byTopic.length >= 2) {
    return {
      question: "Which service are you looking for?",
      options: byTopic.map((s) => ({
        id: s.id,
        label: s.title,
        serviceIds: [s.id],
      })),
    };
  }

  return null;
}

export function decide({
  services,
  input,
  language,
}: {
  services: Service[];
  input: string;
  language: LanguageCode;
}): Decision {
  const candidates = matchServices({
    services,
    input,
    language,
    maxCandidates: 3,
  });

  if (candidates.length === 0) {
    // No match: clarify using broad categories
    const options: ClarifyOption[] = [
      {
        id: "topic-id",
        label: "ID services",
        serviceIds: services.filter((s) => s.topicId === "id").map((s) => s.id),
      },
      {
        id: "topic-passport",
        label: "Passport services",
        serviceIds: services
          .filter((s) => s.topicId === "passport")
          .map((s) => s.id),
      },
      {
        id: "topic-business",
        label: "Business services",
        serviceIds: services
          .filter((s) => s.topicId === "business")
          .map((s) => s.id),
      },
      {
        id: "topic-transport",
        label: "Transport services",
        serviceIds: services
          .filter((s) => s.topicId === "transport")
          .map((s) => s.id),
      },
      {
        id: "topic-revenue",
        label: "Revenue / Tax services",
        serviceIds: services
          .filter((s) => s.topicId === "revenue")
          .map((s) => s.id),
      },
    ].filter((o) => o.serviceIds.length > 0);

    return {
      mode: "clarify",
      candidates: [],
      reason: "no-match",
      clarify: {
        question: "Tell us what area you need help with.",
        options: options.slice(0, 5),
      },
    };
  }

  const top = candidates[0];
  const second = candidates[1];

  const topScore = top.score;
  const secondScore = second?.score ?? 0;
  const delta = topScore - secondScore;

  // High confidence: strong top score or clear separation
  if (topScore >= 4 || (topScore >= 2 && delta >= 2)) {
    return {
      mode: "suggest",
      candidates,
      reason: "high-confidence",
    };
  }

  // Ambiguous: similar top two in different topics => clarify
  const topics = topicsFromCandidates(candidates);
  if (candidates.length >= 2 && delta <= 1 && topics.length >= 2) {
    const clarifyTopic = buildTopicClarify({
      topicId: top.service.topicId,
      services,
    });

    return {
      mode: "clarify",
      candidates,
      reason: "ambiguous",
      clarify: clarifyTopic ?? {
        question: "Can you choose the closest option?",
        options: candidates.map((c) => ({
          id: c.service.id,
          label: c.service.title,
          serviceIds: [c.service.id],
        })),
      },
    };
  }

  // Low-ish confidence: clarify within the top topic if possible
  const clarify = buildTopicClarify({ topicId: top.service.topicId, services });
  if (clarify) {
    return {
      mode: "clarify",
      candidates,
      reason: "low-confidence",
      clarify,
    };
  }

  return {
    mode: "suggest",
    candidates,
    reason: "low-confidence",
  };
}
