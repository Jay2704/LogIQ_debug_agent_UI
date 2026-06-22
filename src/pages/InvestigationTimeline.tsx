import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MessageSquareWarning, Network, RefreshCw } from "lucide-react";
import { useInvestigationTimeline } from "@/api/hooks";
import { TimelineWorkspace } from "@/components/timeline/TimelineWorkspace";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

export function InvestigationTimeline() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data, loading, error, refetch } = useInvestigationTimeline(jobId);

  if (!jobId?.trim()) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No job ID"
        description="Open a job from the jobs list to view its investigation timeline."
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
          Loading timeline for <span className="text-slate-400">{jobId}</span>…
        </p>
        <PageLoading message="Loading investigation timeline…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-16">
        <FeedbackNotice tone="error" title="Could not load investigation timeline">
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

  if (!data || data.events.length === 0) {
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
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Investigation timeline
          </h1>
        </header>
        <EmptyState
          icon={Clock}
          title="No timeline events yet"
          description="Events from code changes, deployments, observability, incidents, RCA, and feedback will appear here as the investigation progresses."
          action={
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
              Refresh
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-col gap-4 border-b border-blue-500/[0.12] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Job detail
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Investigation timeline
          </h1>
          <p className="mt-2 font-mono text-sm text-slate-400">{jobId}</p>
          <p className="mt-1 text-xs text-slate-500">{data.events.length} events indexed</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/jobs/${encodeURIComponent(jobId)}/graph`}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/[0.08] px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white"
          >
            <Network className="h-4 w-4" aria-hidden />
            Graph view
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      <TimelineWorkspace timeline={data} />
    </div>
  );
}
