import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Clock, Layers } from "lucide-react";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { RecurringSignalsWidget } from "@/components/insights/RecurringSignalsWidget";
import { PageLoading } from "@/components/ui/PageLoading";
import { useInsightMetrics } from "@/api/hooks";
const axisLine = { stroke: "#334155", strokeOpacity: 0.85 };
const tickProps = { fill: "#94a3b8", fontSize: 11, fontWeight: 500 as const };
const gridStroke = "rgba(51, 65, 85, 0.45)";

const tooltipContentStyle = {
  backgroundColor: "#0c1428",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 12px 40px -12px rgba(0,0,0,0.65)",
};

const BAR_GRADIENTS = [
  ["#34d399", "#22c55e"],
  ["#2dd4bf", "#14b8a6"],
  ["#38bdf8", "#0ea5e9"],
  ["#a78bfa", "#7c3aed"],
  ["#818cf8", "#6366f1"],
  ["#94a3b8", "#64748b"],
];

export function Insights() {
  const { data, loading, error } = useInsightMetrics();

  const severityTotal = useMemo(() => {
    if (!data) return 0;
    return data.anomaliesBySeverity.reduce((a, s) => a + s.value, 0);
  }, [data]);

  const severityWithPct = useMemo(() => {
    if (!data || severityTotal === 0) return [];
    return data.anomaliesBySeverity.map((s) => ({
      ...s,
      pct: Math.round((s.value / severityTotal) * 1000) / 10,
    }));
  }, [data, severityTotal]);

  if (loading) {
    return <PageLoading message="Loading analytics…" />;
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
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
            Observability
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Insights
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Platform-wide anomaly analytics, RCA health, and service hotspots — rolling
            30-day window unless noted.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardKpiCard
          title="Total anomalies"
          value={m.totalAnomalies}
          subtitle="Open + closed in window"
          icon={Activity}
          accent="ice"
        />
        <DashboardKpiCard
          title="Avg resolution time"
          value={`${m.avgResolutionMinutes} min`}
          subtitle="Detect → mitigated (p50)"
          icon={Clock}
          accent="amber"
        />
        <DashboardKpiCard
          title="Monitored services"
          value={m.monitoredServices}
          subtitle="In this workspace"
          icon={Layers}
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12 xl:items-stretch">
        <ChartCard
          className="xl:col-span-8"
          eyebrow="Volume"
          title="Anomaly trend"
          subtitle="Daily incident count · last 8 days"
        >
          <div className="h-[300px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={m.anomalyTrend}
                margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="insAnomFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="insAnomStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="date"
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                  tickMargin={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                  width={40}
                  domain={[0, "auto"]}
                  allowDecimals={false}
                  tickMargin={8}
                  label={{
                    value: "Events",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: "#64748b", fontSize: 10, fontWeight: 600 },
                  }}
                />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  formatter={(value: number) => [
                    `${value} events`,
                    "Daily count",
                  ]}
                  labelFormatter={(l) => String(l)}
                  cursor={{ stroke: "rgba(56,189,248,0.35)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="events"
                  stroke="url(#insAnomStroke)"
                  strokeWidth={2.5}
                  fill="url(#insAnomFill)"
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0, fill: "#38bdf8" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <RecurringSignalsWidget
          className="xl:col-span-4"
          signals={m.recurringSignals}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          eyebrow="Distribution"
          title="Anomalies by severity"
          subtitle="Share of volume in window"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={m.anomaliesBySeverity}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={2.5}
                  stroke="rgba(15,23,42,0.85)"
                  strokeWidth={2}
                >
                  {m.anomaliesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={{ color: "#94a3b8", fontSize: 11 }}
                  formatter={(value: number, name: string) => [
                    `${value} (${severityTotal > 0 ? Math.round((value / severityTotal) * 1000) / 10 : 0}%)`,
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  wrapperStyle={{ paddingTop: 8 }}
                  formatter={(value, entry) => {
                    const v =
                      (entry as { payload?: { value?: number } }).payload
                        ?.value ?? 0;
                    const pct =
                      severityTotal > 0
                        ? Math.round((v / severityTotal) * 1000) / 10
                        : 0;
                    return (
                      <span className="text-xs text-slate-400">
                        {value}{" "}
                        <span className="font-mono text-slate-500">({pct}%)</span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
            {severityWithPct.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full ring-1 ring-white/10"
                  style={{ backgroundColor: s.fill }}
                />
                <span className="font-medium text-slate-400">{s.name}</span>
                <span className="font-mono tabular-nums text-slate-300">{s.value}</span>
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="RCA health"
          title="Confidence distribution"
          subtitle="Completed investigations by deterministic score bucket"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={m.confidenceDistribution}
                margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
                barCategoryGap="18%"
              >
                <defs>
                  <linearGradient id="confBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.75} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="range"
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                  tickMargin={10}
                  label={{
                    value: "Confidence score (deterministic)",
                    position: "bottom",
                    offset: 0,
                    style: { fill: "#64748b", fontSize: 10, fontWeight: 600 },
                  }}
                />
                <YAxis
                  tick={tickProps}
                  tickLine={false}
                  axisLine={axisLine}
                  width={36}
                  domain={[0, "auto"]}
                  allowDecimals={false}
                  label={{
                    value: "Jobs",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: "#64748b", fontSize: 10, fontWeight: 600 },
                  }}
                />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={{ color: "#94a3b8", fontSize: 11 }}
                  formatter={(value: number) => [`${value} jobs`, "Bucket"]}
                  cursor={{ fill: "rgba(139,92,246,0.08)" }}
                />
                <Bar dataKey="count" fill="url(#confBar)" radius={[8, 8, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        eyebrow="Hotspots"
        title="Top affected services"
        subtitle="Ranked by anomaly count · same window"
        chartClassName="p-4 sm:p-5"
      >
        <div className="h-[280px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={m.topServices}
              margin={{ top: 8, right: 24, left: 4, bottom: 8 }}
              barCategoryGap="14%"
            >
              <defs>
                {BAR_GRADIENTS.map(([a, b], i) => (
                  <linearGradient
                    key={i}
                    id={`svcGrad${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={a} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={b} stopOpacity={0.75} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
              <XAxis
                type="number"
                tick={tickProps}
                tickLine={false}
                axisLine={axisLine}
                domain={[0, "auto"]}
                allowDecimals={false}
                label={{
                  value: "Anomaly count",
                  position: "bottom",
                  offset: 4,
                  style: { fill: "#64748b", fontSize: 10, fontWeight: 600 },
                }}
              />
              <YAxis
                type="category"
                dataKey="service"
                width={140}
                tick={tickProps}
                tickLine={false}
                axisLine={axisLine}
                tickFormatter={(v: string) =>
                  v.length > 22 ? `${v.slice(0, 20)}…` : v
                }
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(value: number, _n: string, item: { payload?: { service?: string } }) => [
                  `${value} anomalies`,
                  item.payload?.service ?? "Service",
                ]}
                cursor={{ fill: "rgba(16,185,129,0.06)" }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={26}>
                {m.topServices.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`url(#svcGrad${i % BAR_GRADIENTS.length})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
