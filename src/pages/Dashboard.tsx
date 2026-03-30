import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  ListTodo,
  ShieldAlert,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { KpiCard } from "@/components/ui/KpiCard";
import { RunDebugButton } from "@/components/ui/RunDebugButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDashboardData } from "@/api/hooks";
import { PageLoading } from "@/components/ui/PageLoading";
import { computeJobStatusSummary } from "@/lib/insights";
import { cn, formatDateTime } from "@/lib/utils";

export function Dashboard() {
  const { jobs, anomalies, rcaByJobId, loading, error } = useDashboardData();

  if (loading) {
    return <PageLoading message="Loading dashboard…" />;
  }

  if (error) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  const { total, running, completed, failed } = computeJobStatusSummary(jobs);
  const recent = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="ui-page-title">Operations overview</h1>
          <p className="ui-page-desc">
            Debug jobs, anomaly signals, and RCA confidence across monitored
            services.
          </p>
        </div>
        <RunDebugButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Jobs"
          value={total}
          subtitle="All-time in this workspace"
          icon={ListTodo}
          variant="default"
        />
        <KpiCard
          title="Running Jobs"
          value={running}
          subtitle="Active investigations"
          icon={Activity}
          variant="amber"
        />
        <KpiCard
          title="Completed Jobs"
          value={completed}
          subtitle="RCA pipeline finished"
          icon={CheckCircle2}
          variant="green"
        />
        <KpiCard
          title="Failed Jobs"
          value={failed}
          subtitle="Requires follow-up"
          icon={AlertOctagon}
          variant="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent jobs</h2>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-card border border-blue-500/[0.12] bg-gradient-to-b from-surface-850/70 via-surface-960 to-surface-975 shadow-card-premium">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-blue-500/10 bg-surface-975/95 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-4 py-3.5 font-semibold">Job</th>
                  <th className="px-4 py-3.5 font-semibold">Anomaly</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/[0.06]">
                {recent.map((j) => (
                  <tr
                    key={j.id}
                    className="group transition-colors duration-150 hover:bg-blue-500/[0.07]"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs">
                      <Link
                        to={`/jobs/${j.id}`}
                        className="text-sky-400 transition group-hover:text-sky-300 hover:underline"
                      >
                        {j.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-violet-300/95">
                      {j.anomalyId}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-slate-500 tabular-nums">
                      {formatDateTime(j.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">System status</h2>
          <div className="rounded-card border border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 via-surface-925 to-surface-960 p-5 shadow-card-premium">
            <div className="flex items-center gap-2 text-emerald-300">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-semibold">Ingest healthy</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex justify-between">
                <span>Trace pipeline</span>
                <span className="text-emerald-400">OK</span>
              </li>
              <li className="flex justify-between">
                <span>Metric correlator</span>
                <span className="text-emerald-400">OK</span>
              </li>
              <li className="flex justify-between">
                <span>RCA workers</span>
                <span className="text-amber-400">
                  {running} busy
                </span>
              </li>
            </ul>
          </div>

          <div className="ui-card p-5 shadow-card-premium">
            <div className="flex items-center gap-2 text-slate-100">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-bold">RCA confidence</span>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-white">
              {(avgConf * 100).toFixed(0)}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Mean Confidence Score across completed jobs with deterministic
              output.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.1] via-surface-925/95 to-surface-975 p-5 shadow-card-premium">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">
              Recent anomaly summary
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {recentAnomalies.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-blue-500/[0.08] bg-surface-900/50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-violet-300">
                    {a.id}
                  </span>
                  <span className="text-xs text-slate-500">{a.service}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{a.summary}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/anomalies"
            className="mt-4 inline-block text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            Browse anomalies →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className={cn(
              "rounded-card border border-violet-500/25 p-4 shadow-glow-violet",
              "bg-gradient-to-br from-violet-500/15 via-surface-925 to-surface-975"
            )}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              AI insight
            </p>
            <p className="mt-1 text-sm text-slate-300">
              checkout-service shows the highest fingerprint match rate vs
              payment-gateway in the last 7 days — worth watching confirm path
              deploys.
            </p>
          </div>
          <div className="ui-card p-4 shadow-card">
            <Zap className="h-4 w-4 text-sky-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Determinism
            </p>
            <p className="mt-1 text-sm text-slate-300">
              82% of RCAs ranked the same root file path as on-call replay
              validation.
            </p>
          </div>
          <div className="ui-card p-4 shadow-card">
            <Timer className="h-4 w-4 text-amber-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Queue time
            </p>
            <p className="mt-1 text-sm text-slate-300">
              P50 time to first triage: 2m 14s · P95: 6m 02s (mock).
            </p>
          </div>
          <div className="ui-card p-4 shadow-card">
            <Activity className="h-4 w-4 text-emerald-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Coverage
            </p>
            <p className="mt-1 text-sm text-slate-300">
              128 services monitored · 14 regions (workspace configuration).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
