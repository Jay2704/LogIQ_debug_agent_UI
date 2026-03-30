import { History, Lightbulb } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { UTILITY_EXAMPLES } from "@/data/mock/utilityWorkspaceMocks";
import type { UtilityRunRecord } from "@/types";

interface UtilityToolSidebarProps {
  toolId: string;
  recentRuns: UtilityRunRecord[];
}

function statusDot(status: UtilityRunRecord["status"]) {
  switch (status) {
    case "completed":
      return "bg-emerald-400";
    case "failed":
      return "bg-red-400";
    default:
      return "bg-amber-400";
  }
}

export function UtilityToolSidebar({ toolId, recentRuns }: UtilityToolSidebarProps) {
  const forTool = recentRuns
    .filter((r) => r.toolId === toolId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const examples = UTILITY_EXAMPLES[toolId] ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.08] bg-surface-975/60 p-5 shadow-inner">
        <div className="flex items-center gap-2 text-slate-300">
          <History className="h-4 w-4 text-sky-400/90" strokeWidth={2} />
          <h2 className="text-sm font-semibold tracking-tight">Recent runs</h2>
        </div>
        {forTool.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">No mock runs for this tool yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {forTool.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-white/[0.06] bg-surface-960/80 px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full ${statusDot(r.status)}`}
                    title={r.status}
                  />
                  <span className="truncate font-mono text-[10px] text-slate-500">
                    {r.id}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {formatDateTime(r.startedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {examples.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-surface-975/40 p-5">
          <div className="flex items-center gap-2 text-slate-300">
            <Lightbulb className="h-4 w-4 text-amber-400/90" strokeWidth={2} />
            <h2 className="text-sm font-semibold tracking-tight">Tips & examples</h2>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-slate-500">
            {examples.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
