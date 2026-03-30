import { useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { api } from "@/api";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { CreateJobInput, Job } from "@/types";

/** Default for local dev — backend may require a registered user UUID (not a plain string). */
const DEMO_TRIGGERED_BY = "18c6e126-b6d4-517e-ab4c-6ffa1e2f8eeb";

const TRIGGER_OPTIONS = [
  { value: "alert", label: "Alert" },
  { value: "manual", label: "Manual" },
  { value: "scheduled", label: "Scheduled" },
  { value: "api", label: "API" },
  { value: "webhook", label: "Webhook" },
];

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after successful create with the parsed job row (canonical ids from API). */
  onCreated: (job: Job) => void;
}

export function CreateJobModal({
  isOpen,
  onClose,
  onCreated,
}: CreateJobModalProps) {
  const [jobType, setJobType] = useState("debug_investigation");
  const [anomalyId, setAnomalyId] = useState("");
  const [runId, setRunId] = useState("");
  const [triggeredByUserId, setTriggeredByUserId] = useState(DEMO_TRIGGERED_BY);
  const [triggerSource, setTriggerSource] = useState("manual");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLock = useRef(false);

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!jobType.trim()) return "Job type is required.";
    if (!anomalyId.trim()) return "Anomaly ID is required.";
    if (!runId.trim()) return "Run ID is required.";
    if (!triggeredByUserId.trim()) return "Triggered-by user id is required.";
    if (!triggerSource.trim()) return "Trigger source is required.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitLock.current || submitting) return;
    const v = validate();
    if (v) {
      setSubmitError(v);
      return;
    }
    submitLock.current = true;
    setSubmitError(null);
    setSubmitting(true);
    const input: CreateJobInput = {
      jobType: jobType.trim(),
      anomalyId: anomalyId.trim(),
      runId: runId.trim(),
      triggeredByUserId: triggeredByUserId.trim(),
      triggerSource: triggerSource.trim(),
    };
    try {
      const job = await api.jobs.create(input);
      onCreated(job);
      onClose();
      setAnomalyId("");
      setRunId("");
      setSubmitError(null);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-job-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm disabled:cursor-not-allowed"
        aria-label="Close"
        disabled={submitting}
        onClick={onClose}
      />
      <div
        role="document"
        aria-busy={submitting}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-blue-500/20",
          "bg-gradient-to-br from-surface-900/98 to-surface-975/98 p-6 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)]",
          "ring-1 ring-white/[0.06]"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-500/90">
              New job
            </p>
            <h2 id="create-job-title" className="mt-1 text-xl font-bold text-white">
              Create job
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              POST to the backend with your anomaly and run identifiers. Demo user id is
              prefilled for local use.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Job type
            </label>
            <input
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 font-mono text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-600 focus:border-sky-500/40"
              placeholder="e.g. debug_investigation"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Anomaly ID
            </label>
            <input
              value={anomalyId}
              onChange={(e) => setAnomalyId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 font-mono text-sm text-slate-200 outline-none focus:border-sky-500/40"
              placeholder="anomaly_…"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Run ID
            </label>
            <input
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 font-mono text-sm text-slate-200 outline-none focus:border-sky-500/40"
              placeholder="run_…"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Triggered by user ID
            </label>
            <input
              value={triggeredByUserId}
              onChange={(e) => setTriggeredByUserId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 font-mono text-sm text-slate-200 outline-none focus:border-sky-500/40"
              placeholder={DEMO_TRIGGERED_BY}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Trigger source
            </label>
            <select
              value={triggerSource}
              onChange={(e) => setTriggerSource(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-500/40"
            >
              {TRIGGER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {submitError ? (
            <div
              className="rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-200/95"
              role="alert"
            >
              <p className="font-semibold text-red-100/95">Could not create job</p>
              <p className="mt-1 text-red-200/90">{submitError}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] bg-surface-975/80 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.14] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                submitting && "pointer-events-none opacity-70"
              )}
            >
              {submitting ? "Creating…" : "Create job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
