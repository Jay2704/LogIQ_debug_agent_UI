import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";
import type { UtilityWorkspaceInputProps } from "@/components/utilities/UtilityWorkspaceView";

export function ErrorSplitterWorkspace({ logLines, hasUploadedLog }: UtilityWorkspaceInputProps) {
  const [split, setSplit] = useState(false);
  const { running, run } = useSimulatedUtilityRun();
  const errorLines = logLines.filter((line) => /error|exception|fail/i.test(line));
  const nonErrorLines = logLines.filter((line) => !/error|exception|fail/i.test(line));

  const handleRun = () => {
    run(() => setSplit(true));
  };

  return (
    <>
      <UtilityPanel title="Apply utility">
        <p className="text-sm text-slate-400">
          Split uploaded log lines into error and non-error groups.
        </p>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running} disabled={!hasUploadedLog}>
            Split errors / non-errors
          </UtilityRunButton>
        </div>
      </UtilityPanel>

      <div
        className={cn(
          "grid gap-4 md:grid-cols-2",
          !split && "opacity-75"
        )}
      >
        <UtilityPanel title="Errors">
          {!split ? (
            <p className="text-sm text-slate-500">Run to populate.</p>
          ) : (
            <ul className="space-y-2">
              {errorLines.map((line, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-red-200/90"
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
        </UtilityPanel>
        <UtilityPanel title="Non-errors">
          {!split ? (
            <p className="text-sm text-slate-500">Run to populate.</p>
          ) : (
            <ul className="space-y-2">
              {nonErrorLines.map((line, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-white/[0.06] bg-black/[0.92] px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-slate-400"
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
        </UtilityPanel>
      </div>
    </>
  );
}
