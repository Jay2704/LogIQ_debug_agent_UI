import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  GitBranch,
  MessageSquareWarning,
} from "lucide-react";
import { RcaResultCard } from "@/components/ui/RcaResultCard";
import { StepProgressBar } from "@/components/ui/StepProgressBar";
import { ExplanationPanel } from "@/components/ui/ExplanationPanel";
import { EvidenceList } from "@/components/ui/EvidenceList";
import { StatusBadge, SeverityBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { RemediationChecklist } from "@/components/job/RemediationChecklist";
import { SimilarIncidentsPanel } from "@/components/job/SimilarIncidentsPanel";
import { JobReportSummaryCard } from "@/components/job/JobReportSummaryCard";
import { getJobDetailBundle, getReportByAnomalyId } from "@/data/mock";
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
  const report = bundle
    ? getReportByAnomalyId(bundle.job.anomalyId)
    : undefined;

  if (!bundle) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Job not found"
        description="No mock job matches this ID. Open Jobs and pick a job from the table."
        action={
          <Link
            to="/jobs"
            className="rounded-xl bg-cta-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cta ring-1 ring-sky-400/30 hover:bg-cta-primary-hover"
          >
            Back to jobs
          </Link>
        }
      />
    );
  }

  const {
    job,
    anomaly,
    rca,
    explanation,
    evidence,
    remediation,
    similarIncidents,
    confidenceNote,
    limitationsNote,
  } = bundle;

  return (
    <div className="space-y-8">
      {/* Workspace header */}
      <header className="flex flex-col gap-4 border-b border-blue-500/[0.1] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            All jobs
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {job.id}
            </h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Investigation workspace · linked{" "}
            <span className="font-mono text-violet-400">{job.anomalyId}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.service ? (
              <span className="rounded-lg border border-blue-500/15 bg-surface-900/80 px-2.5 py-1 font-mono text-xs text-slate-300">
                {job.service}
              </span>
            ) : null}
            <span className="rounded-lg border border-white/[0.08] bg-surface-900/60 px-2.5 py-1 text-xs text-slate-400">
              Trigger · {triggerLabels[job.trigger]}
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-surface-900/60 px-2.5 py-1 font-mono text-xs text-slate-500">
              {formatDateTime(job.createdAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Pipeline — full width */}
      <section className="rounded-card border border-blue-500/15 bg-surface-975/90 p-5 shadow-card md:p-6">
        <StepProgressBar stepState={rca.steps} />
      </section>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Primary column — deterministic + evidence + context */}
        <div className="space-y-8 lg:col-span-8">
          <section aria-labelledby="rca-heading">
            <h2 id="rca-heading" className="sr-only">
              Deterministic root cause
            </h2>
            <RcaResultCard rca={rca} />
          </section>

          <section>
            <EvidenceList items={evidence} />
          </section>

          <section className="rounded-card border border-white/[0.08] bg-surface-975/80 p-5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-white">Anomaly context</h2>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={anomaly.severity} />
                <span className="font-mono text-[11px] text-slate-500">
                  {anomaly.signalType}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {anomaly.summary}
            </p>
            <p className="mt-3 font-mono text-[11px] text-slate-600">
              detected_at {formatDateTime(anomaly.detectedAt)}
            </p>
          </section>
        </div>

        {/* Secondary column — metadata + assistive + follow-ups */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="ui-card p-5 shadow-card">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Job metadata
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex items-start gap-2 rounded-lg border border-blue-500/[0.08] bg-surface-975/50 px-3 py-2">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    Created
                  </dt>
                  <dd className="font-mono text-xs text-slate-300">
                    {formatDateTime(job.createdAt)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-blue-500/[0.08] bg-surface-975/50 px-3 py-2">
                <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    Trigger source
                  </dt>
                  <dd className="text-sm text-slate-300">
                    {triggerLabels[job.trigger]}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <ExplanationPanel content={explanation} />

          <RemediationChecklist steps={remediation} />

          <SimilarIncidentsPanel incidents={similarIncidents} />

          <JobReportSummaryCard report={report} anomalyId={job.anomalyId} />

          <div className="rounded-card border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.08] to-surface-975 p-4 shadow-inner">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400/90">
              Confidence note
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {confidenceNote}
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-slate-700/60 bg-surface-975/40 p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Limitations
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {limitationsNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
