import type { UtilityToolDefinition } from "@/types";
import { KeywordSearchWorkspace } from "@/components/utilities/workspaces/KeywordSearchWorkspace";
import { TimeSliceWorkspace } from "@/components/utilities/workspaces/TimeSliceWorkspace";
import { ErrorSplitterWorkspace } from "@/components/utilities/workspaces/ErrorSplitterWorkspace";
import { LogSummaryWorkspace } from "@/components/utilities/workspaces/LogSummaryWorkspace";
import { StackTraceParserWorkspace } from "@/components/utilities/workspaces/StackTraceParserWorkspace";
import { ErrorLinesExtractorWorkspace } from "@/components/utilities/workspaces/ErrorLinesExtractorWorkspace";
import { RootCauseHeuristicsWorkspace } from "@/components/utilities/workspaces/RootCauseHeuristicsWorkspace";

export function UtilityWorkspaceView({ tool }: { tool: UtilityToolDefinition }) {
  switch (tool.id) {
    case "keyword-search":
      return <KeywordSearchWorkspace />;
    case "time-slice-filter":
      return <TimeSliceWorkspace />;
    case "error-splitter":
      return <ErrorSplitterWorkspace />;
    case "log-summary":
      return <LogSummaryWorkspace />;
    case "stack-trace-parser":
      return <StackTraceParserWorkspace />;
    case "error-lines-extractor":
      return <ErrorLinesExtractorWorkspace />;
    case "root-cause-heuristics":
      return <RootCauseHeuristicsWorkspace />;
    default:
      return (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-5 text-sm text-slate-400">
          No workspace UI is registered for <span className="font-mono text-slate-300">{tool.id}</span>.
        </div>
      );
  }
}
