import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplanationPanelProps {
  content: string;
  className?: string;
  /** default = standard card; emphasis = portfolio hero for AI secondary panel */
  variant?: "default" | "emphasis";
}

export function ExplanationPanel({
  content,
  className,
  variant = "default",
}: ExplanationPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed shadow-inner ring-1 ring-inset ring-white/[0.04]",
        variant === "emphasis"
          ? "border-amber-500/35 bg-gradient-to-br from-amber-500/[0.08] via-surface-925/95 to-surface-975 p-6 sm:p-8"
          : "border-slate-600/50 bg-surface-975/50 p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
            variant === "emphasis"
              ? "bg-gradient-to-br from-amber-500/25 to-orange-600/15 ring-amber-400/35"
              : "bg-slate-800/80 ring-slate-600/40"
          )}
        >
          <Sparkles
            className={cn(
              "h-6 w-6",
              variant === "emphasis" ? "text-amber-200" : "text-slate-500"
            )}
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400/90">
            Assistive layer
          </p>
          <h3
            className={cn(
              "mt-1 font-bold tracking-tight text-white",
              variant === "emphasis" ? "text-2xl sm:text-3xl" : "text-sm"
            )}
          >
            AI Explanation
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Narrative synthesis for faster comprehension — does not override
            deterministic evidence or the confidence score above.
          </p>
        </div>
      </div>
      <div className="mt-6 border-t border-white/[0.06] pt-6">
        <div className="space-y-4 text-sm leading-relaxed text-slate-400">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
