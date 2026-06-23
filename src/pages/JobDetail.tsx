import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CalendarClock,
  FileText,
  GitBranch,
  Loader2,
  MessageSquareWarning,
  Network,
  Play,
  RefreshCw,
  Route,
  Search,
  Sparkles,
  Clock,
} from "lucide-react";
import { RcaResultCard } from "@/components/ui/RcaResultCard";
import { StepProgressBar } from "@/components/ui/StepProgressBar";
import { ExplanationPanel } from "@/components/ui/ExplanationPanel";
import { EvidenceList } from "@/components/ui/EvidenceList";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusBadge, SeverityBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvestigationProgressBanner } from "@/components/job/InvestigationProgressBanner";
import { RemediationChecklist } from "@/components/job/RemediationChecklist";
import { SimilarIncidentsPanel } from "@/components/job/SimilarIncidentsPanel";
import { SimilarIncidentList } from "@/components/similar-incidents/SimilarIncidentList";
import { EvidenceCoverageCard } from "@/components/investigation/EvidenceCoverageCard";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { FeedbackHistory } from "@/components/feedback/FeedbackHistory";
import { JobReportSummaryCard } from "@/components/job/JobReportSummaryCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import {
  useJobDetailData,
  useRcaInvestigation,
  useRcaFeedback,
  useSimilarIncidents,
  type InvestigationPhase,
} from "@/api/hooks";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { useCurrentUser } from "@/auth";
import { getJobRouteId } from "@/lib/jobRoute";
import {
  getRunInvestigationDisabledTitle,
  useRoleUiCapabilities,
} from "@/lib/roleUiCapabilities";
import { cn, formatDateTime } from "@/lib/utils";
import { buildEvidenceCoverage } from "@/lib/evidenceCoverage";

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
  const location = useLocation();
  const navigate = useNavigate();
  const {
    bundle,
    report,
    loading,
    error,
    jobRowSource,
    notFoundReason,
    refetch,
  } = useJobDetailData(jobId);
  const [tab, setTab] = useState<DetailTab>("rca");
  const [showCreatedBanner, setShowCreatedBanner] = useState(() => {
    const s = location.state as { fromCreate?: boolean } | undefined;
    return Boolean(s?.fromCreate);
  });

  useEffect(() => {
    const s = location.state as { fromCreate?: boolean } | undefined;
    if (s?.fromCreate) {
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const createdBannerEl = showCreatedBanner ? (
    <FeedbackNotice
      tone="success"
      title="Job created"
      onDismiss={() => setShowCreatedBanner(false)}
    >
      Opening your workspace — if it’s still empty, the backend may still be indexing this
      job.
    </FeedbackNotice>
  ) : null;

  const jobForRoute = bundle?.job;
  const routeJobIdForInv = jobForRoute ? getJobRouteId(jobForRoute) : "";
  const anomalyIdForInv = jobForRoute?.anomalyId ?? "";

  const {
    phase: investigationPhase,
    runInvestigation,
    liveRca,
    liveExplanation,
    error: investigationError,
    warning: investigationWarning,
    successMessage: investigationSuccess,
    progressLabel,
    progressStepIndex,
    clearSuccess,
    clearWarning,
    getPipelineSteps,
  } = useRcaInvestigation(routeJobIdForInv, anomalyIdForInv);

  const {
    data: similarHistoricalIncidents,
    loading: similarHistoricalLoading,
    error: similarHistoricalError,
    refetch: refetchSimilarHistorical,
  } = useSimilarIncidents(jobId);

  const {
    summary: rcaFeedbackSummary,
    loading: rcaFeedbackLoading,
    submitting: rcaFeedbackSubmitting,
    error: rcaFeedbackError,
    submit: submitRcaFeedback,
  } = useRcaFeedback(jobId);

  const evidenceCoverage = useMemo(() => {
    if (!bundle) return null;
    return buildEvidenceCoverage({
      evidence: bundle.evidence,
      limitationsNote: bundle.limitationsNote,
      confidenceNote: bundle.confidenceNote,
    });
  }, [bundle]);

  const roleCaps = useRoleUiCapabilities();
  const { user: sessionUser } = useCurrentUser();

  const prevInvestigationPhase = useRef<InvestigationPhase | null>(null);

  useEffect(() => {
    prevInvestigationPhase.current = null;
  }, [routeJobIdForInv, anomalyIdForInv]);

  useEffect(() => {
    if (
      prevInvestigationPhase.current === "fetching" &&
      investigationPhase === "ready"
    ) {
      refetch({ silent: true });
    }
    prevInvestigationPhase.current = investigationPhase;
  }, [investigationPhase, refetch]);

  if (loading) {
    return (
      <div className="space-y-4 pb-16">
        {createdBannerEl}
        {jobId?.trim() ? (
          <p className="text-center font-mono text-xs text-slate-500">
            Loading job{" "}
            <span className="text-slate-400">{jobId}</span>
            …
          </p>
        ) : null}
        <PageLoading message="Loading investigation…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-16">
        {createdBannerEl}
        <FeedbackNotice tone="error" title="Could not load job">
          <p className="text-red-100/85">{error.message}</p>
          <p className="mt-2 text-xs text-red-200/70">
            Check that the API is reachable and the job id is correct.
          </p>
        </FeedbackNotice>
        <EmptyState
          icon={MessageSquareWarning}
          title="Job unavailable"
          description="The job detail request failed. You can retry or return to the list."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                  ctaButtonGradient,
                  ctaGlowBlueOnly
                )}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Refresh job
              </button>
              <Link
                to="/jobs"
                className="rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white"
              >
                Back to jobs
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  if (!bundle) {
    const isMissingParam = notFoundReason === "missing_job_id";
    const isUnknownJob = notFoundReason === "unknown_job";
    const syncLikely = isUnknownJob && showCreatedBanner;

    const title = isMissingParam
      ? "No job ID in this link"
      : syncLikely
        ? "Job detail isn’t ready yet"
        : "No job for this id";

    const description = isMissingParam
      ? "Use a URL like /jobs/your_job_id — open a row from Debug jobs or paste a valid id."
      : syncLikely
        ? "Right after create, GET /jobs/:id can lag behind the list. Reload this page, refresh the jobs list, or open the job from the table so the URL matches the backend job_id."
        : "The API returned no job for this id. It may be wrong, stale, or removed. Confirm the id matches the Jobs list (canonical job_id), or try again if the backend was still indexing.";

    return (
      <div className="space-y-6 pb-16">
        {createdBannerEl}
        {jobId?.trim() ? (
          <p className="text-center font-mono text-xs text-slate-500">
            Requested id:{" "}
            <span className="text-slate-400">{jobId}</span>
          </p>
        ) : null}
        <EmptyState
          icon={MessageSquareWarning}
          title={title}
          description={description}
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isMissingParam ? (
                <>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                      ctaButtonGradient,
                      ctaGlowBlueOnly
                    )}
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden />
                    Refresh job
                  </button>
                  <Link
                    to="/jobs"
                    state={{ refreshJobs: true }}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/[0.08] px-5 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-400/45 hover:text-white"
                    )}
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden />
                    Refresh jobs
                  </Link>
                </>
              ) : null}
              <Link
                to="/jobs"
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.94] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white"
                )}
              >
                Back to jobs
              </Link>
            </div>
          }
        />
      </div>
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

  const routeJobId = getJobRouteId(job);

  const investigationIdsMissing =
    !routeJobId?.trim() || !job.anomalyId?.trim();

  const displayRca =
    liveRca !== undefined
      ? liveRca === null
        ? null
        : liveRca
      : rca;

  const pipelineSteps = getPipelineSteps(rca.steps);

  const triggerDisplay =
    job.triggerSource ?? triggerLabels[job.trigger];

  const runBusy =
    investigationPhase === "running" || investigationPhase === "fetching";
  const runDisabled =
    runBusy ||
    investigationIdsMissing ||
    !roleCaps.canRunInvestigationPipeline;

  return (
    <div className="space-y-8 pb-16">
      {createdBannerEl}
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
              {routeJobId}
            </h1>
            <StatusBadge status={job.status} variant="workflow" />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Investigation workspace ·{" "}
            <span className="font-mono text-violet-400">{job.anomalyId}</span>
          </p>
          {job.userSummary ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              {job.userSummary}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {job.service ? (
              <span className="rounded-lg border border-blue-500/15 bg-black/[0.82] px-2.5 py-1 font-mono text-xs text-slate-300">
                {job.service}
              </span>
            ) : null}
            <span className="rounded-lg border border-white/[0.08] bg-black/[0.82] px-2.5 py-1 text-xs text-slate-400">
              Trigger · {triggerDisplay}
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/[0.82] px-2.5 py-1 font-mono text-xs text-slate-500">
              {formatDateTime(job.createdAt)}
            </span>
            {job.triggeredByUserId ? (
              <span
                className="rounded-lg border border-white/[0.08] bg-black/[0.82] px-2.5 py-1 font-mono text-xs text-slate-400"
                title="triggered_by_user_id"
              >
                User · {job.triggeredByUserId}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            to={`/jobs/${encodeURIComponent(routeJobId)}/report`}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-indigo-500/30 bg-indigo-500/[0.08] px-4 py-2.5 text-sm font-semibold text-indigo-200 transition hover:border-indigo-400/45 hover:bg-indigo-500/15 hover:text-white"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Report
          </Link>
          <Link
            to={`/jobs/${encodeURIComponent(routeJobId)}/multi-agent`}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-cyan-500/30 bg-cyan-500/[0.08] px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/45 hover:bg-cyan-500/15 hover:text-white"
          >
            <Bot className="h-4 w-4" aria-hidden />
            Multi-agent
          </Link>
          <Link
            to={`/jobs/${encodeURIComponent(routeJobId)}/timeline`}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-violet-500/30 bg-violet-500/[0.08] px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-400/45 hover:bg-violet-500/15 hover:text-white"
          >
            <Clock className="h-4 w-4" aria-hidden />
            Timeline
          </Link>
          <Link
            to={`/jobs/${encodeURIComponent(routeJobId)}/graph`}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-sky-500/30 bg-sky-500/[0.08] px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white"
          >
            <Network className="h-4 w-4" aria-hidden />
            Graph view
          </Link>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-3 text-right shadow-inner ring-1 ring-inset ring-violet-400/10">
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-300/90">
              Architecture
            </p>
            <p className="mt-1 max-w-[16rem] font-mono text-[11px] leading-snug text-slate-400">
              Deterministic RCA (source of truth) · AI explanation (assistive layer)
            </p>
          </div>
        </div>
      </header>

      {jobRowSource === "api" ? (
        <div
          className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-100/90"
          role="status"
        >
          <span className="font-semibold text-amber-200/95">Live job data</span>
          {" — "}
          Job id, anomaly id, status, timestamps, and trigger fields above come from the API.
          Similar incidents, remediation, and some report content may still use mock or
          placeholder data until those endpoints are available.
        </div>
      ) : null}

      <section className="rounded-2xl border border-blue-500/15 bg-gradient-to-br from-black/[0.94] to-black/[0.85] p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400/90">
              Pipeline control
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Run the RCA pipeline, then fetch ranked deterministic RCA and the assistive
              narrative. The ranked file path always wins over LLM text.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runInvestigation()}
              disabled={runDisabled}
              aria-busy={runBusy}
              title={
                investigationIdsMissing
                  ? "Job or anomaly ID is missing — reload this job from the list."
                  : !roleCaps.canRunInvestigationPipeline
                    ? getRunInvestigationDisabledTitle(sessionUser)
                    : runBusy
                      ? progressLabel || "Investigation in progress…"
                      : undefined
              }
              className={cn(
                "inline-flex max-w-[min(100%,20rem)] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
                "ring-1 ring-blue-400/35 transition-all duration-200",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                runBusy && "ring-2 ring-sky-400/25 ring-offset-2 ring-offset-surface-975",
                runDisabled && "pointer-events-none cursor-not-allowed opacity-60"
              )}
            >
              {runBusy ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              ) : (
                <Play className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              )}
              <span className="truncate">
                {runBusy
                  ? progressLabel || "Working…"
                  : "Run investigation"}
              </span>
            </button>
          </div>
        </div>

        {!runBusy &&
        !investigationIdsMissing &&
        !roleCaps.canRunInvestigationPipeline ? (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {!sessionUser?.userId?.trim() ? (
              <>
                <Link
                  to="/login"
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Login
                </Link>{" "}
                with a tester, support, developer, or SRE account to run investigations from
                this UI (guests cannot — prototype rule only).
              </>
            ) : (
              <>
                Read-only for viewer: pipeline runs require tester, support, developer, or SRE
                (UI hint — not enforced by the API).
              </>
            )}
          </p>
        ) : null}

        {runBusy ? (
          <div className="mt-4">
            <InvestigationProgressBanner
              label={progressLabel}
              activeStepIndex={progressStepIndex}
            />
          </div>
        ) : null}

        {investigationWarning ? (
          <div className="mt-4">
            <FeedbackNotice
              tone="warning"
              title="Investigation completed with warnings"
              onDismiss={() => {
                clearWarning();
                if (investigationSuccess) clearSuccess();
              }}
            >
              <p className="text-amber-100/90">{investigationWarning}</p>
              {investigationSuccess ? (
                <p className="mt-3 text-sm text-amber-200/75">{investigationSuccess}</p>
              ) : null}
            </FeedbackNotice>
          </div>
        ) : investigationSuccess ? (
          <div className="mt-4">
            <FeedbackNotice
              tone="success"
              title="Investigation completed"
              onDismiss={clearSuccess}
            >
              {investigationSuccess}
            </FeedbackNotice>
          </div>
        ) : null}

        {investigationPhase === "error" && investigationError ? (
          <div className="mt-4">
            <FeedbackNotice tone="error" title="Investigation failed">
              <p className="text-red-100/90">{investigationError}</p>
              <p className="mt-3 text-xs leading-relaxed text-red-200/75">
                Check your connection, then verify this job and anomaly id. If it keeps
                failing, confirm the RCA services are reachable from the
                browser.
              </p>
            </FeedbackNotice>
          </div>
        ) : null}

        {investigationIdsMissing ? (
          <div
            className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/90"
            role="status"
          >
            Job or anomaly ID is missing from this record — open the job from the Jobs
            list or verify the URL includes a valid job id.
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-blue-500/15 bg-black/[0.94] p-4 shadow-card md:p-5">
        <StepProgressBar stepState={pipelineSteps} />
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Investigation workspace
          </p>
          <p className="mt-1 text-xs text-slate-600">
            <span className="text-slate-500">Source of truth:</span> deterministic RCA ·{" "}
            <span className="text-slate-500">Assistive:</span> AI explanation.
          </p>
        </div>
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
          <div className="space-y-8">
            <h2 className="sr-only">Deterministic root cause and assistive explanation</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              <span className="rounded-md border border-violet-500/25 bg-violet-500/[0.08] px-2 py-0.5 font-semibold text-violet-200/95">
                Deterministic Root Cause (Source of Truth)
              </span>{" "}
              is the ranked path and score.{" "}
              <span className="rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-2 py-0.5 font-semibold text-amber-200/90">
                AI Explanation (Assistive Layer)
              </span>{" "}
              is secondary narrative — never overrides the binding.
            </p>

            <div className="hidden xl:grid xl:grid-cols-12 xl:gap-10 xl:pb-1">
              <div className="xl:col-span-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300/90">
                  Deterministic RCA · Source of Truth
                </p>
              </div>
              <div className="xl:col-span-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-500/75">
                  Assistive · AI explanation
                </p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-12 xl:items-start xl:gap-10">
              <div className="space-y-0 xl:col-span-8">
                <div className="mb-4 flex items-center gap-2 lg:hidden">
                  <Sparkles className="h-4 w-4 text-amber-400/80" aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Assistive layer follows below (mobile stack)
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-[1.35rem] p-[1px]",
                    displayRca
                      ? "bg-gradient-to-br from-violet-500/45 via-violet-500/15 to-sky-500/10 shadow-[0_0_80px_-24px_rgba(139,92,246,0.45),0_24px_64px_-32px_rgba(0,0,0,0.55)]"
                      : "bg-gradient-to-br from-slate-700/20 to-transparent"
                  )}
                >
                  <div className="rounded-[1.25rem] bg-black/[0.94] backdrop-blur-[2px]">
                    {runBusy ? (
                      <div className="min-h-[min(28rem,70vh)] animate-investigation-reveal rounded-[1.25rem] border border-violet-500/25 bg-slate-950/40 p-6 shadow-inner ring-1 ring-inset ring-violet-500/15">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-300/90">
                          Deterministic RCA
                        </p>
                        <p className="mt-2 text-sm text-slate-400">{progressLabel}</p>
                        <div className="mt-6 space-y-3">
                          <div className="h-3 w-11/12 max-w-md animate-pulse rounded bg-violet-500/15" />
                          <div className="h-3 w-full max-w-lg animate-pulse rounded bg-slate-800/70" />
                          <div className="h-3 w-10/12 max-w-md animate-pulse rounded bg-slate-800/60" />
                          <div className="mt-8 h-24 animate-pulse rounded-xl bg-slate-900/80" />
                        </div>
                      </div>
                    ) : displayRca === null ? (
                      <div
                        className={cn(
                          "rounded-[1.25rem] border border-amber-500/35 bg-gradient-to-br from-amber-500/[0.1] via-black/[0.96] to-black/[0.96] p-8 shadow-inner ring-1 ring-inset ring-amber-500/15",
                          investigationPhase === "ready" &&
                            liveRca !== undefined &&
                            "animate-investigation-reveal"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/[0.12] shadow-[0_0_32px_-12px_rgba(245,158,11,0.35)]">
                            <Route
                              className="h-7 w-7 text-amber-200/95"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200/85">
                              Deterministic layer · no binding path
                            </p>
                            <h3 className="mt-2 text-xl font-bold tracking-tight text-amber-50">
                              No deterministic candidate returned
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-amber-100/88">
                              The RCA API did not produce a ranked primary path for this
                              anomaly (empty or ineligible candidate set). This is a valid
                              outcome — the workspace is not broken. The assistive panel may
                              still hold narrative context; it is not a substitute for a
                              ranked file anchor.
                            </p>
                            <ul className="mt-5 space-y-2 text-sm text-amber-100/75">
                              <li className="flex gap-2">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                                Confirm the anomaly id matches ingested signals.
                              </li>
                              <li className="flex gap-2">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                                Re-run after the RCA pipeline completes new correlation.
                              </li>
                              <li className="flex gap-2">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                                <span>
                                  Inspect{" "}
                                  <span className="font-mono text-[12px] text-amber-200/90">
                                    GET /api/v1/rca/results
                                  </span>{" "}
                                  for raw payload shape.
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : displayRca ? (
                      <div
                        className={cn(
                          investigationPhase === "ready" &&
                            liveRca !== undefined &&
                            "animate-investigation-reveal"
                        )}
                      >
                        <RcaResultCard rca={displayRca} showHeading={false} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <aside className="space-y-3 xl:col-span-4">
                {runBusy ? (
                  <div className="min-h-[20rem] animate-investigation-reveal rounded-2xl border border-amber-500/25 bg-slate-950/35 p-6 shadow-inner ring-1 ring-inset ring-amber-500/15">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-400/90">
                      AI explanation
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{progressLabel}</p>
                    <div className="mt-6 space-y-3">
                      <div className="h-3 w-full animate-pulse rounded bg-amber-500/10" />
                      <div className="h-3 w-11/12 animate-pulse rounded bg-slate-800/70" />
                      <div className="h-3 w-11/12 animate-pulse rounded bg-slate-800/60" />
                      <div className="h-3 w-9/12 animate-pulse rounded bg-slate-800/50" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      investigationPhase === "ready" &&
                        liveExplanation !== undefined &&
                        "animate-investigation-reveal"
                    )}
                  >
                    <ExplanationPanel
                      structured={
                        liveExplanation !== undefined ? liveExplanation : undefined
                      }
                      content={explanation}
                      variant="emphasis"
                      className="xl:sticky xl:top-4 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"
                    />
                  </div>
                )}
              </aside>
            </div>

            <div className="space-y-4">
              <FeedbackPanel
                summary={rcaFeedbackSummary}
                loading={rcaFeedbackLoading}
                submitting={rcaFeedbackSubmitting}
                error={rcaFeedbackError?.message ?? null}
                onSubmit={submitRcaFeedback}
              />
              <FeedbackHistory
                history={rcaFeedbackSummary?.history ?? []}
                loading={rcaFeedbackLoading}
              />
            </div>
          </div>
        ) : null}

        {tab === "explanation" ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                Assistive layer
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Full narrative
              </h2>
              <p className="max-w-2xl text-sm text-slate-500">
                Full-width view for handoff — switch to the RCA tab to compare with the
                deterministic ranked path and confidence.
              </p>
            </div>
            {runBusy ? (
              <div className="min-h-[18rem] animate-investigation-reveal rounded-2xl border border-amber-500/25 bg-slate-950/35 p-6 shadow-inner ring-1 ring-inset ring-amber-500/15">
                <p className="text-sm text-slate-500">{progressLabel}</p>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-full animate-pulse rounded bg-amber-500/10" />
                  <div className="h-3 w-11/12 animate-pulse rounded bg-slate-800/70" />
                  <div className="h-3 w-10/12 animate-pulse rounded bg-slate-800/60" />
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  investigationPhase === "ready" &&
                    liveExplanation !== undefined &&
                    "animate-investigation-reveal"
                )}
              >
                <ExplanationPanel
                  structured={
                    liveExplanation !== undefined ? liveExplanation : undefined
                  }
                  content={explanation}
                  variant="emphasis"
                />
              </div>
            )}
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
            <section className="rounded-2xl border border-white/[0.08] bg-black/[0.94] p-6 shadow-inner">
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
                {evidenceCoverage ? (
                  <EvidenceCoverageCard coverage={evidenceCoverage} />
                ) : null}
                <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.06] to-black/[0.96] p-6 shadow-inner">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400/90">
                    Confidence note
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {confidenceNote}
                  </p>
                </div>
              </div>
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-2xl border border-white/[0.08] bg-black/[0.94] p-5 shadow-inner">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Job metadata
                  </h3>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-start gap-2 rounded-xl border border-blue-500/[0.08] bg-black/[0.94] px-3 py-2.5">
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
                    <div className="flex items-start gap-2 rounded-xl border border-blue-500/[0.08] bg-black/[0.94] px-3 py-2.5">
                      <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          Trigger source
                        </dt>
                        <dd className="text-sm text-slate-300">
                          {triggerDisplay}
                        </dd>
                      </div>
                    </div>
                    {job.triggeredByUserId ? (
                      <div className="flex items-start gap-2 rounded-xl border border-blue-500/[0.08] bg-black/[0.94] px-3 py-2.5">
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                            Triggered by user
                          </dt>
                          <dd className="font-mono text-xs text-slate-300">
                            {job.triggeredByUserId}
                          </dd>
                        </div>
                      </div>
                    ) : null}
                  </dl>
                </div>
                <RemediationChecklist steps={remediation} />
              </div>
            </div>

            <SimilarIncidentsPanel incidents={similarIncidents} />

            <div className="rounded-2xl border border-violet-500/20 bg-black/[0.94] p-6 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
                  <Search className="h-5 w-5 text-violet-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Similar Historical Investigations
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Ranked by similarity score — review how past investigations were resolved.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <SimilarIncidentList
                  incidents={similarHistoricalIncidents}
                  loading={similarHistoricalLoading}
                  error={similarHistoricalError?.message ?? null}
                  onRetry={refetchSimilarHistorical}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-700/60 bg-black/[0.94] p-6">
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
