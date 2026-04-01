import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  ListTodo,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { USE_HTTP_API } from "@/api/config";
import { useCurrentUser } from "@/auth";
import { AnomalyActivityMiniChart } from "@/components/dashboard/AnomalyActivityMiniChart";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { InvestigationCard } from "@/components/dashboard/InvestigationCard";
import { SystemHealthPanel } from "@/components/dashboard/SystemHealthPanel";
import { TopRootCauseFiles } from "@/components/dashboard/TopRootCauseFiles";
import { RunDebugButton } from "@/components/ui/RunDebugButton";
import {
  useDashboardEnrichment,
  useDashboardJobs,
  useDashboardWidgets,
} from "@/api/hooks";
import { computeJobStatusSummary } from "@/lib/insights";
import { getJobRouteId } from "@/lib/jobRoute";
import {
  getRunDebugShortcutDisabledTitle,
  useRoleUiCapabilities,
} from "@/lib/roleUiCapabilities";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn, formatDateTime } from "@/lib/utils";

function KpiStripSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[120px] animate-pulse rounded-card border border-white/[0.06] bg-surface-975/60 ring-1 ring-inset ring-white/[0.04]"
        />
      ))}
    </section>
  );
}

function InvestigationGridSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      aria-busy="true"
      aria-label="Loading investigations"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[168px] animate-pulse rounded-card border border-blue-500/10 bg-surface-975/50"
        />
      ))}
    </div>
  );
}

function WidgetsRowSkeleton() {
  return (
    <section className="grid gap-6 lg:grid-cols-12" aria-busy="true">
      <div className="h-[min(22rem,55vh)] animate-pulse rounded-card border border-indigo-500/15 bg-surface-975/50 lg:col-span-5" />
      <div className="h-[min(22rem,55vh)] animate-pulse rounded-card border border-cyan-500/15 bg-surface-975/50 lg:col-span-7" />
    </section>
  );
}

