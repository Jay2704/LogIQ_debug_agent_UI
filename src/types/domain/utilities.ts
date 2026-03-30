/**
 * Standalone log-analysis utilities (separate from main RCA job workflow).
 * Backend can expose the same ids and metadata via API later.
 */

export type UtilityCategory =
  | "search"
  | "time"
  | "classification"
  | "summarization"
  | "parsing"
  | "extraction"
  | "heuristics";

/** Keys mapped to Lucide icons in the UI */
export type UtilityIconKey =
  | "search"
  | "clock"
  | "split"
  | "fileText"
  | "layers"
  | "listFilter"
  | "sparkles";

export interface UtilityToolDefinition {
  id: string;
  name: string;
  shortDescription: string;
  category: UtilityCategory;
  iconKey: UtilityIconKey;
}

export interface UtilityRunRecord {
  id: string;
  toolId: string;
  toolName: string;
  startedAt: string;
  status: "completed" | "failed" | "running";
}
