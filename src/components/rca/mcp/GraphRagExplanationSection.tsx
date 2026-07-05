import { Network, Ticket, GitPullRequest, GitCommitHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraphRagExplanationSectionProps {
  explanation: string;
  className?: string;
}

const GRAPH_EDGES = [
  { from: "Investigation", to: "JiraTicket", icon: Ticket },
  { from: "Investigation", to: "PullRequest", icon: GitPullRequest },
  { from: "Investigation", to: "Commit", icon: GitCommitHorizontal },
] as const;

export function GraphRagExplanationSection({
  explanation,
  className,
}: GraphRagExplanationSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <Network className="h-5 w-5 text-emerald-300" strokeWidth={2} aria-hidden />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300/85">
            GraphRAG explanation
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Neo4j-linked narrative with Jira and GitHub citations.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-500/15 bg-black/[0.55] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Neo4j graph
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {GRAPH_EDGES.map(({ from, to, icon: Icon }) => (
            <li
              key={`${from}-${to}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-black/[0.7] px-2.5 py-1.5 text-[11px] text-slate-300"
            >
              <Icon className="h-3.5 w-3.5 text-emerald-400/90" aria-hidden />
              <span className="font-mono text-slate-400">{from}</span>
              <span className="text-slate-600">→</span>
              <span className="font-mono text-emerald-200/90">{to}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">{explanation}</p>
    </section>
  );
}
