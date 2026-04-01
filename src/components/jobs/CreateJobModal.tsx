import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { api } from "@/api";
import { useRoleUiCapabilities } from "@/lib/roleUiCapabilities";
import { formatUserRoleLabel } from "@/lib/userDisplay";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { CreateJobInput, Job } from "@/types";

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
  const { user } = useCurrentUser();
  const roleCaps = useRoleUiCapabilities();
  const canSubmitJob =
    Boolean(user?.userId?.trim()) && roleCaps.canCreateJob;
  const [jobType, setJobType] = useState("debug_investigation");
  const [anomalyId, setAnomalyId] = useState("");
  const [runId, setRunId] = useState("");
  const [triggerSource, setTriggerSource] = useState("manual");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLock = useRef(false);

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!user?.userId?.trim()) {
      return "Login and select a user before creating a job.";
    }
    if (!roleCaps.canCreateJob) {
      return "Your role cannot create jobs in this workspace (UI rule only — not server enforcement).";
    }
    if (!jobType.trim()) return "Job type is required.";
    if (!anomalyId.trim()) return "Anomaly ID is required.";
    if (!runId.trim()) return "Run ID is required.";
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
    const triggeredBy = user?.userId?.trim();
    if (!triggeredBy) {
      setSubmitError("Login and select a user before creating a job.");
      return;
    }
    if (!roleCaps.canCreateJob) {
      setSubmitError(
        "Your role cannot create jobs (UI only — use an account with tester, support, developer, or SRE role)."
      );
      return;
    }
    submitLock.current = true;
    setSubmitError(null);
    setSubmitting(true);
    const input: CreateJobInput = {
      jobType: jobType.trim(),
      anomalyId: anomalyId.trim(),
      runId: runId.trim(),
      triggeredByUserId: triggeredBy,
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
              POST to the backend with your anomaly and run identifiers.{" "}
              <span className="text-slate-400">
                Triggered-by user comes from your current session (same id as the users
                table).
              </span>
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
              Triggered by (current user)
            </label>
            {user?.userId && roleCaps.canCreateJob ? (
              <div className="mt-1.5 rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2.5 text-sm text-slate-200">
                <p className="font-medium text-slate-100">
                  {user.name?.trim() || user.email}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  triggered_by_user_id · {user.userId}
                </p>
              </div>
            ) : user?.userId && !roleCaps.canCreateJob ? (
              <div className="mt-1.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-sm text-amber-100/95">
                <p className="font-medium text-amber-50/95">
                  Role: {formatUserRoleLabel(user.role)}
                </p>
                <p className="mt-1 text-amber-100/80">
                  Viewers can open jobs and dashboards but cannot create new jobs here. Ask a
                  teammate with tester, support, developer, or SRE access.
                </p>
              </div>
            ) : (
              <div className="mt-1.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-sm text-amber-100/95">
                <p className="font-medium text-amber-50/95">No user in session</p>
                <p className="mt-1 text-amber-100/80">
                  Login with your email on the login page so your user id can be sent as{" "}
                  <span className="font-mono text-xs">triggered_by_user_id</span>.
                </p>
                <Link
                  to="/login"
                  className="mt-2 inline-block text-sm font-semibold text-sky-400 hover:text-sky-300"
                >
                  Go to Login →
                </Link>
              </div>
            )}
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
              disabled={submitting || !canSubmitJob}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                (submitting || !canSubmitJob) && "pointer-events-none opacity-60"
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
