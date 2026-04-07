import { useRef, useState } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import type { UtilityToolDefinition } from "@/types";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { LogViewer } from "@/components/utilities/LogViewer";
import { KeywordSearchWorkspace } from "@/components/utilities/workspaces/KeywordSearchWorkspace";
import { TimeSliceWorkspace } from "@/components/utilities/workspaces/TimeSliceWorkspace";
import { ErrorSplitterWorkspace } from "@/components/utilities/workspaces/ErrorSplitterWorkspace";
import { LogSummaryWorkspace } from "@/components/utilities/workspaces/LogSummaryWorkspace";
import { StackTraceParserWorkspace } from "@/components/utilities/workspaces/StackTraceParserWorkspace";
import { ErrorLinesExtractorWorkspace } from "@/components/utilities/workspaces/ErrorLinesExtractorWorkspace";
import { RootCauseHeuristicsWorkspace } from "@/components/utilities/workspaces/RootCauseHeuristicsWorkspace";
import {
  parseUploadedLogFile,
  SUPPORTED_LOG_EXTENSIONS,
} from "@/lib/logFileUpload";

interface UploadedLogState {
  fileName: string;
  content: string;
  lines: string[];
}

export interface UtilityWorkspaceInputProps {
  logContent: string;
  logLines: string[];
  hasUploadedLog: boolean;
}

function UtilityLogUploadPanel({
  uploadedLog,
  warning,
  error,
  onPickFile,
}: {
  uploadedLog: UploadedLogState | null;
  warning: string | null;
  error: string | null;
  onPickFile: () => void;
}) {
  return (
    <>
      <UtilityPanel title="Upload log file">
        <button
          type="button"
          onClick={onPickFile}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/25"
        >
          <Upload className="h-4 w-4" />
          Upload Log File
        </button>
        <p className="mt-2 text-xs text-slate-500">Supported: .log, .txt, .csv</p>
        {uploadedLog && (
          <p className="mt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">{uploadedLog.fileName}</span> loaded (
            {uploadedLog.lines.length.toLocaleString()} lines)
          </p>
        )}
        {warning && (
          <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-200">
            {warning}
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}
      </UtilityPanel>

      <UtilityPanel title="Uploaded log preview (full file)">
        {!uploadedLog ? (
          <p className="text-sm text-slate-500">Upload a log file to preview and enable utilities.</p>
        ) : uploadedLog.lines.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            Uploaded file is empty.
          </p>
        ) : (
          <LogViewer
            entries={uploadedLog.lines.map((line, index) => ({
              lineNumber: index + 1,
              line,
            }))}
          />
        )}
      </UtilityPanel>
    </>
  );
}

export function UtilityWorkspaceView({ tool }: { tool: UtilityToolDefinition }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedLog, setUploadedLog] = useState<UploadedLogState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const onPickFile = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    setError(null);
    setWarning(null);
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !SUPPORTED_LOG_EXTENSIONS.some((allowed) => allowed === ext)) {
      setUploadedLog(null);
      setError("Unsupported file type. Please upload a .log, .txt, or .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setWarning("Large file detected (>5MB). Preview and utility actions may be slower.");
    }

    void parseUploadedLogFile(file)
      .then((parsed) => {
        setUploadedLog(parsed);
        if (parsed.lines.length === 0) {
          setWarning("Uploaded file is empty.");
        }
      })
      .catch(() => {
        setUploadedLog(null);
        setError("Failed to read file. Please try again.");
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  const workspaceProps: UtilityWorkspaceInputProps = {
    logContent: uploadedLog?.content ?? "",
    logLines: uploadedLog?.lines ?? [],
    hasUploadedLog: Boolean(uploadedLog && uploadedLog.lines.length > 0),
  };

  const sharedPanels = (
    <UtilityLogUploadPanel
      uploadedLog={uploadedLog}
      warning={warning}
      error={error}
      onPickFile={onPickFile}
    />
  );

  switch (tool.id) {
    case "keyword-search":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <KeywordSearchWorkspace {...workspaceProps} />
        </>
      );
    case "time-slice-filter":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <TimeSliceWorkspace {...workspaceProps} />
        </>
      );
    case "error-splitter":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <ErrorSplitterWorkspace {...workspaceProps} />
        </>
      );
    case "log-summary":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <LogSummaryWorkspace {...workspaceProps} />
        </>
      );
    case "stack-trace-parser":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <StackTraceParserWorkspace {...workspaceProps} />
        </>
      );
    case "error-lines-extractor":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <ErrorLinesExtractorWorkspace {...workspaceProps} />
        </>
      );
    case "root-cause-heuristics":
      return (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv,text/plain,text/csv"
            onChange={onFileSelected}
            className="hidden"
          />
          {sharedPanels}
          <RootCauseHeuristicsWorkspace {...workspaceProps} />
        </>
      );
    default:
      return (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-5 text-sm text-slate-400">
          No workspace UI is registered for <span className="font-mono text-slate-300">{tool.id}</span>.
        </div>
      );
  }
}
