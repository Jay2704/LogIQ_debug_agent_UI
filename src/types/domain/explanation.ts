/**
 * Structured explanation (LLM assistive layer).
 * UI may still use a plain string bundle field until backend sends markdown.
 */
export interface JobExplanation {
  jobId: string;
  markdown: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  detail: string;
  source: string;
}
