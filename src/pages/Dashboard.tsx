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
import { mockAnomalies, mockJobs, mockRcaByJobId } from "@/data/mock";
import { getInsightSummary } from "@/data/mock/explanations";
import { cn, formatDateTime } from "@/lib/utils";

export function Dashboard() {
  const { total, running, completed, failed } = getInsightSummary(mockJobs);
  const recent = [...mockJobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentAnomalies = [...mockAnomalies]
    .sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    )
    .slice(0, 3);

  const confidences = Object.values(mockRcaByJobId).map((r) => r.confidence);
  const avgConf =
    confidences.filter((c) => c > 0).reduce((a, b) => a + b, 0) /
    Math.max(1, confidences.filter((c) => c > 0).length);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Operations overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
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
            <h2 className="text-sm font-semibold text-slate-200">
              Recent jobs
            </h2>
            <Link
              to="/jobs"
              className="text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-card border border-white/[0.06] bg-surface-900/50 shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase text-slate-500">
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Anomaly</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recent.map((j) => (
                  <tr key={j.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        to={`/jobs/${j.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        {j.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-violet-300/90">
                      {j.anomalyId}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                      {formatDateTime(j.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            System status
          </h2>
          <div className="rounded-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-surface-900 to-surface-950 p-5 shadow-card">
            <div className="flex items-center gap-2 text-emerald-400">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-medium">Ingest healthy</span>
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

          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-5 shadow-card">
            <div className="flex items-center gap-2 text-slate-200">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">RCA confidence</span>
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-white">
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
        <div className="rounded-card border border-amber-500/15 bg-surface-900/50 p-5 shadow-card">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Recent anomaly summary
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {recentAnomalies.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-white/[0.05] bg-surface-850/40 p-3"
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
            className="mt-4 inline-block text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            Browse anomalies →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className={cn(
              "rounded-card border border-violet-500/20 p-4",
              "bg-gradient-to-br from-violet-500/10 to-surface-950"
            )}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              AI insight
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Latency spikes on checkout correlate with Redis timeouts more
              often than deploys in the last 7 days.
            </p>
          </div>
          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-4 shadow-card">
            <Zap className="h-4 w-4 text-blue-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Determinism
            </p>
            <p className="mt-1 text-sm text-slate-300">
              82% of RCAs ranked the same root file path as on-call replay
              validation.
            </p>
          </div>
          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-4 shadow-card">
            <Timer className="h-4 w-4 text-amber-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Queue time
            </p>
            <p className="mt-1 text-sm text-slate-300">
              P50 time to first triage: 2m 14s · P95: 6m 02s (mock).
            </p>
          </div>
          <div className="rounded-card border border-white/[0.06] bg-surface-900/60 p-4 shadow-card">
            <Activity className="h-4 w-4 text-emerald-400" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Coverage
            </p>
            <p className="mt-1 text-sm text-slate-300">
              128 services monitored · 14 regions (mock configuration).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
