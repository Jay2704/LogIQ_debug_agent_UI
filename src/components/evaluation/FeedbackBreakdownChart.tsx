import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";
import type { RcaEvaluationSummary } from "@/types";

const tooltipStyle = {
  backgroundColor: "#0c1428",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  borderRadius: "12px",
  fontSize: "12px",
};

const COLORS = ["#34d399", "#f87171", "#fbbf24"];

interface FeedbackBreakdownChartProps {
  summary: RcaEvaluationSummary;
}

export function FeedbackBreakdownChart({ summary }: FeedbackBreakdownChartProps) {
  const data = [
    { name: "Confirmed", value: summary.confirmationRate },
    { name: "Rejected", value: summary.rejectionRate },
    { name: "Overridden", value: summary.overrideRate },
  ].filter((row) => row.value > 0);

  if (data.length === 0) {
    return (
      <ChartCard title="Feedback breakdown" subtitle="No feedback actions recorded yet.">
        <p className="py-10 text-center text-sm text-slate-500">No data to chart.</p>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Feedback breakdown"
      subtitle="Distribution of reviewer actions across all RCA outcomes."
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={data[index].name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number) => [
                `${Math.round((value <= 1 ? value * 100 : value))}%`,
                "Share",
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
