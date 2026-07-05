import type {
  AssistiveSourceHint,
  RcaAssistiveExplanation,
  RcaResult,
} from "@/types";
import { parseRcaMcpInvestigationContext } from "./parseRcaMcpApi";

function pickStr(o: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickNum(o: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

function asRecord(v: unknown): Record<string, unknown> | undefined {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : undefined;
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : String(x)))
    .filter(Boolean);
}

function pickBool(o: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "boolean") return v;
  }
  return undefined;
}

/**
 * Only returns a hint when the API explicitly indicates source — never inferred from emptiness.
 */
function parseAssistiveSourceHint(
  o: Record<string, unknown>
): AssistiveSourceHint | undefined {
  if (o.is_fallback === true || o.used_fallback === true) return "fallback";
  const mode = pickStr(o, [
    "explanation_source",
    "assistive_source",
    "source",
    "explanation_mode",
  ]);
  if (mode?.toLowerCase().includes("fallback")) return "fallback";

  const model = pickStr(o, ["model", "llm_model", "ollama_model"]);
  const prov = pickStr(o, ["llm_provider", "provider", "generator"]);
  const llm = pickStr(o, ["llm"]);
  const blob = `${model ?? ""} ${prov ?? ""} ${llm ?? ""}`.toLowerCase();
  if (blob.includes("ollama")) return "local_llm";
  return undefined;
}

const DONE_STEPS: RcaResult["steps"] = {
  triage: "done",
  rca: "done",
  evidence: "done",
  explanation: "done",
  reporting: "done",
};

/**
 * Maps GET /api/v1/rca/results/{anomaly_id} JSON into {@link RcaResult}.
 * Returns `null` when there is no usable primary candidate.
 */
export function parseRcaResultsJson(json: unknown, jobId: string): RcaResult | null {
  if (json === null || json === undefined) return null;
  if (typeof json !== "object") return null;

  const root = json as Record<string, unknown>;

  const candidates = root.candidates;

  let primary = asRecord(root.primary_candidate);
  if (!primary) primary = asRecord(root.primary);
  if (!primary) primary = asRecord(root.top_candidate);

  if (
    Array.isArray(candidates) &&
    candidates.length === 0 &&
    !primary
  ) {
    return null;
  }

  let path =
    pickStr(root, [
      "primary_root_path",
      "root_cause_path",
      "root_cause",
      "file_path",
      "path",
    ]) ?? (primary ? pickStr(primary, ["file_path", "path", "root_cause_path", "root_cause"]) : undefined);

  let fileId =
    pickStr(root, ["file_id", "fileId", "anchor_id"]) ??
    (primary ? pickStr(primary, ["file_id", "fileId"]) : undefined) ??
    "—";

  let evidenceRef =
    pickStr(root, ["evidence_ref", "evidence_reference", "evidenceRef"]) ??
    (primary ? pickStr(primary, ["evidence_ref", "evidence_reference"]) : undefined) ??
    "";

  const runId =
    pickStr(root, ["run_id", "runId", "pipeline_run_id"]) ?? "—";

  let rank = pickNum(root, ["rank", "candidate_rank"]) ?? 1;
  if (primary) {
    rank = pickNum(primary, ["rank"]) ?? rank;
  }

  let confidence =
    pickNum(root, ["confidence", "confidence_score", "score"]) ?? 0;
  if (primary) {
    confidence = pickNum(primary, ["confidence", "confidence_score"]) ?? confidence;
  }

  const candidateStatus =
    pickStr(root, ["candidate_status", "status"]) ??
    (primary ? pickStr(primary, ["status", "candidate_status"]) : undefined);

  if (!path || path.length === 0) {
    if (Array.isArray(candidates) && candidates.length > 0) {
      const first = asRecord(candidates[0]);
      if (first) {
        path = pickStr(first, ["file_path", "path", "root_cause_path"]);
        fileId = pickStr(first, ["file_id", "fileId"]) ?? fileId;
        evidenceRef = pickStr(first, ["evidence_ref", "evidence_reference"]) ?? evidenceRef;
        confidence = pickNum(first, ["confidence"]) ?? confidence;
      }
    }
  }

  if (!path) return null;

  const c = confidence > 1 ? confidence / 100 : confidence;

  return {
    jobId,
    fileId,
    runId,
    rootCausePath: path,
    confidence: Math.min(1, Math.max(0, c)),
    rank: Math.max(0, Math.floor(rank)),
    evidenceRef,
    candidateStatus,
    steps: { ...DONE_STEPS },
    mcpContext: parseRcaMcpInvestigationContext(root),
  };
}

/**
 * Maps GET /api/v1/rca/explanation/{anomaly_id} JSON into {@link RcaAssistiveExplanation}.
 */
export function parseRcaExplanationJson(json: unknown): RcaAssistiveExplanation {
  if (!json || typeof json !== "object") {
    return {
      explanationSummary: "",
      evidenceHighlights: [],
      confidenceAlignmentNote: "",
      limitations: "",
      remediationSteps: [],
    };
  }
  const o = json as Record<string, unknown>;
  const llmAvailable = pickBool(o, ["llm_available", "llmAvailable"]);
  const sourceHint = parseAssistiveSourceHint(o);

  return {
    explanationSummary:
      pickStr(o, ["explanation_summary", "explanationSummary", "summary"]) ?? "",
    evidenceHighlights: toStringArray(
      o.evidence_highlights ?? o.evidenceHighlights
    ),
    confidenceAlignmentNote:
      pickStr(o, [
        "confidence_alignment_note",
        "confidenceAlignmentNote",
        "alignment_note",
      ]) ?? "",
    limitations: pickStr(o, ["limitations", "limitation"]) ?? "",
    patchDirection: pickStr(o, [
      "optional_patch_direction",
      "optionalPatchDirection",
      "patch_direction",
      "patchDirection",
    ]),
    remediationSteps: toStringArray(
      o.remediation_steps ?? o.remediationSteps ?? o.remediation
    ),
    finalReportSummary: pickStr(o, [
      "final_report_summary",
      "finalReportSummary",
      "executive_summary",
      "executiveSummary",
      "report_summary",
      "reportSummary",
      "report_executive_summary",
    ]),
    sourceHint,
    ...(llmAvailable !== undefined ? { llmAvailable } : {}),
    assistiveNotice: pickStr(o, [
      "assistive_notice",
      "assistiveNotice",
      "status_message",
      "user_message",
    ]),
    mcpContext: parseRcaMcpInvestigationContext(o),
  };
}
