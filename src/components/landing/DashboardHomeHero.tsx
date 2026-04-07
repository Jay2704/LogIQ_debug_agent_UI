import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  PlayCircle,
  SearchCheck,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { HeroAmbientGlow } from "@/components/landing/HeroAmbientGlow";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { LogViewer } from "@/components/utilities/LogViewer";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { parseUploadedLogFile, SUPPORTED_LOG_EXTENSIONS } from "@/lib/logFileUpload";
import { cn } from "@/lib/utils";
import type { JiraRcaResult, JiraTicketSummary } from "@/types";

const TICKET_KEY_PATTERN = /^[A-Z][A-Z0-9]+-\d+$/;

function mapTicketError(message: string): string {
  const safe = message.trim();
  const lower = safe.toLowerCase();
  if (lower.includes("network error (no response)")) {
    return "Network error while fetching ticket details. Check backend reachability and try again.";
  }
  const status = safe.match(/\b(\d{3})\b/)?.[1];
  if (status === "400") {
    return "Invalid ticket key format. Use a key like LOG-123.";
  }
  if (status === "404") {
    return "Ticket not found in JIRA.";
  }
  if (status === "401" || status === "403") {
    return "JIRA auth/config issue detected. Verify backend JIRA credentials and permissions.";
  }
  if (status === "500" || status === "502" || status === "503") {
    return "JIRA integration is unavailable right now. Please retry in a moment.";
  }
  return safe || "Could not fetch ticket details.";
}

/**
 * Marketing-style hero for the authenticated home dashboard (no duplicate app chrome — Topbar remains).
 */
