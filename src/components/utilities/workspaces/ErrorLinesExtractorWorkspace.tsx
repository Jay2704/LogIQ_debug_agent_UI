import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

export function ErrorLinesExtractorWorkspace({
  logLines,
  hasUploadedLog,
}: UtilityWorkspaceInputProps) {
  const [extracted, setExtracted] = useState(false);
  const { running, run } = useSimulatedUtilityRun();
  const extractedLines = logLines.filter((line) => /error|exception|fail/i.test(line));

  const handleRun = () => {
    run(() => setExtracted(true));
  };

  return (
    <>
      <UtilityPanel title="Apply utility">
        <p className="text-sm text-slate-400">
          Extract high-signal error lines from uploaded log content.
        </p>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Extract error lines
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <UtilityPanel title="Extracted lines" className={cn(!extracted && "opacity-80")}>
        {!extracted ? (
          <p className="text-sm text-slate-500">
            High-signal ERROR lines only - triage before RCA.
          </p>
        ) : (
          <ul className="space-y-2">
            {extractedLines.map((line, i) => (
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
