import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bot, Loader2, MessageSquareWarning, Play, RefreshCw } from "lucide-react";
import { useJobDetailData, useMultiAgentInvestigation } from "@/api/hooks";
import { AgentPanel } from "@/components/multi-agent/AgentPanel";
import { InvestigationSummary } from "@/components/multi-agent/InvestigationSummary";
import { EvidenceCoverageCard } from "@/components/investigation/EvidenceCoverageCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn, formatDateTime } from "@/lib/utils";
import { buildEvidenceCoverage } from "@/lib/evidenceCoverage";

export function MultiAgentInvestigation() {
  const { jobId } = useParams<{ jobId: string }>();
  const { bundle } = useJobDetailData(jobId);
  const { data, loading, running, error, refetch, runInvestigation } =
    useMultiAgentInvestigation(jobId);

  const evidenceCoverage = useMemo(() => {
    if (!bundle) return null;
    return buildEvidenceCoverage({
      evidence: bundle.evidence,
      limitationsNote: bundle.limitationsNote,
      confidenceNote: bundle.confidenceNote,
    });
  }, [bundle]);

  if (!jobId?.trim()) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No job ID"
        description="Open a job from the jobs list to run a multi-agent investigation."
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
    return (
      <div className="space-y-4 pb-16">
        <p className="text-center font-mono text-xs text-slate-500">
          Loading multi-agent report for <span className="text-slate-400">{jobId}</span>…
        </p>
        <PageLoading message="Loading multi-agent investigation…" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6 pb-16">
        <FeedbackNotice tone="error" title="Could not load multi-agent investigation">
          <p className="text-red-100/85">{error.message}</p>
        </FeedbackNotice>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to job detail
          </Link>
        </div>
      </div>
    );
  }

  const hasCompletedRun = data?.status === "completed" && Boolean(data.summary);

  return (
    <div className="space-y-8 pb-16">
      <header className="border-b border-blue-500/[0.12] pb-6">
        <Link
          to={`/jobs/${encodeURIComponent(jobId)}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Job detail
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/90">
              Multi-agent workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Multi-Agent Investigation
            </h1>
            <p className="mt-2 font-mono text-xs text-slate-500">{jobId}</p>
            {data?.lastRunAt ? (
              <p className="mt-2 text-sm text-slate-400">
                Last run · {formatDateTime(data.lastRunAt)}
              </p>
            ) : null}
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <Bot className="h-6 w-6 text-cyan-300" aria-hidden />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={running}
            onClick={() => void runInvestigation()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35 disabled:cursor-not-allowed disabled:opacity-60",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {running ? "Running investigation…" : "Run Multi-Agent Investigation"}
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.94] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      {error ? (
        <FeedbackNotice tone="warning" title="Multi-agent investigation issue">
          <p className="text-amber-100/90">{error.message}</p>
        </FeedbackNotice>
      ) : null}

      {running ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Specialist agents are analyzing timeline, deploy, infra, incident, knowledge, and RCA signals…
        </p>
      ) : null}

      {data?.summary ? <InvestigationSummary summary={data.summary} /> : null}

      {evidenceCoverage ? <EvidenceCoverageCard coverage={evidenceCoverage} /> : null}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Agent findings
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {data?.agents.map((panel) => (
            <AgentPanel key={panel.agentId} panel={panel} />
          ))}
        </div>
      </div>

      {!hasCompletedRun && !running ? (
        <p className="text-center text-sm text-slate-500">
          Run the multi-agent investigation to populate agent panels and generate the final summary.
        </p>
      ) : null}
    </div>
  );
}
