import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

export function LogSummaryWorkspace({
  logContent,
  logLines,
  hasUploadedLog,
}: UtilityWorkspaceInputProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const { running, run } = useSimulatedUtilityRun(550);
  const generatedSummary = useMemo(() => {
    const total = logLines.length;
    const errorCount = logLines.filter((line) => /error|exception|fail/i.test(line)).length;
    const warnCount = logLines.filter((line) => /warn/i.test(line)).length;
    const infoCount = Math.max(total - errorCount - warnCount, 0);
    return `Uploaded log contains ${total.toLocaleString()} lines. Error-like entries: ${errorCount.toLocaleString()}, warning entries: ${warnCount.toLocaleString()}, remaining informational lines: ${infoCount.toLocaleString()}.`;
  }, [logLines]);

  const handleRun = () => {
    run(() => setSummary(generatedSummary));
  };

  return (
    <>
      <UtilityPanel title="Apply utility">
        <p className="text-sm text-slate-400">Generate summary from uploaded logs.</p>
        <p className="mt-2 text-[11px] text-slate-500">
          {logContent.length.toLocaleString()} characters from uploaded file
        </p>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Summarize
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Summary" className={cn(!summary && "opacity-80")}>
        {!summary ? (
          <p className="text-sm text-slate-500">
            Generate a concise narrative of patterns and failure hints.
          </p>
        ) : (
          <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.07] to-transparent p-4">
            <div className="flex items-center gap-2 text-sky-200/90">
              <FileText className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide text-sky-400/80">
                Summary
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{summary}</p>
          </div>
        )}
      </UtilityPanel>
    </>
  );
}
