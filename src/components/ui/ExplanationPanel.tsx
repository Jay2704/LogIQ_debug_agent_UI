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
        "rounded-card border border-white/[0.06] bg-surface-900/60 p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2 text-violet-300">
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <h3 className="text-sm font-semibold">AI Explanation</h3>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
        {content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
