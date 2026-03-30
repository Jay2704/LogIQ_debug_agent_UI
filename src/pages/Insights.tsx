import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { useInsightMetrics } from "@/api/hooks";
import { Clock, Layers, Radar } from "lucide-react";

const axisLine = { stroke: "#475569", strokeOpacity: 0.9 };
const tickProps = { fill: "#94a3b8", fontSize: 11 };
const gridStroke = "rgba(51, 65, 85, 0.55)";

const tooltipStyle = {
  backgroundColor: "#0f1a2e",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
};

export function Insights() {
  const { data, loading, error } = useInsightMetrics();

  if (loading) {
    return <PageLoading message="Loading insights…" />;
  }

  if (error || !data) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error?.message ?? "Unable to load metrics."}
      </div>
    );
  }

  const m = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="ui-page-title">Insights</h1>
        <p className="ui-page-desc">
          Anomaly trends, severity mix, RCA confidence distribution, and service
          hotspots (mock metrics).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total anomalies"
          value={m.totalAnomalies}
          subtitle="Rolling window (mock)"
          icon={Radar}
          variant="violet"
        />
        <KpiCard
          title="Avg resolution time"
          value={`${m.avgResolutionMinutes}m`}
          subtitle="From detect to mitigated"
          icon={Clock}
          variant="blue"
        />
        <KpiCard
          title="Monitored services"
          value={m.monitoredServices}
          subtitle="Configured in workspace"
          icon={Layers}
          variant="default"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Anomaly trend"
          subtitle="Count per day (mock series)"
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.anomalyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillAnom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="date"
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                />
                <YAxis tick={tickProps} tickLine={false} axisLine={axisLine} width={36} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#fillAnom)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Anomalies by severity"
          subtitle="Share of volume"
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={m.anomaliesBySeverity}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="rgba(15,23,42,0.6)"
                  strokeWidth={1}
                >
                  {m.anomaliesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            {m.anomaliesBySeverity.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.fill }}
                />
                {s.name}: {s.value}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="RCA confidence distribution"
          subtitle="Completed jobs bucketed by Confidence Score"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.confidenceDistribution} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="range"
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                />
                <YAxis tick={tickProps} tickLine={false} axisLine={axisLine} width={32} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#e2e8f0" }} />
                <Bar
                  dataKey="count"
                  fill="#a78bfa"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top affected services"
          subtitle="Anomaly count by service"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={m.topServices}
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis type="number" tick={tickProps} tickLine={false} axisLine={axisLine} />
                <YAxis
                  type="category"
                  dataKey="service"
                  width={120}
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#e2e8f0" }} />
                <Bar
                  dataKey="count"
                  fill="#34d399"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
