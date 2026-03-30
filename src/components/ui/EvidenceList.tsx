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
        "rounded-card border border-white/[0.06] bg-surface-900/60 p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2 text-slate-200">
        <FileSearch className="h-4 w-4 text-blue-400" strokeWidth={2} />
        <h3 className="text-sm font-semibold">Evidence Highlights</h3>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No evidence items attached yet. Complete the evidence step to populate
          this list.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-white/[0.05] bg-surface-850/40 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-200">
                  {item.label}
                </span>
                <span className="rounded-md bg-surface-700/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  {item.source}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
