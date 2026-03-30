import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnomalyActivityPoint } from "@/types";
import { cn } from "@/lib/utils";

interface AnomalyActivityMiniChartProps {
  data: AnomalyActivityPoint[];
  className?: string;
}

const tooltipStyle = {
  backgroundColor: "#0f1a2e",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  borderRadius: "10px",
  fontSize: "11px",
};

export function AnomalyActivityMiniChart({
  data,
  className,
}: AnomalyActivityMiniChartProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-card border border-cyan-500/15 bg-gradient-to-b from-surface-900/90 to-surface-975 p-5",
        className
      )}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-500/80">
          Signals
        </p>
        <h3 className="text-sm font-bold text-white">Recent anomaly activity</h3>
        <p className="mt-1 text-xs text-slate-500">
          Normalized event count by window (last 24h, 2h buckets).
        </p>
      </div>
      <div className="mt-3 h-[140px] w-full min-h-0 flex-1 [&_.recharts-cartesian-grid-horizontal_line]:stroke-slate-700/40 [&_.recharts-text]:fill-slate-500">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="dashAnomFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              width={20}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#94a3b8" }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#dashAnomFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
