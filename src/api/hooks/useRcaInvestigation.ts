import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/api";
import { logApiDebug } from "@/api/http/debugLog";
import type { RcaAssistiveExplanation, RcaResult } from "@/types";

export type InvestigationPhase =
  | "idle"
  | "running"
  | "fetching"
  | "ready"
  | "error";

function computePipelineSteps(
  bundleSteps: RcaResult["steps"],
  phase: InvestigationPhase,
  liveRca: RcaResult | null | undefined,
  hasAssistivePayload: boolean
): RcaResult["steps"] {
  if (phase === "idle" || phase === "error") return bundleSteps;
  if (phase === "running") {
    return { ...bundleSteps, triage: "done", rca: "active" };
  }
  if (phase === "fetching") {
    return {
      ...bundleSteps,
      triage: "done",
      rca: "done",
      evidence: "active",
      explanation: "active",
    };
  }
  if (phase === "ready") {
    if (liveRca === null) {
      return {
        triage: "done",
        rca: "done",
        evidence: "done",
        explanation: hasAssistivePayload ? "done" : "pending",
        reporting: "pending",
      };
    }
    if (liveRca) return liveRca.steps;
  }
  return bundleSteps;
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export interface UseRcaInvestigationResult {
  phase: InvestigationPhase;
  runInvestigation: () => Promise<void>;
  /** `undefined` = not run yet; `null` = ran, no deterministic candidate */
  liveRca: RcaResult | null | undefined;
  /** Populated after a successful run+fetch */
  liveExplanation: RcaAssistiveExplanation | undefined;
  error: string | null;
  /** Non-blocking issues after debug agent (e.g. RCA or explanation fetch failed alone) */
  warning: string | null;
  successMessage: string | null;
  /** Short line for the pipeline banner while running / fetching (UI-only staging). */
  progressLabel: string;
  /** 0–3 for the four pipeline beats (start → RCA → explanation → finalize); -1 when idle. */
  progressStepIndex: number;
  clearSuccess: () => void;
  clearWarning: () => void;
  getPipelineSteps: (bundleDefault: RcaResult["steps"]) => RcaResult["steps"];
}

export function useRcaInvestigation(
  jobId: string,
  anomalyId: string
): UseRcaInvestigationResult {
  const [phase, setPhase] = useState<InvestigationPhase>("idle");
  const [liveRca, setLiveRca] = useState<RcaResult | null | undefined>(
    undefined
  );
  const [liveExplanation, setLiveExplanation] = useState<
    RcaAssistiveExplanation | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  /** Cosmetic sub-step while `phase === "fetching"` — cycles for richer status copy. */
  const [fetchUiStep, setFetchUiStep] = useState(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    setPhase("idle");
    setLiveRca(undefined);
    setLiveExplanation(undefined);
    setError(null);
    setWarning(null);
    setSuccessMessage(null);
    setFetchUiStep(0);
    inFlightRef.current = false;
  }, [jobId, anomalyId]);

  useEffect(() => {
    if (phase !== "fetching") {
      setFetchUiStep(0);
      return;
    }
    setFetchUiStep(0);
    const t1 = setTimeout(() => setFetchUiStep(1), 650);
    const t2 = setTimeout(() => setFetchUiStep(2), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const progressLabel = useMemo(() => {
    if (phase === "running") return "Starting investigation…";
    if (phase === "fetching") {
      if (fetchUiStep <= 0) return "Running deterministic RCA…";
      if (fetchUiStep === 1) return "Fetching explanation…";
      return "Finalizing report…";
    }
    return "";
  }, [phase, fetchUiStep]);

  const progressStepIndex = useMemo(() => {
    if (phase === "running") return 0;
    if (phase === "fetching") {
      if (fetchUiStep <= 0) return 1;
      if (fetchUiStep === 1) return 2;
      return 3;
    }
    return -1;
  }, [phase, fetchUiStep]);

  const runInvestigation = useCallback(async () => {
    if (inFlightRef.current) return;

    const aid = anomalyId?.trim() ?? "";
    const jid = jobId?.trim() ?? "";
    if (!aid) {
      setPhase("error");
      setError("Anomaly ID is missing — cannot run the debug agent.");
      setWarning(null);
      setSuccessMessage(null);
      setLiveRca(undefined);
      setLiveExplanation(undefined);
      return;
    }
    if (!jid) {
      setPhase("error");
      setError("Job ID is missing — cannot attach RCA results.");
      setWarning(null);
      setSuccessMessage(null);
      setLiveRca(undefined);
      setLiveExplanation(undefined);
      return;
    }

    inFlightRef.current = true;
    setPhase("running");
    setError(null);
    setWarning(null);
    setSuccessMessage(null);
    setLiveRca(undefined);
    setLiveExplanation(undefined);
    try {
      logApiDebug("runInvestigation start", { anomalyId: aid, jobId: jid });
      await api.debugAgent.run(aid);
      setPhase("fetching");

      const [rcaSettled, exSettled] = await Promise.allSettled([
        api.rca.getResultsByAnomalyId(aid, jid),
        api.rca.getExplanationByAnomalyId(aid),
      ]);

      let rcaRes: RcaResult | null = null;
      if (rcaSettled.status === "fulfilled") {
        rcaRes = rcaSettled.value;
      }

      let ex: RcaAssistiveExplanation | undefined;
      if (exSettled.status === "fulfilled") {
        ex = exSettled.value;
      }

      setLiveRca(rcaRes);
      setLiveExplanation(ex);

      const rcaFail =
        rcaSettled.status === "rejected" ? errMsg(rcaSettled.reason) : null;
      const exFail =
        exSettled.status === "rejected" ? errMsg(exSettled.reason) : null;

      if (rcaFail && exFail) {
        setPhase("error");
        setError(
          `Could not load investigation results. Deterministic RCA: ${rcaFail} Assistive explanation: ${exFail}`
        );
        return;
      }

      setPhase("ready");

      if (rcaFail) {
        setWarning(
          `Deterministic RCA could not be loaded: ${rcaFail} The assistive layer may still be shown if it was retrieved.`
        );
      } else if (exFail) {
        setWarning(
          `Assistive explanation could not be loaded: ${exFail} Deterministic RCA is shown when available.`
        );
      } else {
        setWarning(null);
      }

      if (rcaFail && !exFail) {
        setSuccessMessage(
          "Assistive explanation is updated. Deterministic RCA could not be loaded — see warning."
        );
      } else if (exFail && !rcaFail) {
        setSuccessMessage(
          "Deterministic RCA is updated. Assistive explanation could not be loaded — see warning."
        );
      } else {
        setSuccessMessage(
          rcaRes
            ? "Deterministic RCA and assistive explanation are now shown below."
            : "No deterministic candidate was returned; assistive narrative may still apply below."
        );
      }
    } catch (e) {
      setPhase("error");
      setError(errMsg(e));
      setWarning(null);
    } finally {
      inFlightRef.current = false;
    }
  }, [anomalyId, jobId]);

  const clearSuccess = useCallback(() => setSuccessMessage(null), []);
  const clearWarning = useCallback(() => setWarning(null), []);

  const getPipelineSteps = useCallback(
    (bundleDefault: RcaResult["steps"]) =>
      computePipelineSteps(
        bundleDefault,
        phase,
        liveRca,
        liveExplanation !== undefined
      ),
    [phase, liveRca, liveExplanation]
  );

  return useMemo(
    () => ({
      phase,
      runInvestigation,
      liveRca,
      liveExplanation,
      error,
      warning,
      successMessage,
      progressLabel,
      progressStepIndex,
      clearSuccess,
      clearWarning,
      getPipelineSteps,
    }),
    [
      phase,
      runInvestigation,
      liveRca,
      liveExplanation,
      error,
      warning,
      successMessage,
      progressLabel,
      progressStepIndex,
      clearSuccess,
      clearWarning,
      getPipelineSteps,
    ]
  );
}
