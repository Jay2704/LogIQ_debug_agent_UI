import { useState } from "react";
import { FileText } from "lucide-react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { MOCK_LOG_SUMMARY_OUTPUT, MOCK_SOURCE_LOG } from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";

export function LogSummaryWorkspace() {
  const [text, setText] = useState(MOCK_SOURCE_LOG);
  const [summary, setSummary] = useState<string | null>(null);
  const { running, run } = useSimulatedUtilityRun(550);

  const handleRun = () => {
    run(() => setSummary(MOCK_LOG_SUMMARY_OUTPUT));
  };

  return (
    <>
      <UtilityPanel title="Log input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-lg border border-white/[0.1] bg-surface-960/90 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-slate-300 placeholder:text-slate-600 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
          placeholder="Paste raw logs…"
        />
        <p className="mt-2 text-[11px] text-slate-500">
          {text.length.toLocaleString()} characters · mock client only
        </p>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!text.trim()}>
            Summarize
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Summary" className={cn(!summary && "opacity-80")}>
        {!summary ? (
          <p className="text-sm text-slate-500">
            Generate a concise narrative of patterns and failure hints (static mock).
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
