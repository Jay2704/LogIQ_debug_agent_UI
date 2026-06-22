export type RcaFeedbackAction = "confirm" | "reject" | "override";

export interface RcaFeedbackEntry {
  id: string;
  jobId: string;
  action: RcaFeedbackAction;
  comment?: string;
  submittedAt: string;
  submittedBy?: string;
}

export interface RcaFeedbackSummary {
  jobId: string;
  history: RcaFeedbackEntry[];
  confirmationRate: number;
  rejectionRate: number;
  totalCount: number;
}

export interface RcaFeedbackSubmitInput {
  action: RcaFeedbackAction;
  comment?: string;
}
