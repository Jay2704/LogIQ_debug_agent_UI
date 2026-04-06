import { useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import type { UtilityToolDefinition } from "@/types";
import { UtilityPanel } from "@/components/utilities/UtilityToolLayout";
import { KeywordSearchWorkspace } from "@/components/utilities/workspaces/KeywordSearchWorkspace";
import { TimeSliceWorkspace } from "@/components/utilities/workspaces/TimeSliceWorkspace";
import { ErrorSplitterWorkspace } from "@/components/utilities/workspaces/ErrorSplitterWorkspace";
import { LogSummaryWorkspace } from "@/components/utilities/workspaces/LogSummaryWorkspace";
import { StackTraceParserWorkspace } from "@/components/utilities/workspaces/StackTraceParserWorkspace";
import { ErrorLinesExtractorWorkspace } from "@/components/utilities/workspaces/ErrorLinesExtractorWorkspace";
import { RootCauseHeuristicsWorkspace } from "@/components/utilities/workspaces/RootCauseHeuristicsWorkspace";

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

const LOG_LEVEL_REGEX = /\b(ERROR|WARN|INFO|DEBUG)\b/g;

function levelClass(level: string) {
  switch (level) {
    case "ERROR":
      return "log-error";
    case "WARN":
      return "log-warn";
    case "INFO":
      return "log-info";
    case "DEBUG":
      return "log-debug";
    default:
      return "";
  }
}

function renderHighlightedLogLine(line: string) {
  const matches = [...line.matchAll(LOG_LEVEL_REGEX)];
  if (matches.length === 0) return <span>{line || " "}</span>;

  const chunks: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > cursor) {
      chunks.push(
        <span key={`plain-${index}-${start}`}>{line.slice(cursor, start)}</span>
      );
    }
    chunks.push(
      <span key={`level-${index}-${start}`} className={levelClass(token)}>
        {token}
      </span>
    );
    cursor = start + token.length;
  });
  if (cursor < line.length) {
    chunks.push(<span key={`tail-${cursor}`}>{line.slice(cursor)}</span>);
  }
  return chunks;
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
          <ol className="h-96 w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-black/35 p-4 font-mono text-[11px] leading-relaxed text-slate-300 shadow-inner">
            {uploadedLog.lines.map((line, index) => (
              <li key={`${index}-${line}`} className="flex gap-3">
                <span className="w-8 shrink-0 text-right text-slate-500">{index + 1}</span>
                <span className="whitespace-pre-wrap break-words">
                  {renderHighlightedLogLine(line)}
                </span>
              </li>
            ))}
          </ol>
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
    if (!ext || !["log", "txt", "csv"].includes(ext)) {
      setUploadedLog(null);
      setError("Unsupported file type. Please upload a .log, .txt, or .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setWarning("Large file detected (>5MB). Preview and utility actions may be slower.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const normalized = content.replace(/\r\n/g, "\n");
      const lines = normalized.length > 0 ? normalized.split("\n") : [];
      setUploadedLog({
        fileName: file.name,
        content: normalized,
        lines,
      });
      if (lines.length === 0) {
        setWarning("Uploaded file is empty.");
      }
    };
    reader.onerror = () => {
      setUploadedLog(null);
      setError("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
    event.target.value = "";
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
