import { BarChart3, RefreshCw } from "lucide-react";
import { useRcaEvaluation } from "@/api/hooks";
import { AccuracyByServiceTable } from "@/components/evaluation/AccuracyByServiceTable";
import { ConfidenceAccuracyPanel } from "@/components/evaluation/ConfidenceAccuracyPanel";
import { EvaluationKpiGrid } from "@/components/evaluation/EvaluationKpiGrid";
import { FeedbackBreakdownChart } from "@/components/evaluation/FeedbackBreakdownChart";
import { FeedbackTrendChart } from "@/components/evaluation/FeedbackTrendChart";
import { TopCandidatesTable } from "@/components/evaluation/TopCandidatesTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

function isEvaluationEmpty(
  data: NonNullable<ReturnType<typeof useRcaEvaluation>["data"]>
): boolean {
  return (
    data.summary.totalInvestigations === 0 &&
    data.summary.totalFeedback === 0 &&
    data.services.services.length === 0 &&
    data.confidence.byLevel.length === 0 &&
    data.trends.feedbackTrend.length === 0
  );
}

export function RcaEvaluation() {
  const { data, loading, error, refetch } = useRcaEvaluation();

  if (loading) {
    return <PageLoading message="Loading RCA evaluation metrics…" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <FeedbackNotice tone="error" title="Could not load RCA evaluation">
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

  if (!data || isEvaluationEmpty(data)) {
    return (
      <div className="space-y-8">
        <header className="relative overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] p-6 sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            RCA Evaluation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Measure RCA quality from reviewer feedback, confidence calibration, and service-level
            accuracy.
          </p>
        </header>
        <EmptyState
          icon={BarChart3}
          title="No evaluation data yet"
          description="Run investigations and collect RCA feedback to populate confirmation rates, accuracy trends, and top candidates."
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

  const { summary, services, confidence, trends } = data;

  return (
    <div className="space-y-10 pb-16">
      <header className="relative overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
              Quality
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              RCA Evaluation
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Reviewer feedback, confidence calibration, and ranked root-cause candidates across
              your investigation portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className={cn(
              "inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      <EvaluationKpiGrid summary={summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <FeedbackBreakdownChart summary={summary} />
        <FeedbackTrendChart trend={trends.feedbackTrend} />
      </div>

      <AccuracyByServiceTable services={services.services} />

      <ConfidenceAccuracyPanel confidence={confidence} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TopCandidatesTable
          title="Most confirmed candidates"
          subtitle="Root causes reviewers validated most often."
          candidates={trends.mostConfirmedCandidates}
          tone="confirm"
        />
        <TopCandidatesTable
          title="Most rejected candidates"
          subtitle="Root causes reviewers flagged as incorrect."
          candidates={trends.mostRejectedCandidates}
          tone="reject"
        />
      </div>
    </div>
  );
}
