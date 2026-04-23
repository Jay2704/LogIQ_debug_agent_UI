import { FileSearch } from "lucide-react";
import type { EvidenceItem } from "@/types";
import { cn } from "@/lib/utils";

interface EvidenceListProps {
  items: EvidenceItem[];
  className?: string;
}

export function EvidenceList({ items, className }: EvidenceListProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-sky-500/20 bg-gradient-to-b from-black/[0.85] to-black/[0.96] p-5 shadow-card",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/30">
            <FileSearch className="h-4 w-4 text-sky-400" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Evidence Highlights</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Grounded artifacts supporting the Deterministic Root Cause — traces,
              metrics, deploys, and datastore signals.
            </p>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-700/60 bg-black/[0.94] px-4 py-6 text-center text-sm text-slate-500">
          No evidence items attached yet. Complete the evidence step to populate
          this list.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-xl border border-blue-500/[0.12] bg-[#060a12]/80 shadow-inner"
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.05] px-3 py-2 font-mono text-[10px] text-slate-500">
                <span className="rounded bg-black/[0.85] px-1.5 py-0.5 text-sky-500/90">
                  EVIDENCE_{String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-600">·</span>
                <span className="uppercase tracking-wide text-slate-500">
                  source
                </span>
                <span className="text-slate-400">{item.source}</span>
              </div>
              <div className="px-3 py-3">
                <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
