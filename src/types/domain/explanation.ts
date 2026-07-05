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

/**
 * Explicit assistive provenance when the API sends it — used for subtle UI labels only.
 */
export type AssistiveSourceHint = "fallback" | "local_llm";

/**
 * Assistive explanation from GET /api/v1/rca/explanation/{anomaly_id}.
 * Does not replace deterministic RCA — narrative + alignment notes only.
 */
export interface RcaAssistiveExplanation {
  explanationSummary: string;
  evidenceHighlights: string[];
  confidenceAlignmentNote: string;
  limitations: string;
  /** optional_patch_direction, patch_direction, etc. */
  patchDirection?: string;
  remediationSteps: string[];
  /**
   * Closing assistive synthesis — maps `final_report_summary`, `executive_summary`, etc.
   * from the API (not deterministic RCA).
   */
  finalReportSummary?: string;
  /**
   * When the API explicitly marks fallback/template copy (e.g. is_fallback, source).
   * Do not infer from empty fields alone.
   */
  sourceHint?: AssistiveSourceHint;
  /**
   * Explicit false when the backend signals the LLM is unreachable (optional).
   * If undefined, the UI does not assume outage.
   */
  llmAvailable?: boolean;
  /** Short server message for degraded assistive mode (optional). */
  assistiveNotice?: string;
  /** MCP signals, artifacts, and GraphRAG citations when returned by explanation API */
  mcpContext?: import("./rcaMcpSignals").RcaMcpInvestigationContext;
}
