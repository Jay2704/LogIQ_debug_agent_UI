import type { EvidenceCoverage, EvidenceCoverageLevel, EvidenceItem } from "@/types";

/** Expected signal sources for a well-covered investigation. */
const EXPECTED_EVIDENCE_SOURCES = [
  "APM",
  "Tracing",
  "Logs",
  "CI/CD",
  "Incident DB",
  "External",
] as const;

function normalizeSource(value: string): string {
  return value.trim().toLowerCase();
}

function resolveCoverageLevel(percent: number): EvidenceCoverageLevel {
  if (percent >= 85) return "high";
  if (percent >= 70) return "good";
  if (percent >= 50) return "partial";
  return "low";
}

export function buildEvidenceCoverage(input: {
  evidence: EvidenceItem[];
  limitationsNote?: string;
  confidenceNote?: string;
}): EvidenceCoverage {
  const availableSources = [
    ...new Set(
      input.evidence
        .map((item) => item.source.trim())
        .filter((source) => source.length > 0)
    ),
  ];

  const availableNormalized = new Set(availableSources.map(normalizeSource));
  const missingSources = EXPECTED_EVIDENCE_SOURCES.filter(
    (expected) => !availableNormalized.has(normalizeSource(expected))
  );

  const coveragePercent = Math.round(
    (availableSources.length / EXPECTED_EVIDENCE_SOURCES.length) * 100
  );

  const limitations = input.limitationsNote?.trim() ?? "";
  const confidence = input.confidenceNote?.trim() ?? "";
  const confidenceLimitations =
    [limitations, confidence].filter(Boolean).join(" ") ||
    "No confidence limitations recorded for this investigation.";

  return {
    coveragePercent: Math.max(0, Math.min(100, coveragePercent)),
    level: resolveCoverageLevel(coveragePercent),
    availableSources,
    missingSources: [...missingSources],
    confidenceLimitations,
  };
}
