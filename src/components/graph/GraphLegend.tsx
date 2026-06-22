import { GRAPH_NODE_COLORS, GRAPH_NODE_TYPE_LABELS } from "@/lib/graphNodeColors";
import type { InvestigationGraphNodeType } from "@/types";

const LEGEND_TYPES: InvestigationGraphNodeType[] = [
  "investigation",
  "jira",
  "commit",
  "build",
  "deployment",
  "metric",
  "alert",
  "incident",
  "runbook",
];

export function GraphLegend() {
  return (
    <div className="rounded-xl border border-white/[0.1] bg-black/[0.88] p-3 shadow-lg backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        Node types
      </p>
      <ul className="space-y-1.5">
        {LEGEND_TYPES.map((type) => {
          const colors = GRAPH_NODE_COLORS[type];
          return (
            <li key={type} className="flex items-center gap-2 text-[11px] text-slate-300">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors.border }}
                aria-hidden
              />
              {GRAPH_NODE_TYPE_LABELS[type]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
