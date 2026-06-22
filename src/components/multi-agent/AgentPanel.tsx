import { AgentFindingCard } from "./AgentFindingCard";
import { AgentStatusBadge } from "./AgentStatusBadge";
import type { MultiAgentPanel } from "@/types";

interface AgentPanelProps {
  panel: MultiAgentPanel;
}

export function AgentPanel({ panel }: AgentPanelProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{panel.label}</p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">{panel.agentId}</p>
        </div>
        <AgentStatusBadge status={panel.status} />
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Findings
        </p>
        {panel.findings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/[0.08] bg-black/[0.55] px-4 py-6 text-center text-sm text-slate-500">
            No findings yet — run the multi-agent investigation to populate this panel.
          </p>
        ) : (
          panel.findings.map((finding) => (
            <AgentFindingCard key={finding.id} finding={finding} />
          ))
        )}
      </div>
    </section>
  );
}
