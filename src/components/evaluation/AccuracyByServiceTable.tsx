import { ChartCard } from "@/components/ui/ChartCard";
import type { RcaServiceAccuracyRow } from "@/types";

function formatRate(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(pct)}%`;
}

interface AccuracyByServiceTableProps {
  services: RcaServiceAccuracyRow[];
}

export function AccuracyByServiceTable({ services }: AccuracyByServiceTableProps) {
  return (
    <ChartCard
      title="Accuracy by service"
      subtitle="Confirmation and rejection rates per monitored service."
    >
      {services.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No service-level evaluation data yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2 text-right">Investigations</th>
                <th className="px-3 py-2 text-right">Accuracy</th>
                <th className="px-3 py-2 text-right">Confirm rate</th>
                <th className="px-3 py-2 text-right">Reject rate</th>
              </tr>
            </thead>
            <tbody>
              {services.map((row) => (
                <tr
                  key={row.service}
                  className="border-b border-white/[0.04] text-slate-300 last:border-0"
                >
                  <td className="px-3 py-3 font-mono text-xs text-sky-200/90">
                    {row.service}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{row.investigations}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums text-emerald-200">
                    {formatRate(row.accuracy)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRate(row.confirmationRate)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-red-200/90">
                    {formatRate(row.rejectionRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}
