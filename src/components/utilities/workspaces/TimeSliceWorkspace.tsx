import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

export function TimeSliceWorkspace({ logLines, hasUploadedLog }: UtilityWorkspaceInputProps) {
  const [start, setStart] = useState("2026-03-29T14:22:02");
  const [end, setEnd] = useState("2026-03-29T14:22:04");
  const [showPreview, setShowPreview] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const handleRun = () => {
    run(() => setShowPreview(true));
  };

  return (
    <>
      <UtilityPanel title="Time window">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-400">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-black/[0.92] px-3 py-2 font-mono text-xs text-slate-200 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-black/[0.92] px-3 py-2 font-mono text-xs text-slate-200 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
            />
          </div>
        </div>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Apply slice
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Filtered log" className={cn(!showPreview && "opacity-80")}>
        {!showPreview ? (
          <p className="text-sm text-slate-500">
            Apply a time window to preview uploaded lines in the chosen incident range.
          </p>
        ) : (
          <pre className="max-h-56 overflow-auto rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] p-3 font-mono text-[11px] leading-relaxed text-slate-300">
            {logLines.slice(0, Math.min(logLines.length, 25)).join("\n")}
          </pre>
        )}
      </UtilityPanel>
    </>
  );
}
