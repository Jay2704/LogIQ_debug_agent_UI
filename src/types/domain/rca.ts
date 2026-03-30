/** Deterministic root-cause result for a job (source of truth) */
export interface RcaResult {
  jobId: string;
  /** Deterministic anchor id for the ranked file (evidence store) */
  fileId: string;
  /** Pipeline run identifier for this investigation */
  runId: string;
  rootCausePath: string;
  confidence: number;
  rank: number;
  evidenceRef: string;
  steps: {
    triage: "pending" | "done" | "active";
    rca: "pending" | "done" | "active";
    evidence: "pending" | "done" | "active";
    explanation: "pending" | "done" | "active";
    reporting: "pending" | "done" | "active";
  };
}
