/** Node categories returned by GET /api/v1/investigations/{id}/graph */
export type InvestigationGraphNodeType =
  | "investigation"
  | "jira"
  | "commit"
  | "build"
  | "deployment"
  | "metric"
  | "alert"
  | "incident"
  | "runbook";

export interface InvestigationGraphNode {
  id: string;
  type: InvestigationGraphNodeType;
  title: string;
  timestamp?: string;
  metadata?: Record<string, string | number | boolean | null>;
  /** Optional layout hint from the backend; auto-layout when omitted. */
  position?: { x: number; y: number };
}

export interface InvestigationGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface InvestigationGraph {
  investigationId: string;
  nodes: InvestigationGraphNode[];
  edges: InvestigationGraphEdge[];
}
