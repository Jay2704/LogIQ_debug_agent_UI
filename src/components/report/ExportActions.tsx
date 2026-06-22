import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import {
  downloadInvestigationReportMarkdown,
  downloadInvestigationReportPdf,
} from "@/lib/reportExport";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { InvestigationReport } from "@/types";

interface ExportActionsProps {
  report: InvestigationReport;
  refreshing?: boolean;
  onRefresh: () => void;
}

export function ExportActions({
  report,
  refreshing = false,
  onRefresh,
}: ExportActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => downloadInvestigationReportPdf(report)}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
          ctaButtonGradient,
          ctaGlowBlueOnly
        )}
      >
        <Download className="h-4 w-4" aria-hidden />
        Download PDF
      </button>
      <button
        type="button"
        onClick={() => downloadInvestigationReportMarkdown(report)}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-200 transition hover:border-indigo-400/45 hover:bg-indigo-500/15 hover:text-white"
      >
        <FileText className="h-4 w-4" aria-hidden />
        Download Markdown
      </button>
      <button
        type="button"
        disabled={refreshing}
        onClick={onRefresh}
        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.94] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/[0.2] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <RefreshCw className="h-4 w-4" aria-hidden />
        )}
        Refresh Report
      </button>
    </div>
  );
}
