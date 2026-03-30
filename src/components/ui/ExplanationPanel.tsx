import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplanationPanelProps {
  content: string;
  className?: string;
}

export function ExplanationPanel({ content, className }: ExplanationPanelProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-slate-600/50 bg-surface-975/50 p-5 shadow-inner",
        "ring-1 ring-inset ring-white/[0.03]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-500">
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-400">
            AI Explanation{" "}
            <span className="font-normal text-slate-600">(Assistive Layer)</span>
          </h3>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Narrative synthesis for faster comprehension — does not override
            deterministic evidence or Confidence Score above.
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-white/[0.05] pt-4">
        <div className="space-y-3 text-sm leading-relaxed text-slate-500">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
