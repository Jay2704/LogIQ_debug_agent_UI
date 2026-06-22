import { Loader2, RefreshCw, Search } from "lucide-react";
import type { SimilarHistoricalInvestigation } from "@/types";
import { cn } from "@/lib/utils";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { SimilarIncidentCard } from "./SimilarIncidentCard";

interface SimilarIncidentListProps {
  incidents: SimilarHistoricalInvestigation[] | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function SimilarIncidentList({
  incidents,
  loading = false,
  error = null,
  onRetry,
  className,
}: SimilarIncidentListProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-slate-700/50 bg-black/[0.82] px-4 py-10",
          className
        )}
      >
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Searching historical investigations…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-5 text-sm text-red-100/90",
          className
        )}
      >
        <p>{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white ring-1 ring-blue-400/35",
              ctaButtonGradient,
              ctaGlowBlueOnly
            )}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry search
          </button>
        ) : null}
      </div>
    );
  }

  if (!incidents?.length) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-slate-700/50 bg-black/[0.82] px-4 py-8 text-center",
          className
        )}
      >
        <Search className="mx-auto h-5 w-5 text-slate-600" aria-hidden />
        <p className="mt-3 text-sm text-slate-500">
          No similar historical investigations matched this pattern yet.
        </p>
      </div>
    );
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {incidents.map((incident) => (
        <li key={incident.investigationId}>
          <SimilarIncidentCard incident={incident} />
        </li>
      ))}
    </ul>
  );
}
