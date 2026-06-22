import { ChartCard } from "@/components/ui/ChartCard";
import { cn } from "@/lib/utils";
import type { RcaCandidateRow } from "@/types";

interface TopCandidatesTableProps {
  title: string;
  subtitle: string;
  candidates: RcaCandidateRow[];
  tone?: "confirm" | "reject";
}

export function TopCandidatesTable({
  title,
  subtitle,
  candidates,
  tone = "confirm",
}: TopCandidatesTableProps) {
  const countClass =
    tone === "confirm" ? "text-emerald-200" : "text-red-200";

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {candidates.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No candidates ranked yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <th className="px-3 py-2">Candidate</th>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((row) => (
                <tr
                  key={`${row.candidate}-${row.service ?? "na"}`}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td className="px-3 py-3 text-slate-200">{row.candidate}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">
                    {row.service ?? "—"}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-semibold tabular-nums",
                      countClass
                    )}
                  >
                    {row.count}
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
