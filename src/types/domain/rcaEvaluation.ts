export interface RcaEvaluationSummary {
  totalInvestigations: number;
  totalFeedback: number;
  confirmationRate: number;
  rejectionRate: number;
  overrideRate: number;
  averageConfidence: number;
  highConfidenceAccuracy: number;
}

export interface RcaServiceAccuracyRow {
  service: string;
  investigations: number;
  accuracy: number;
  confirmationRate: number;
  rejectionRate: number;
}

export interface RcaServiceAccuracyResult {
  services: RcaServiceAccuracyRow[];
}

export interface RcaConfidenceAccuracyRow {
  level: "high" | "medium" | "low";
  label: string;
  accuracy: number;
  count: number;
}

export interface RcaConfidenceEvaluation {
  byLevel: RcaConfidenceAccuracyRow[];
  highConfidenceAccuracy: number;
}

export interface RcaFeedbackTrendPoint {
  date: string;
  confirms: number;
  rejects: number;
  overrides: number;
}

export interface RcaCandidateRow {
  candidate: string;
  count: number;
  service?: string;
}

export interface RcaEvaluationTrends {
  feedbackTrend: RcaFeedbackTrendPoint[];
  mostConfirmedCandidates: RcaCandidateRow[];
  mostRejectedCandidates: RcaCandidateRow[];
}
