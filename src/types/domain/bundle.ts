import type { Anomaly } from "./anomaly";
import type { EvidenceItem } from "./explanation";
import type { Job } from "./job";
import type { RcaResult } from "./rca";

/** Historical incident for similarity / dedup context */
export interface SimilarIncident {
  id: string;
  title: string;
  /** Affected service for ops triage */
  service: string;
  occurredAt: string;
  overlap: string;
}

/**
 * Aggregated workspace payload for a single job detail view.
 * Backend may split across endpoints later; the UI consumes this shape via {@link import('@/api').api}.
 */
export interface JobDetailBundle {
  job: Job;
  anomaly: Anomaly;
  rca: RcaResult;
  /** Assistive narrative (often markdown); parallel to {@link JobExplanation} */
  explanation: string;
  evidence: EvidenceItem[];
  remediation: string[];
  similarIncidents: SimilarIncident[];
  confidenceNote: string;
  limitationsNote: string;
}
