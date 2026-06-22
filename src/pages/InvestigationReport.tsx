import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquareWarning, RotateCcw } from "lucide-react";
import { useInvestigationReport } from "@/api/hooks";
import { ExportActions } from "@/components/report/ExportActions";
import { ReportSection } from "@/components/report/ReportSection";
import { ReportSummary } from "@/components/report/ReportSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import {
  confidenceTierBadgeClassName,
  interpretConfidence,
} from "@/lib/rcaConfidence";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn, formatDateTime } from "@/lib/utils";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

export function InvestigationReport() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data, loading, refreshing, error, refetch, refreshReport } =
    useInvestigationReport(jobId);

  if (!jobId?.trim()) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No job ID"
        description="Open a job from the jobs list to view its investigation report."
        action={
          <Link
            to="/jobs"
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to jobs
          </Link>
        }
      />
    );
  }

  if (loading) {
    return <PageLoading message="Loading investigation report…" />;
  }

  if (error && !data) {
    return (
      <div className="space-y-6 pb-16">
        <FeedbackNotice tone="error" title="Could not load investigation report">
          <p className="text-red-100/85">{error.message}</p>
        </FeedbackNotice>
        <button
          type="button"
          onClick={() => refetch()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="Report unavailable"
        description="No report data was returned for this investigation."
        action={
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to job detail
          </Link>
        }
      />
    );
  }

  const confidenceTier = interpretConfidence(data.confidence);

  return (
    <div className="space-y-6 pb-16">
      <Link
        to={`/jobs/${encodeURIComponent(jobId)}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Job detail
      </Link>

      <ReportSummary report={data} />

      <Link
        to={`/jobs/${encodeURIComponent(jobId)}/replay`}
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400/45 hover:bg-emerald-500/15 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Replay
      </Link>

      <ExportActions
        report={data}
        refreshing={refreshing}
        onRefresh={() => void refreshReport()}
      />

      {error ? (
        <FeedbackNotice tone="warning" title="Report refresh issue">
          <p className="text-amber-100/90">{error.message}</p>
        </FeedbackNotice>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <ReportSection title="Timeline summary">
          <p className="text-sm leading-relaxed text-slate-300">{data.timelineSummary}</p>
        </ReportSection>

        <ReportSection title="Root cause">
          <p className="font-mono text-sm text-sky-300/95">{data.rootCause}</p>
        </ReportSection>

        <ReportSection title="Confidence">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl font-bold tabular-nums text-white">
              {formatConfidence(data.confidence)}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                confidenceTierBadgeClassName[confidenceTier.tier]
              )}
            >
              {confidenceTier.label}
            </span>
          </div>
          {data.confidenceNote ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{data.confidenceNote}</p>
          ) : null}
        </ReportSection>

        <ReportSection title="Similar incidents">
          {data.similarIncidents.length === 0 ? (
            <p className="text-sm text-slate-500">No similar incidents linked.</p>
          ) : (
            <ul className="space-y-3">
              {data.similarIncidents.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-white/[0.06] bg-black/[0.72] p-3"
                >
                  <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.service} · {item.overlap}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ReportSection>

        <ReportSection title="Feedback history">
          {data.feedbackHistory.length === 0 ? (
            <p className="text-sm text-slate-500">No reviewer feedback recorded.</p>
          ) : (
            <ul className="space-y-3">
              {data.feedbackHistory.map((entry, index) => (
                <li
                  key={`${entry.submittedAt}-${index}`}
                  className="rounded-xl border border-white/[0.06] bg-black/[0.72] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold capitalize text-slate-200">
                      {entry.action}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {formatDateTime(entry.submittedAt)}
                    </span>
                  </div>
                  {entry.submittedBy ? (
                    <p className="mt-1 text-xs text-slate-500">by {entry.submittedBy}</p>
                  ) : null}
                  {entry.comment ? (
                    <p className="mt-2 text-sm text-slate-400">{entry.comment}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </ReportSection>

        <ReportSection title="Multi-agent findings">
          {data.multiAgentFindings.length === 0 ? (
            <p className="text-sm text-slate-500">
              Run the multi-agent investigation to include specialist findings.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.multiAgentFindings.map((finding, index) => (
                <li
                  key={`${finding.agent}-${index}`}
                  className="rounded-xl border border-white/[0.06] bg-black/[0.72] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-cyan-200">{finding.agent}</p>
                    <span className="text-xs font-semibold tabular-nums text-slate-400">
                      {formatConfidence(finding.confidence)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {finding.summary}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ReportSection>

        <ReportSection title="Runbooks">
          <ul className="space-y-3">
            {data.runbooks.map((book) => (
              <li
                key={book.id}
                className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3"
              >
                <p className="font-mono text-xs text-emerald-300/90">{book.id}</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">{book.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{book.summary}</p>
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Recommended actions" className="xl:col-span-2">
          <ul className="space-y-2">
            {data.recommendedActions.map((action) => (
              <li
                key={action}
                className="flex gap-2 rounded-lg border border-white/[0.08] bg-black/[0.55] px-3 py-2.5 text-sm text-slate-300"
              >
                <span className="text-indigo-400" aria-hidden>
                  •
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </ReportSection>
      </div>
    </div>
  );
}
