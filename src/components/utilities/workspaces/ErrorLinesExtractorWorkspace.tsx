import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { MOCK_EXTRACTED_ERROR_LINES, MOCK_NOISY_LOG } from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";

export function ErrorLinesExtractorWorkspace() {
  const [log, setLog] = useState(MOCK_NOISY_LOG);
  const [extracted, setExtracted] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const handleRun = () => {
    run(() => setExtracted(true));
  };

  return (
    <>
      <UtilityPanel title="Noisy log input">
        <textarea
          value={log}
          onChange={(e) => setLog(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-lg border border-white/[0.1] bg-surface-960/90 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-slate-300 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
        />
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!log.trim()}>
            Extract error lines
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Extracted lines" className={cn(!extracted && "opacity-80")}>
        {!extracted ? (
          <p className="text-sm text-slate-500">
            High-signal ERROR lines only — triage before RCA (mock list).
          </p>
        ) : (
          <ul className="space-y-2">
            {MOCK_EXTRACTED_ERROR_LINES.map((line, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2 font-mono text-[11px] text-amber-100/90"
              >
                <span className="shrink-0 text-amber-500/70">{i + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </UtilityPanel>
    </>
  );
}
