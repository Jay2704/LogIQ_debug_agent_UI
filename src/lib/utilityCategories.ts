import type { UtilityCategory } from "@/types";

export const UTILITY_CATEGORY_LABELS: Record<UtilityCategory, string> = {
  search: "Search & filter",
  time: "Time & scope",
  classification: "Classification",
  summarization: "Summarization",
  parsing: "Parsing",
  extraction: "Extraction",
  heuristics: "Heuristics",
};

export const UTILITY_CATEGORY_ORDER: UtilityCategory[] = [
  "search",
  "time",
  "classification",
  "summarization",
  "parsing",
  "extraction",
  "heuristics",
];
