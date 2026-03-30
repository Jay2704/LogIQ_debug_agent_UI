import { useState } from "react";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { UtilityRunButton } from "@/components/utilities/UtilityRunButton";
import {
  MOCK_ERROR_LINES,
  MOCK_NON_ERROR_LINES,
  MOCK_SOURCE_LOG,
} from "@/data/mock/utilityWorkspaceMocks";
import { useSimulatedUtilityRun } from "@/hooks/useSimulatedUtilityRun";
import { cn } from "@/lib/utils";

export function ErrorSplitterWorkspace() {
  const [split, setSplit] = useState(false);
  const { running, run } = useSimulatedUtilityRun();

  const handleRun = () => {
    run(() => setSplit(true));
  };

  return (
    <>
      <UtilityPanel title="Source log">
        <pre className="max-h-48 overflow-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
          {MOCK_SOURCE_LOG}
        </pre>
        <div className="mt-5">
          <UtilityRunButton onClick={handleRun} loading={running}>
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
            <p className="text-sm text-slate-500">Run to populate (mock).</p>
          ) : (
            <ul className="space-y-2">
              {MOCK_ERROR_LINES.map((line, i) => (
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
            <p className="text-sm text-slate-500">Run to populate (mock).</p>
          ) : (
            <ul className="space-y-2">
              {MOCK_NON_ERROR_LINES.map((line, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-white/[0.06] bg-surface-960/60 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-slate-400"
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