function KpiErrorPlaceholder({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 shadow-inner ring-1 ring-inset ring-red-500/10"
      role="alert"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-100/95">Workspace metrics unavailable</p>
          <p className="mt-1 text-sm text-red-200/75">{message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
            ctaButtonGradient,
            ctaGlowBlueOnly,
            "ring-1 ring-blue-400/35 transition hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Retry
        </button>
      </div>
      <p className="mt-4 text-xs text-red-300/55">
        Analytics widgets below may still use mock data when the jobs API fails.
      </p>
    </section>
  );
}

export function Dashboard() {
  const { user } = useCurrentUser();
  const roleCaps = useRoleUiCapabilities();
  const canCreateJobFromRole =
    Boolean(user?.userId?.trim()) && roleCaps.canCreateJob;
  const jobsQuery = useDashboardJobs();
  const enrich = useDashboardEnrichment();
  const widgets = useDashboardWidgets();

  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = jobsQuery;
  const { anomalies, rcaByJobId } = enrich;

  const { total, running, completed, failed } = computeJobStatusSummary(jobs);

  const investigations = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)
    .map((job) => {
      const anomaly = anomalies.find((x) => x.id === job.anomalyId);
      const jid = getJobRouteId(job);
      const rca = rcaByJobId[job.id] ?? rcaByJobId[jid];
      const anomalySummary =
        job.userSummary?.trim() ||
        anomaly?.summary ||
        "No summary yet — open the job for details.";
      return {
        job,
        anomalySummary,
        confidence: rca?.confidence,
      };
    });

  const recentAnomalies = [...anomalies]
    .sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    )
    .slice(0, 3);

  const confidences = Object.values(rcaByJobId).map((r) => r.confidence);
  const withConf = confidences.filter((c) => c > 0);
  const avgConf =
    withConf.reduce((a, b) => a + b, 0) / Math.max(1, withConf.length);

  const maxFileHits =
    widgets.topFiles && widgets.topFiles.length > 0
      ? Math.max(1, ...widgets.topFiles.map((r) => r.hits))
      : 1;

  const widgetsReady =
    !widgets.loading &&
    widgets.activity !== null &&
    widgets.topFiles !== null &&
    !widgets.error;

  return (
    <div className="space-y-10">
      {/* Hero — product landing feel */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-surface-900/95 via-[#0c1428] to-surface-975 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_24px_64px_-32px_rgba(0,0,0,0.6)] sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
              LogIQ Debug Agent
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Command center
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              Deterministic root-cause investigations, evidence-backed RCAs, and
              assistive AI explanations — one workspace for production debugging.
            </p>
            {USE_HTTP_API && !jobsLoading && !jobsError ? (
              <p className="mt-3 text-xs font-medium text-emerald-400/90">
                Jobs KPIs and recent investigations use live API data.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="rounded-lg border border-white/[0.08] bg-surface-975/80 px-2.5 py-1 font-mono">
                Workspace · prod-debug
              </span>
              <span className="rounded-lg border border-white/[0.08] bg-surface-975/80 px-2.5 py-1">
                128 services · 14 regions
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <div className="rounded-2xl bg-gradient-to-r from-sky-500/30 via-blue-600/25 to-violet-600/25 p-[1px] shadow-[0_0_40px_-8px_rgba(56,189,248,0.35)]">
              <div className="rounded-2xl bg-surface-975/95 p-1.5">
                <RunDebugButton
                  to="/jobs"
                  disabled={!roleCaps.canUseRunDebugShortcut}
                  disabledTitle={getRunDebugShortcutDisabledTitle(user)}
                  className="w-full justify-center px-8 py-4 text-base sm:w-auto"
                />
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-500 sm:text-right">
              {roleCaps.canUseRunDebugShortcut
                ? "Spawns a new investigation pipeline with trace + log correlation."
                : user?.userId
                  ? "Shortcut hidden for viewer role — browse jobs read-only (UI only)."
                  : "Login with a non-viewer role to use this shortcut (UI only)."}
            </p>
          </div>
        </div>
      </section>

      {/* Premium KPI strip — live jobs list (hidden on fetch error to avoid misleading zeros) */}
      {jobsLoading ? (
        <KpiStripSkeleton />
      ) : jobsError ? (
        <KpiErrorPlaceholder
          message={jobsError.message}
          onRetry={() => refetchJobs()}
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardKpiCard
            title="Investigations"
            value={total}
            subtitle="Total jobs in workspace"
            icon={ListTodo}
            accent="ice"
          />
          <DashboardKpiCard
            title="Active"
            value={running}
            subtitle="Running & triaging now"
            icon={Activity}
            accent="amber"
          />
          <DashboardKpiCard
            title="Completed"
            value={completed}
            subtitle="RCA pipeline finished"
            icon={CheckCircle2}
            accent="emerald"
          />
          <DashboardKpiCard
            title="Failed"
            value={failed}
            subtitle="Needs engineer review"
            icon={AlertOctagon}
            accent="rose"
          />
        </section>
      )}

      {/* Investigations + system health */}
      <section className="grid gap-8 xl:grid-cols-12 xl:gap-10">
        <div className="space-y-5 xl:col-span-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Recent investigations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest debug jobs ranked by recency — click through for full RCA.
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
            >
              View all jobs →
            </Link>
          </div>

          {jobsLoading ? (
            <InvestigationGridSkeleton />
          ) : jobsError ? (
            <div className="rounded-card border border-white/[0.08] bg-surface-975/50 px-5 py-10 text-center">
              <p className="text-sm text-slate-400">
                Recent jobs unavailable — the jobs API request failed.
              </p>
              <button
                type="button"
                onClick={() => refetchJobs()}
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
                  ctaButtonGradient,
                  ctaGlowBlueOnly,
                  "ring-1 ring-blue-400/35 transition hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Retry
              </button>
            </div>
          ) : investigations.length === 0 ? (
            <div className="rounded-card border border-dashed border-slate-700/60 bg-surface-975/40 px-5 py-10 text-center text-sm text-slate-500">
              No jobs yet.{" "}
              {canCreateJobFromRole ? (
                <>
                  <Link
                    to="/jobs"
                    className="font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Create a job
                  </Link>{" "}
                  to see investigations here.
                </>
              ) : user?.userId ? (
                <>
                  Open{" "}
                  <Link to="/jobs" className="font-semibold text-sky-400 hover:text-sky-300">
                    Jobs
                  </Link>{" "}
                  to browse — your role cannot create jobs here (frontend hint only).
                </>
              ) : (
                <>
                  <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300">
                    Login
                  </Link>{" "}
                  with a tester, support, developer, or SRE account to create jobs.
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {investigations.map(({ job, anomalySummary, confidence }) => (
                <InvestigationCard
                  key={getJobRouteId(job)}
                  job={job}
                  anomalySummary={anomalySummary}
                  confidence={confidence}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5 xl:col-span-4">
          <SystemHealthPanel rcaWorkersBusy={jobsLoading ? 0 : running} />
          <div className="rounded-card border border-blue-500/15 bg-gradient-to-br from-surface-900/90 to-surface-975 p-5 shadow-card">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Mean RCA confidence</h3>
            </div>
            {enrich.loading ? (
              <div
                className="mt-3 h-12 w-24 animate-pulse rounded-lg bg-slate-800/80"
                aria-hidden
              />
            ) : (
              <p className="mt-3 text-4xl font-bold tabular-nums text-white">
                {(avgConf * 100).toFixed(0)}
                <span className="text-2xl font-semibold text-slate-500">%</span>
              </p>
            )}
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Across jobs with deterministic output (mock RCA map until per-job API is
              wired). Higher when traces and deploys align.
            </p>
          </div>
        </div>
      </section>

      {/* Top files + anomaly sparkline — mock widgets */}
      {widgets.error ? (
        <div
          className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/90"
          role="status"
        >
          <p className="font-medium text-amber-200/95">Analytics widgets unavailable</p>
          <p className="mt-1 text-amber-100/75">{widgets.error.message}</p>
        </div>
      ) : widgets.loading || !widgetsReady ? (
        <WidgetsRowSkeleton />
      ) : (
        <section className="grid gap-6 lg:grid-cols-12">
          <TopRootCauseFiles
            className="lg:col-span-5"
            rows={widgets.topFiles!}
            maxHits={maxFileHits}
          />
          <AnomalyActivityMiniChart
            className="lg:col-span-7"
            data={widgets.activity!}
          />
        </section>
      )}

      {/* Secondary signals — mock / static */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-surface-925/98 to-surface-975 p-6 shadow-card-premium">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Latest anomalies</h2>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Mock anomaly feed — live job workflows use the Jobs page.
          </p>
          <ul className="mt-5 space-y-2">
            {recentAnomalies.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-white/[0.06] bg-surface-975/90 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-violet-300">{a.id}</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {formatDateTime(a.detectedAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {a.service}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {a.summary}
                </p>
              </li>
            ))}
          </ul>
          <Link
            to="/anomalies"
            className="mt-5 inline-block text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            Open anomaly feed →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={cn(
              "rounded-card border border-violet-500/25 p-5 shadow-glow-violet",
              "bg-gradient-to-br from-violet-500/15 via-surface-925 to-surface-975"
            )}
          >
            <Sparkles className="h-5 w-5 text-violet-400" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              AI insight
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              checkout-service shows the highest fingerprint match rate vs
              payment-gateway in the last 7 days — monitor confirm-path deploys.
            </p>
          </div>
          <div className="rounded-card border border-white/[0.08] bg-surface-975/80 p-5 shadow-inner">
            <Zap className="h-5 w-5 text-sky-400" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Determinism
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              82% of on-call replays matched the same ranked file path as LogIQ.
            </p>
          </div>
          <div className="rounded-card border border-white/[0.08] bg-surface-975/80 p-5 shadow-inner">
            <Timer className="h-5 w-5 text-amber-400" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Triage SLA
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              P50 first triage: 2m 14s · P95: 6m 02s (rolling 7d).
            </p>
          </div>
          <div className="rounded-card border border-white/[0.08] bg-surface-975/80 p-5 shadow-inner">
            <Activity className="h-5 w-5 text-emerald-400" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Coverage
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              APM + logs wired for tier-1 services; expand to tier-2 Q2.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
