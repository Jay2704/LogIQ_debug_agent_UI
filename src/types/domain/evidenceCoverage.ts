/** Evidence source coverage band for investigation quality. */
export type EvidenceCoverageLevel = "high" | "good" | "partial" | "low";

export interface EvidenceCoverage {
  coveragePercent: number;
  level: EvidenceCoverageLevel;
  availableSources: string[];
  missingSources: string[];
  confidenceLimitations: string;
}

export const EVIDENCE_COVERAGE_LEVEL_LABELS: Record<EvidenceCoverageLevel, string> = {
  high: "High",
  good: "Good",
  partial: "Partial",
  low: "Low",
};
