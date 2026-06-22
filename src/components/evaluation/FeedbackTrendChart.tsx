import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";
import type { RcaFeedbackTrendPoint } from "@/types";
import { formatDateTime } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#0c1428",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  borderRadius: "12px",
  fontSize: "12px",
};

interface FeedbackTrendChartProps {
  trend: RcaFeedbackTrendPoint[];
}

export function FeedbackTrendChart({ trend }: FeedbackTrendChartProps) {
  const chartData = trend.map((point) => ({
    ...point,
    label: formatDateTime(point.date).split(",")[0] ?? point.date,
  }));

  return (
    <ChartCard
      title="Recent feedback trend"
      subtitle="Daily reviewer actions over the last week."
    >
      {chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No feedback trend data yet.</p>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(51, 65, 85, 0.45)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area
                type="monotone"
                dataKey="confirms"
                name="Confirmed"
                stackId="1"
                stroke="#34d399"
                fill="#34d399"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="rejects"
                name="Rejected"
                stackId="1"
                stroke="#f87171"
                fill="#f87171"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="overrides"
                name="Overridden"
                stackId="1"
                stroke="#fbbf24"
                fill="#fbbf24"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
