import type {
  UtilityRunRecord,
  UtilityToolDefinition,
} from "@/types/domain/utilities";

export const utilityTools: UtilityToolDefinition[] = [
  {
    id: "keyword-search",
    name: "Keyword Search",
    shortDescription:
      "Search logs by keyword or phrase. Quickly find matching log lines and repeated patterns.",
    category: "search",
    iconKey: "search",
  },
  {
    id: "time-slice-filter",
    name: "Time Slice Filter",
    shortDescription:
      "Narrow logs to a specific time window. Useful for incident-focused investigation.",
    category: "time",
    iconKey: "clock",
  },
  {
    id: "error-splitter",
    name: "Error Splitter",
    shortDescription:
      "Separate error logs from non-error logs. Highlight likely failure segments.",
    category: "classification",
    iconKey: "split",
  },
  {
    id: "log-summary",
    name: "Log Summary",
    shortDescription:
      "Generate a concise summary of large raw logs. Surface important patterns and failure hints.",
    category: "summarization",
    iconKey: "fileText",
  },
  {
    id: "stack-trace-parser",
    name: "Stack Trace Parser",
    shortDescription:
      "Extract and structure stack traces. Highlight frames, services, and likely fault locations.",
    category: "parsing",
    iconKey: "layers",
  },
  {
    id: "error-lines-extractor",
    name: "Error Lines Extractor",
    shortDescription:
      "Pull out high-signal error lines from noisy logs. Useful before RCA or manual review.",
    category: "extraction",
    iconKey: "listFilter",
  },
  {
    id: "root-cause-heuristics",
    name: "Root Cause Heuristics",
    shortDescription:
      "Run deterministic helper heuristics on logs. Surface likely issue clusters before full RCA.",
    category: "heuristics",
    iconKey: "sparkles",
  },
];

/** Tool ids shown in “Most used” — mock ranking */
export const utilityMostUsedIds: string[] = [
  "keyword-search",
  "error-lines-extractor",
  "time-slice-filter",
];

export const utilityRecentRuns: UtilityRunRecord[] = [
  {
    id: "run_2026_03_29_a",
    toolId: "keyword-search",
    toolName: "Keyword Search",
    startedAt: "2026-03-29T15:42:00Z",
    status: "completed",
  },
  {
    id: "run_2026_03_29_b",
    toolId: "stack-trace-parser",
    toolName: "Stack Trace Parser",
    startedAt: "2026-03-29T14:08:00Z",
    status: "completed",
  },
  {
    id: "run_2026_03_28_c",
    toolId: "root-cause-heuristics",
    toolName: "Root Cause Heuristics",
    startedAt: "2026-03-28T21:15:00Z",
    status: "failed",
  },
];
