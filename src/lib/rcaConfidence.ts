/** Normalized 0–1 deterministic confidence from the RCA pipeline. */

export type ConfidenceTier = "high" | "medium" | "low";

export interface ConfidenceInterpretation {
  tier: ConfidenceTier;
  /** Short label for badges, e.g. "High confidence" */
  label: string;
}

/** Short copy shown next to the confidence meter (deterministic RCA). */
export const CONFIDENCE_CONTEXT_RANKED =
  "This root cause is ranked highest based on deterministic scoring.";

export const CONFIDENCE_CONTEXT_SIGNALS =
  "Confidence is derived from graph-based signals.";

/**
 * Interpretation bands (deterministic score, not LLM):
 * - &gt; 0.8 → high
 * - 0.5–0.8 → medium (inclusive)
 * - &lt; 0.5 → low
 */
export function interpretConfidence(value: number): ConfidenceInterpretation {
  const v = Number.isFinite(value) ? value : 0;
  if (v > 0.8) {
    return { tier: "high", label: "High confidence" };
  }
  if (v >= 0.5) {
    return { tier: "medium", label: "Medium confidence" };
  }
  return { tier: "low", label: "Low confidence" };
}

/** Tailwind class fragments for tier-colored badges (shared with compact UIs). */
export const confidenceTierBadgeClassName: Record<ConfidenceTier, string> = {
  high:
    "border-emerald-500/35 bg-emerald-500/[0.12] text-emerald-200/95",
  medium:
    "border-amber-500/35 bg-amber-500/[0.12] text-amber-200/95",
  low: "border-rose-500/35 bg-rose-500/[0.12] text-rose-200/95",
};
