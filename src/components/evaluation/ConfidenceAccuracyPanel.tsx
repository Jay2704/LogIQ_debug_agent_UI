import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";
import type { RcaConfidenceEvaluation } from "@/types";

const tooltipStyle = {
  backgroundColor: "#0c1428",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  borderRadius: "12px",
  fontSize: "12px",
};

function formatRate(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(pct)}%`;
}

interface ConfidenceAccuracyPanelProps {
  confidence: RcaConfidenceEvaluation;
}

export function ConfidenceAccuracyPanel({ confidence }: ConfidenceAccuracyPanelProps) {
  const chartData = confidence.byLevel.map((row) => ({
    label: row.label,
    accuracy: row.accuracy <= 1 ? row.accuracy * 100 : row.accuracy,
    count: row.count,
  }));

  return (
    <ChartCard
      title="Accuracy by confidence level"
      subtitle={`High-confidence accuracy: ${formatRate(confidence.highConfidenceAccuracy)}`}
    >
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No confidence-band metrics available.
        </p>
      ) : (
        <>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            {confidence.byLevel.map((row) => (
              <div
                key={row.level}
                className="rounded-lg border border-white/[0.06] bg-black/[0.65] px-3 py-2"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {row.label}
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums text-white">
                  {formatRate(row.accuracy)}
                </p>
                <p className="text-[11px] text-slate-500">{row.count} investigations</p>
              </div>
            ))}
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(51, 65, 85, 0.45)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name) =>
                    name === "accuracy" ? [`${Math.round(value)}%`, "Accuracy"] : [value, "Count"]
                  }
                />
                <Bar dataKey="accuracy" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </ChartCard>
  );
}
