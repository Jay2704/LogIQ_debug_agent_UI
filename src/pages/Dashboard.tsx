import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  ListTodo,
  ShieldAlert,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnomalyActivityMiniChart } from "@/components/dashboard/AnomalyActivityMiniChart";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { InvestigationCard } from "@/components/dashboard/InvestigationCard";
import { SystemHealthPanel } from "@/components/dashboard/SystemHealthPanel";
import { TopRootCauseFiles } from "@/components/dashboard/TopRootCauseFiles";
import { RunDebugButton } from "@/components/ui/RunDebugButton";
import { PageLoading } from "@/components/ui/PageLoading";
import { useDashboardData, useDashboardWidgets } from "@/api/hooks";
import { computeJobStatusSummary } from "@/lib/insights";
import { cn, formatDateTime } from "@/lib/utils";

export function Dashboard() {
  const main = useDashboardData();
  const widgets = useDashboardWidgets();

  if (main.loading || widgets.loading) {
    return <PageLoading message="Loading command center…" />;
  }

  if (main.error) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {main.error.message}
      </div>
    );
  }

  if (widgets.error || !widgets.activity || !widgets.topFiles) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {widgets.error?.message ?? "Unable to load dashboard widgets."}
      </div>
    );
  }

  const { jobs, anomalies, rcaByJobId } = main;
  const { total, running, completed, failed } = computeJobStatusSummary(jobs);

  const investigations = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)
    .map((job) => {
      const anomaly = anomalies.find((x) => x.id === job.anomalyId);
      const rca = rcaByJobId[job.id];
      return {
        job,
        anomalySummary: anomaly?.summary ?? "—",
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
  const avgConf =
    confidences.filter((c) => c > 0).reduce((a, b) => a + b, 0) /
    Math.max(1, confidences.filter((c) => c > 0).length);

  const maxFileHits = Math.max(
    1,
    ...widgets.topFiles.map((r) => r.hits)
  );

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
                <RunDebugButton className="w-full justify-center px-8 py-4 text-base sm:w-auto" />
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-500 sm:text-right">
              Spawns a new investigation pipeline with trace + log correlation.
            </p>
          </div>
        </div>
      </section>

      {/* Premium KPI strip */}
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
          <div className="grid gap-4 sm:grid-cols-2">
            {investigations.map(({ job, anomalySummary, confidence }) => (
              <InvestigationCard
                key={job.id}
                job={job}
                anomalySummary={anomalySummary}
                confidence={confidence}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5 xl:col-span-4">
          <SystemHealthPanel rcaWorkersBusy={running} />
          <div className="rounded-card border border-blue-500/15 bg-gradient-to-br from-surface-900/90 to-surface-975 p-5 shadow-card">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Mean RCA confidence</h3>
            </div>
            <p className="mt-3 text-4xl font-bold tabular-nums text-white">
              {(avgConf * 100).toFixed(0)}
              <span className="text-2xl font-semibold text-slate-500">%</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Across jobs with deterministic output. Higher when traces and deploys
              align.
            </p>
          </div>
        </div>
      </section>

      {/* Top files + anomaly sparkline */}
      <section className="grid gap-6 lg:grid-cols-12">
        <TopRootCauseFiles
          className="lg:col-span-5"
          rows={widgets.topFiles}
          maxHits={maxFileHits}
        />
        <AnomalyActivityMiniChart
          className="lg:col-span-7"
          data={widgets.activity}
        />
      </section>

      {/* Secondary signals */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-surface-925/98 to-surface-975 p-6 shadow-card-premium">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Latest anomalies</h2>
          </div>
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
