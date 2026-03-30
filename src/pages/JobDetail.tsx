import { useState } from "react";
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
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusBadge, SeverityBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { RemediationChecklist } from "@/components/job/RemediationChecklist";
import { SimilarIncidentsPanel } from "@/components/job/SimilarIncidentsPanel";
import { JobReportSummaryCard } from "@/components/job/JobReportSummaryCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { useJobDetailData } from "@/api/hooks";
import { formatDateTime } from "@/lib/utils";

const triggerLabels = {
  alert: "Alert",
  manual: "Manual",
  scheduled: "Scheduled",
  api: "API",
  webhook: "Webhook",
} as const;

const DETAIL_TABS = [
  { value: "rca" as const, label: "RCA" },
  { value: "explanation" as const, label: "Explanation" },
  { value: "evidence" as const, label: "Evidence" },
  { value: "report" as const, label: "Report" },
];

type DetailTab = (typeof DETAIL_TABS)[number]["value"];

export function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const { bundle, report, loading, error } = useJobDetailData(jobId);
  const [tab, setTab] = useState<DetailTab>("rca");

  if (loading) {
    return <PageLoading message="Loading investigation…" />;
  }

  if (error) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Could not load job"
        description={error.message}
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

  if (!bundle) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Job not found"
        description="No job matches this ID. Open Jobs and pick a job from the table."
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
    <div className="space-y-8 pb-16">
      {/* Workspace header — compact; hero is RCA below */}
      <header className="flex flex-col gap-4 border-b border-blue-500/[0.12] pb-6 lg:flex-row lg:items-start lg:justify-between">
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
            <StatusBadge status={job.status} variant="workflow" />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Investigation workspace ·{" "}
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
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <div className="rounded-xl border border-white/[0.08] bg-surface-975/80 px-4 py-3 text-right shadow-inner">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
              Pipeline
            </p>
            <p className="mt-1 font-mono text-xs text-slate-400">
              RCA = deterministic · Explanation = assistive
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-blue-500/15 bg-surface-975/90 p-4 shadow-card md:p-5">
        <StepProgressBar stepState={rca.steps} />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Investigation workspace
        </p>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={DETAIL_TABS}
          label="Investigation sections"
          className="max-w-none sm:max-w-xl"
        />
      </div>

      <div role="tabpanel" aria-label={DETAIL_TABS.find((t) => t.value === tab)?.label}>
        {tab === "rca" ? (
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400/95">
                Deterministic layer
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Deterministic Root Cause
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-slate-500">
                The ranked file anchor below is the auditable source of truth — derived
                from traces, deploy graphs, and code correlation. AI narrative never
                replaces this binding.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-12 xl:items-start xl:gap-10">
              <div className="space-y-0 xl:col-span-8">
                <RcaResultCard rca={rca} showHeading={false} />
              </div>
              <aside className="space-y-4 xl:col-span-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                  Compared side-by-side
                </p>
                <ExplanationPanel
                  content={explanation}
                  variant="emphasis"
                  className="xl:sticky xl:top-4 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"
                />
              </aside>
            </div>
          </div>
        ) : null}

        {tab === "explanation" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                Assistive layer
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                AI Explanation
              </h2>
              <p className="max-w-2xl text-sm text-slate-500">
                Read the full narrative without the deterministic RCA card — useful
                for handoff and exec summaries.
              </p>
            </div>
            <ExplanationPanel content={explanation} variant="emphasis" />
          </div>
        ) : null}

        {tab === "evidence" ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400/90">
                Grounding
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Evidence</h2>
              <p className="max-w-2xl text-sm text-slate-500">
                Artifacts that support the ranked root cause and feed the confidence
                score.
              </p>
            </div>
            <EvidenceList items={evidence} />
            <section className="rounded-2xl border border-white/[0.08] bg-surface-975/80 p-6 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Anomaly context</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={anomaly.severity} />
                  <span className="font-mono text-[11px] text-slate-500">
                    {anomaly.signalType}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {anomaly.summary}
              </p>
              <p className="mt-4 font-mono text-[11px] text-slate-600">
                detected_at {formatDateTime(anomaly.detectedAt)}
              </p>
            </section>
          </div>
        ) : null}

        {tab === "report" ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400/90">
                Outputs
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Report & follow-up
              </h2>
              <p className="max-w-2xl text-sm text-slate-500">
                Exportable summary, remediation tracking, and historical similar
                incidents.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <JobReportSummaryCard report={report} anomalyId={job.anomalyId} />
                <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.06] to-surface-975 p-6 shadow-inner">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400/90">
                    Confidence note
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {confidenceNote}
                  </p>
                </div>
              </div>
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-2xl border border-white/[0.08] bg-surface-975/60 p-5 shadow-inner">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Job metadata
                  </h3>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-start gap-2 rounded-xl border border-blue-500/[0.08] bg-surface-975/50 px-3 py-2.5">
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
                    <div className="flex items-start gap-2 rounded-xl border border-blue-500/[0.08] bg-surface-975/50 px-3 py-2.5">
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
                <RemediationChecklist steps={remediation} />
              </div>
            </div>

            <SimilarIncidentsPanel incidents={similarIncidents} />

            <div className="rounded-2xl border border-dashed border-slate-700/60 bg-surface-975/40 p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                Limitations
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {limitationsNote}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
