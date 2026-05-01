import {
  Activity,
  Database,
  GitBranch,
  Radio,
  Server,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HealthState = "ok" | "warn" | "degraded";

const stateStyles: Record<
  HealthState,
  { dot: string; label: string }
> = {
  ok: {
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]",
    label: "Operational",
  },
  warn: {
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]",
    label: "Elevated",
  },
  degraded: {
    dot: "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.45)]",
    label: "Degraded",
  },
};

interface Row {
  name: string;
  state: HealthState;
  detail: string;
  icon: typeof Server;
}

interface SystemHealthPanelProps {
  rcaWorkersBusy: number;
  className?: string;
}

export function SystemHealthPanel({
  rcaWorkersBusy,
  className,
}: SystemHealthPanelProps) {
  const rows: Row[] = [
    {
      name: "Trace ingest",
      state: "ok",
      detail: "p99 42ms · us-east-1",
      icon: Activity,
    },
    {
      name: "Metric correlator",
      state: "ok",
      detail: "Lag under 2s",
      icon: Radio,
    },
    {
      name: "Evidence store",
      state: "ok",
      detail: "Replication healthy",
      icon: Database,
    },
    {
      name: "RCA worker pool",
      state: rcaWorkersBusy > 0 ? "warn" : "ok",
      detail:
        rcaWorkersBusy > 0
          ? `${rcaWorkersBusy} slot(s) active`
          : "All workers idle",
      icon: Zap,
    },
    {
      name: "Deploy graph",
      state: "ok",
      detail: "Last sync 1m ago",
      icon: GitBranch,
    },
    {
      name: "Control plane",
      state: "ok",
      detail: "API 200",
      icon: Server,
    },
  ];

  return (
    <div
      className={cn(
        "rounded-card border border-nexus/[0.15] bg-black/[0.88] p-5 shadow-glow-nexus",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-nexus/70">
            Platform
          </p>
          <h3 className="mt-0.5 font-display text-sm font-bold text-white">System health</h3>
        </div>
        <span className="rounded border border-nexus/[0.3] bg-nexus/[0.08] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-nexus">
          Live
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => {
          const st = stateStyles[row.state];
          const Icon = row.icon;
          return (
            <li
              key={row.name}
              className="flex items-center gap-3 rounded-card border border-cyber/[0.06] bg-black/[0.6] px-3 py-2.5"
            >
              <span
                className={cn("h-2 w-2 shrink-0 rounded-full", st.dot)}
                title={st.label}
              />
              <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-300">{row.name}</p>
                <p className="truncate font-mono text-[10px] text-slate-500">
                  {row.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