export function DashboardHomeHero() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ticketKey, setTicketKey] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<JiraTicketSummary | null>(null);
  const [logName, setLogName] = useState<string | null>(null);
  const [logContent, setLogContent] = useState("");
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logError, setLogError] = useState<string | null>(null);
  const [confirmedLogInput, setConfirmedLogInput] = useState(false);
  const [rcaLoading, setRcaLoading] = useState(false);
  const [rcaError, setRcaError] = useState<string | null>(null);
  const [rcaResult, setRcaResult] = useState<JiraRcaResult | null>(null);

  const canRunRca = Boolean(ticket && confirmedLogInput && logContent.trim());
  const previewLines = logLines.slice(0, 18);
  const hasStrongCandidate = Boolean(
    rcaResult?.rootCause && !/not returned|no strong candidate/i.test(rcaResult.rootCause)
  );
  const workflowStageLabel = rcaLoading
    ? "RCA running"
    : rcaResult
      ? "RCA complete"
      : ticket
        ? logContent.trim()
          ? "Logs uploaded"
          : "Ticket loaded"
        : "Waiting for ticket";

  async function handleFetchTicket() {
    const normalized = ticketKey.trim().toUpperCase();
    if (!TICKET_KEY_PATTERN.test(normalized)) {
      setTicketError("Invalid ticket key format. Use a key like LOG-123.");
      setTicket(null);
      return;
    }

    setTicketLoading(true);
    setTicketError(null);
    try {
      const payload = await api.jira.getTicketSummary(normalized);
      setTicket(payload);
      setRcaResult(null);
      setRcaError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setTicket(null);
      setTicketError(mapTicketError(msg));
    } finally {
      setTicketLoading(false);
    }
  }

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    setLogError(null);
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !SUPPORTED_LOG_EXTENSIONS.some((allowed) => allowed === ext)) {
      setLogName(null);
      setLogContent("");
      setLogLines([]);
      setConfirmedLogInput(false);
      setLogError("Unsupported file type. Please upload a .log, .txt, or .csv file.");
      return;
    }

    void parseUploadedLogFile(file)
      .then((parsed) => {
        setLogName(parsed.fileName);
        setLogContent(parsed.content);
        setLogLines(parsed.lines);
        setConfirmedLogInput(false);
        setRcaResult(null);
        setRcaError(null);
        if (parsed.lines.length === 0) {
          setLogError("Uploaded file is empty.");
        }
      })
      .catch((e) => {
        setLogName(null);
        setLogContent("");
        setLogLines([]);
        setConfirmedLogInput(false);
        setLogError(e instanceof Error ? e.message : "Failed to read file. Please try again.");
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  async function handleRunRca() {
    if (!ticket) {
      setRcaError("Load a ticket before running RCA.");
      return;
    }
    if (!logContent.trim()) {
      setRcaError("Upload a non-empty log file before running RCA.");
      return;
    }
    if (!confirmedLogInput) {
      setRcaError("Confirm the uploaded logs as RCA input before running.");
      return;
    }

    setRcaLoading(true);
    setRcaError(null);
    try {
      const res = await api.jira.runRcaWithTicket({
        ticket,
        logContent,
      });
      setRcaResult(res);
      if (!res.rootCause.trim()) {
        setRcaError(
          "RCA completed but no strong candidate was returned. Review signals and try a richer log sample."
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setRcaError(
        msg.toLowerCase().includes("network error (no response)")
          ? "Network error while running RCA. Verify backend reachability and retry."
          : msg
      );
      setRcaResult(null);
    } finally {
      setRcaLoading(false);
    }
  }

  return (
    <section className="hero-glow-panel relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-surface-900/95 via-[#0a1020] to-surface-975 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_24px_64px_-32px_rgba(0,0,0,0.55)] sm:p-10">
      <HeroAmbientGlow variant="dashboard" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="flex justify-center py-2">
          <LogIQFullLogo className="mx-auto max-h-[9rem] max-w-[min(880px,94vw)] object-contain sm:max-h-40 lg:max-h-48" />
        </div>
        <span className="mt-10 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200/95 ring-1 ring-sky-500/20">
          AI-Agent powered Deterministic Root Cause Analysis and remediation
        </span>
        <h1 className="gradient-text mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight">
          Debug production issues in seconds, not hours
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
          Upload logs, trace anomalies, and uncover root cause instantly — all in one intelligent
          debugging workspace.
        </p>
        <div className="mt-8 rounded-2xl border border-sky-500/20 bg-surface-975/65 p-4 text-left shadow-[0_0_0_1px_rgba(56,189,248,0.08)] sm:p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200/95">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                rcaLoading
                  ? "animate-pulse bg-amber-300"
                  : rcaResult
                    ? "bg-emerald-300"
                    : ticket
                      ? "bg-sky-300"
                      : "bg-slate-500"
              )}
            />
            Current stage: {workflowStageLabel}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { k: "01", label: "Ticket loaded", done: Boolean(ticket), active: ticketLoading },
              { k: "02", label: "Logs uploaded", done: Boolean(logContent.trim()), active: false },
              { k: "03", label: "Preview confirmed", done: confirmedLogInput, active: false },
              { k: "04", label: "RCA running", done: Boolean(rcaResult), active: rcaLoading },
              { k: "05", label: "RCA complete", done: Boolean(rcaResult), active: false },
            ].map((step) => (
              <span
                key={step.k}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em]",
                  step.done
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                    : step.active
                      ? "border-amber-500/45 bg-amber-500/20 text-amber-200"
                    : "border-white/[0.12] bg-surface-900/60 text-slate-400"
                )}
              >
                {step.k} {step.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-500/35 bg-sky-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200/95">
              Step 1
            </span>
            <p className="text-sm font-semibold text-white">
              Start investigation from a JIRA ticket
            </p>
          </div>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Enter a ticket key to load normalized issue context before running RCA.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="jira-ticket-key">
              JIRA ticket key
            </label>
            <input
              id="jira-ticket-key"
              value={ticketKey}
              onChange={(e) => setTicketKey(e.target.value.toUpperCase())}
              placeholder="LOG-123"
              className="w-full rounded-xl border border-white/[0.12] bg-surface-900/80 px-3.5 py-2.5 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
            />
            <button
              type="button"
              onClick={() => void handleFetchTicket()}
              disabled={ticketLoading}
              className={cn(
                "inline-flex min-w-[10.5rem] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35"
              )}
            >
              {ticketLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchCheck className="h-4 w-4" />
              )}
              {ticketLoading ? "Fetching..." : "Fetch Ticket"}
            </button>
          </div>
          {ticketError ? (
            <div
              className="mt-3 inline-flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-100/90"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
              <span>{ticketError}</span>
            </div>
          ) : null}
          {ticket ? (
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-surface-900/55 p-4 ring-1 ring-white/[0.04]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm font-semibold text-sky-300">{ticket.key}</p>
                <span className="rounded-full border border-white/[0.12] bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                  {ticket.status}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">{ticket.summary}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full border border-violet-500/35 bg-violet-500/10 px-2 py-0.5 font-semibold text-violet-200">
                  Priority: {ticket.priority}
                </span>
                {ticket.labels.length > 0
                  ? ticket.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-slate-500/35 bg-slate-500/10 px-2 py-0.5 text-slate-300"
                      >
                        {label}
                      </span>
                    ))
                  : null}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {ticket.cleanedDescription || "No cleaned description returned by backend."}
              </p>
              {ticket.extractedHints.length > 0 ? (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Extracted hints
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                    {ticket.extractedHints.slice(0, 4).map((hint) => (
                      <li key={hint} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-surface-900/55 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.16] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Step 2-3
              </span>
              <p className="text-sm font-semibold text-white">Upload and preview logs</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".log,.txt,.csv,text/plain,text/csv"
              onChange={onFileSelected}
              className="hidden"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!ticket}
                onClick={onPickFile}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border border-sky-500/35 bg-sky-500/15 px-3.5 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Log File
              </button>
              {logName ? (
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  {logName} ({logLines.length.toLocaleString()} lines)
                </span>
              ) : null}
            </div>
            {!ticket ? (
              <p className="mt-2 text-xs text-slate-500">Fetch a JIRA ticket first to enable log intake.</p>
            ) : null}
            {ticket && !logContent.trim() ? (
              <p className="mt-2 text-xs text-slate-500">
                No logs uploaded yet. Upload a file to continue the investigation workflow.
              </p>
            ) : null}
            {logError ? (
              <p className="mt-2 inline-flex rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
                {logError}
              </p>
            ) : null}
            {previewLines.length > 0 ? (
              <>
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Preview (first lines)
                  </p>
                  <div className="mt-2">
                    <LogViewer
                      entries={previewLines.map((line, index) => ({
                        lineNumber: index + 1,
                        line,
                      }))}
                    />
                  </div>
                </div>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={confirmedLogInput}
                    onChange={(e) => setConfirmedLogInput(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-surface-900"
                  />
                  Confirm this log file as RCA input
                </label>
              </>
            ) : null}
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-surface-900/55 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.16] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Step 4
              </span>
              <p className="text-sm font-semibold text-white">Run RCA</p>
            </div>
            <button
              type="button"
              disabled={!canRunRca || rcaLoading}
              onClick={() => void handleRunRca()}
              className={cn(
                "mt-3 inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35"
              )}
            >
              {rcaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
              {rcaLoading ? "Running RCA..." : "Run RCA"}
            </button>
            {rcaError ? (
              <div className="mt-3 inline-flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-100/90">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                <span>{rcaError}</span>
              </div>
            ) : null}
            {!rcaResult && !rcaLoading ? (
              <p className="mt-3 text-xs text-slate-500">
                RCA result will appear here after ticket + logs are ready and you run the analysis.
              </p>
            ) : null}
          </div>

          {rcaResult ? (
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4 ring-1 ring-emerald-500/10">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
                  Step 5
                </span>
                <p className="text-sm font-semibold text-white">RCA result</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="mt-3 rounded-lg border border-white/[0.08] bg-surface-900/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Root cause</p>
                <p className="mt-1 text-sm text-slate-100">
                  {hasStrongCandidate
                    ? rcaResult.rootCause
                    : "No strong candidate returned by backend. Review supporting signals and retry with broader logs."}
                </p>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-white/[0.08] bg-surface-900/65 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Evidence summary
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    {rcaResult.evidenceSummary.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-surface-900/65 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Extracted log signals
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    {rcaResult.extractedLogSignals.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-white/[0.08] bg-surface-900/65 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Ticket context
                  </p>
                  {ticket ? (
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      <li>
                        <span className="text-slate-500">Key:</span> {ticket.key}
                      </li>
                      <li>
                        <span className="text-slate-500">Summary:</span> {ticket.summary}
                      </li>
                      <li>
                        <span className="text-slate-500">Status/Priority:</span> {ticket.status} /{" "}
                        {ticket.priority}
                      </li>
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">Ticket context unavailable.</p>
                  )}
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-surface-900/65 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Uploaded log summary
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    <li>
                      <span className="text-slate-500">File:</span> {logName ?? "—"}
                    </li>
                    <li>
                      <span className="text-slate-500">Lines:</span> {logLines.length.toLocaleString()}
                    </li>
                    <li>
                      <span className="text-slate-500">Previewed:</span> first{" "}
                      {Math.min(18, logLines.length)} lines
                    </li>
                  </ul>
                </div>
              </div>
              {rcaResult.explanation ? (
                <div className="mt-3 rounded-lg border border-white/[0.08] bg-surface-900/65 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Explanation
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{rcaResult.explanation}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/jobs"
            className={cn(
              "cta-shimmer-primary inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/35",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
            )}
          >
            <span className="relative z-10">Try Demo</span>
          </Link>
          <a
            href="#workspace-explore"
            className={cn(
              "cta-shimmer-secondary inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-surface-900/50 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition",
              "hover:border-sky-500/30 hover:bg-surface-900/75 hover:text-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
            )}
          >
            <span className="relative z-10">Explore Features</span>
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-4xl">
        <ProductPreviewCard />
      </div>
    </section>
  );
}
