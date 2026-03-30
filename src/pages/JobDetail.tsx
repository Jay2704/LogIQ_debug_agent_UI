import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  GitBranch,
  ListChecks,
  MessageSquareWarning,
  Users,
} from "lucide-react";
import { RcaResultCard } from "@/components/ui/RcaResultCard";
import { StepProgressBar } from "@/components/ui/StepProgressBar";
import { ExplanationPanel } from "@/components/ui/ExplanationPanel";
import { EvidenceList } from "@/components/ui/EvidenceList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getJobDetailBundle } from "@/data/mock";
import { formatDateTime } from "@/lib/utils";

const triggerLabels = {
  alert: "Alert",
  manual: "Manual",
  scheduled: "Scheduled",
  api: "API",
  webhook: "Webhook",
} as const;

export function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const bundle = jobId ? getJobDetailBundle(jobId) : undefined;

  if (!bundle) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Job not found"
        description="No mock job matches this ID. Open Jobs and pick a job from the table."
        action={
          <Link
            to="/jobs"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Back to jobs
          </Link>
        }
      />
    );
  }

  const { job, anomaly, rca, explanation, evidence, remediation, similarIncidents, confidenceNote, limitationsNote } =
    bundle;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Jobs
          </Link>
          <h1 className="mt-2 font-mono text-xl font-semibold text-white">
            {job.id}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Linked anomaly ·{" "}
            <span className="font-mono text-violet-400">{job.anomalyId}</span>
          </p>
        </div>
        <StatusBadge status={job.status} className="self-start" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-card border border-white/[0.06] bg-surface-900/50 p-5 shadow-card">
            <h2 className="text-sm font-semibold text-slate-200">
              Job metadata
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-xl bg-surface-850/60 px-3 py-2">
                <CalendarClock className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                    Created
                  </dt>
                  <dd className="font-mono text-xs text-slate-300">
                    {formatDateTime(job.createdAt)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-surface-850/60 px-3 py-2">
                <GitBranch className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                    Trigger source
                  </dt>
                  <dd className="text-sm text-slate-300">
                    {triggerLabels[job.trigger]}
                  </dd>
                </div>
              </div>
              {job.service ? (
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                    Service
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-slate-300">
                    {job.service}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-card border border-white/[0.06] bg-surface-900/50 p-5 shadow-card">
            <h2 className="text-sm font-semibold text-slate-200">
              Anomaly summary
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {anomaly.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-surface-800 px-2 py-1 font-mono">
                {anomaly.signalType}
              </span>
              <span className="rounded-md bg-surface-800 px-2 py-1">
                Detected {formatDateTime(anomaly.detectedAt)}
              </span>
            </div>
          </div>

          <RcaResultCard rca={rca} />

          <div className="rounded-card border border-white/[0.06] bg-surface-900/50 p-5 shadow-card">
            <StepProgressBar stepState={rca.steps} />
          </div>
        </div>

        <div className="space-y-6">
          <ExplanationPanel content={explanation} />

          <EvidenceList items={evidence} />

          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-5 shadow-card">
            <div className="flex items-center gap-2 text-slate-200">
              <ListChecks className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold">Remediation Steps</h3>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-400">
              {remediation.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-5 shadow-card">
            <div className="flex items-center gap-2 text-slate-200">
              <Users className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold">Similar Incidents</h3>
            </div>
            {similarIncidents.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No similar incidents indexed for this pattern yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {similarIncidents.map((si) => (
                  <li
                    key={si.id}
                    className="rounded-xl border border-white/[0.05] bg-surface-850/40 p-3"
                  >
                    <p className="text-sm font-medium text-slate-200">
                      {si.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(si.occurredAt)}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{si.overlap}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-card border border-blue-500/15 bg-blue-500/5 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-400">
              Confidence note
            </h3>
            <p className="mt-2 text-sm text-slate-400">{confidenceNote}</p>
          </div>

          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Limitations
            </h3>
            <p className="mt-2 text-sm text-slate-500">{limitationsNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
