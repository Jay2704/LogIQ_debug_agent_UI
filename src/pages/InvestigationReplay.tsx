import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquareWarning, RefreshCw, RotateCcw } from "lucide-react";
import { useInvestigationGraph, useInvestigationReplay } from "@/api/hooks";
import { ReplayPlayer } from "@/components/replay/ReplayPlayer";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

export function InvestigationReplay() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: replay, loading, error, refetch } = useInvestigationReplay(jobId);
  const { data: graph } = useInvestigationGraph(jobId);

  if (!jobId?.trim()) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No job ID"
        description="Open a job from the jobs list to replay its investigation timeline."
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
    return <PageLoading message="Loading investigation replay…" />;
  }

  if (error && !replay) {
    return (
      <div className="space-y-6 pb-16">
        <FeedbackNotice tone="error" title="Could not load investigation replay">
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
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!replay || replay.events.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <EmptyState
          icon={RotateCcw}
          title="No replay events"
          description="This investigation does not have replay steps yet."
          action={
            <Link
              to={`/jobs/${encodeURIComponent(jobId)}`}
              className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Back to job detail
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
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
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400/90">
              Investigation replay
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Replay Workspace
            </h1>
            <p className="mt-2 font-mono text-sm text-slate-400">{jobId}</p>
            <p className="mt-1 text-xs text-slate-500">
              {replay.events.length} chronological events
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.94] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </button>
        </div>
      </header>

      <ReplayPlayer replay={replay} graph={graph} />
    </div>
  );
}
