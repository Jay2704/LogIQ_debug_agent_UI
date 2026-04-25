import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  CheckCircle2,
  FileText,
  History,
  Loader2,
  PlayCircle,
  Search,
  SearchCheck,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { LogViewer } from "@/components/utilities/LogViewer";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { parseUploadedLogFile, SUPPORTED_LOG_EXTENSIONS } from "@/lib/logFileUpload";
import {
  addRecentInvestigation,
  clearRecentInvestigations,
  loadRecentInvestigations,
  type RecentInvestigationEntry,
} from "@/lib/recentInvestigations";
import { cn, formatDateTime, formatRelativeShort } from "@/lib/utils";
import type { JiraRcaResult, JiraTicketSearchHit, JiraTicketSummary } from "@/types";

const TICKET_KEY_PATTERN = /^[A-Z][A-Z0-9]+-\d+$/;

function mapTicketError(message: string): string {
  const safe = message.trim();
  const lower = safe.toLowerCase();
  if (lower.includes("network error (no response)")) {
    return "We couldn’t reach the server. Check your connection and try again.";
  }
  const status = safe.match(/\b(\d{3})\b/)?.[1];
  if (status === "400") {
    return "That doesn’t look like a valid ticket key. Try something like LOG-123.";
  }
  if (status === "404") {
    return "We couldn’t find that ticket. Check the key and try again.";
  }
  if (status === "401" || status === "403") {
    return "JIRA isn’t reachable with the current setup. Ask your admin to check JIRA access.";
  }
  if (status === "500" || status === "502" || status === "503") {
    return "JIRA is temporarily unavailable. Please try again in a moment.";
  }
  return safe || "Couldn’t load this ticket. Please try again.";
}

function mapSearchError(message: string): string {
  const safe = message.trim();
  const lower = safe.toLowerCase();
  if (lower.includes("network error (no response)")) {
    return "We couldn’t reach the server. Check your connection and try again.";
  }
  const status = safe.match(/\b(\d{3})\b/)?.[1];
  if (status === "400") {
    return "Enter a longer search term or try an exact ticket key below.";
  }
  if (status === "401" || status === "403") {
    return "JIRA search isn’t available with the current setup. Ask your admin to check JIRA access.";
  }
  if (status === "500" || status === "502" || status === "503") {
    return "JIRA search is temporarily unavailable. Please try again in a moment.";
  }
  return safe || "Search couldn’t complete. Please try again.";
}

function formatSearchHitUpdated(iso?: string): string {
  if (!iso?.trim()) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return formatDateTime(iso);
}

function mapRcaError(message: string): string {
  const safe = message.trim();
  const lower = safe.toLowerCase();
  if (lower.includes("network error (no response)")) {
    return "We couldn’t reach the server to run RCA. Check your connection and try again.";
  }
  const status = safe.match(/\b(\d{3})\b/)?.[1];
  if (status === "401" || status === "403") {
    return "RCA couldn’t run due to permissions or configuration. Ask your admin if this persists.";
  }
  if (status === "500" || status === "502" || status === "503") {
    return "RCA service is temporarily unavailable. Please try again shortly.";
  }
  if (status === "400") {
    return "The request couldn’t be processed. Check your ticket and log file, then try again.";
  }
  return safe || "RCA didn’t complete. Please try again.";
}

/**
 * Marketing-style hero for the authenticated home dashboard (no duplicate app chrome — Topbar remains).
 */
export function DashboardHomeHero() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const investigationResultsRef = useRef<HTMLDivElement | null>(null);
  const scrollRestoredInvestigationRef = useRef(false);
  const [ticketKey, setTicketKey] = useState("");
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  /** `null` = no search yet; array = last search result (may be empty). */
  const [searchResults, setSearchResults] = useState<JiraTicketSearchHit[] | null>(null);
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
  /** Soft info banner (weak RCA, restored session, etc.) — not a hard failure */
  const [workflowInfo, setWorkflowInfo] = useState<string | null>(null);
  const [rcaResult, setRcaResult] = useState<JiraRcaResult | null>(null);
  const [recentInvestigations, setRecentInvestigations] = useState<RecentInvestigationEntry[]>([]);

  const canRunRca = Boolean(ticket && confirmedLogInput && logContent.trim());
  const canUploadLogs = Boolean(ticket);
  const previewLines = logLines.slice(0, 18);
  const confidencePct =
    typeof rcaResult?.confidence === "number"
      ? Math.round(Math.max(0, Math.min(1, rcaResult.confidence)) * 100)
      : null;
  const isWeakRca = Boolean(
    rcaResult &&
      (!rcaResult.rootCause.trim() ||
        /not returned|no strong candidate/i.test(rcaResult.rootCause))
  );
  const hasStrongCandidate = Boolean(rcaResult && !isWeakRca);
  const workflowStageLabel = ticketLoading
    ? "Fetching ticket…"
    : searchLoading
      ? "Searching tickets…"
    : rcaLoading
      ? "Running RCA…"
      : rcaResult
        ? isWeakRca
          ? "RCA done (partial)"
          : "RCA complete"
        : ticket
          ? logContent.trim()
            ? confirmedLogInput
              ? "Ready to run RCA"
              : "Preview logs"
            : "Ticket loaded"
          : ticketKey.trim()
            ? "Enter ticket key"
            : "Start here";
  const nextActionHint = ticketLoading
    ? "Loading ticket details from JIRA…"
    : searchLoading
      ? "Looking for matching JIRA issues…"
    : ticketError
      ? "Fix the issue above, then fetch the ticket again."
      : !ticket
        ? "Search by key or summary, or enter an exact key and choose Fetch ticket."
        : !logContent.trim()
          ? "Upload a log file (.log, .txt, or .csv)."
          : !confirmedLogInput
            ? "Review the preview and check the box to confirm this file for RCA."
            : rcaLoading
              ? "Analysis in progress — results appear in Step 5."
              : rcaResult
                ? "Scroll down to review the result, or start a new ticket above."
                : "Choose Run RCA when you’re ready.";
  const runDisabledReason = !ticket
    ? "Load ticket first"
    : !logContent.trim()
      ? "Upload logs first"
      : !confirmedLogInput
        ? "Confirm log input"
        : null;

  useEffect(() => {
    setRecentInvestigations(loadRecentInvestigations());
  }, []);

  useEffect(() => {
    if (!scrollRestoredInvestigationRef.current || !rcaResult) return;
    scrollRestoredInvestigationRef.current = false;
    investigationResultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [rcaResult]);

  async function loadTicketByKey(normalizedKey: string) {
    setTicketLoading(true);
    setTicketError(null);
    setWorkflowInfo(null);
    try {
      const payload = await api.jira.getTicketSummary(normalizedKey);
      setTicket(payload);
      setTicketKey(normalizedKey);
      setRcaResult(null);
      setRcaError(null);
      setWorkflowInfo(null);
      setSearchResults(null);
      setSearchError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setTicket(null);
      setTicketError(mapTicketError(msg));
    } finally {
      setTicketLoading(false);
    }
  }

  async function handleFetchTicket() {
    const normalized = ticketKey.trim().toUpperCase();
    if (!TICKET_KEY_PATTERN.test(normalized)) {
      setTicketError("Invalid ticket key format. Use a key like LOG-123.");
      setTicket(null);
      return;
    }
    await loadTicketByKey(normalized);
  }

  async function handleSearchTickets() {
    const q = ticketSearchQuery.trim();
    if (q.length < 2) {
      setSearchError("Type at least 2 characters to search.");
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const hits = await api.jira.searchTickets(q);
      setSearchResults(hits);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setSearchResults(null);
      setSearchError(mapSearchError(msg));
    } finally {
      setSearchLoading(false);
    }
  }

  function selectSearchHit(hit: JiraTicketSearchHit) {
    void loadTicketByKey(hit.key.trim().toUpperCase());
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
        setWorkflowInfo(null);
        if (parsed.lines.length === 0) {
          setLogError("This file is empty. Choose a different file.");
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
      setRcaError("Choose a ticket in Step 1 first.");
      return;
    }
    if (!logContent.trim()) {
      setRcaError("Upload a log file in Step 2 first.");
      return;
    }
    if (!confirmedLogInput) {
      setRcaError("Confirm the log preview in Step 3 before running RCA.");
      return;
    }

    setRcaLoading(true);
    setRcaError(null);
    setWorkflowInfo(null);
    try {
      const res = await api.jira.runRcaWithTicket({
        ticket,
        logContent,
      });
      setRcaResult(res);
      const nextRecent = addRecentInvestigation(ticket, res, {
        fileName: logName,
        lineCount: logLines.length,
      });
      setRecentInvestigations(nextRecent);
      const weak =
        !res.rootCause.trim() ||
        /not returned|no strong candidate/i.test(res.rootCause);
      if (weak) {
        setWorkflowInfo(
          "We don’t have a strong single root cause from this run. Review the signals below or try a larger log sample."
        );
      } else {
        setWorkflowInfo(null);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setRcaError(mapRcaError(msg));
      setRcaResult(null);
      setWorkflowInfo(null);
    } finally {
      setRcaLoading(false);
    }
  }

  function restoreRecentInvestigation(entry: RecentInvestigationEntry) {
    scrollRestoredInvestigationRef.current = true;
    setTicketKey(entry.ticket.key);
    setTicket({
      key: entry.ticket.key,
      summary: entry.ticket.summary,
      status: entry.ticket.status,
      priority: entry.ticket.priority,
      labels: [],
      cleanedDescription: "",
      extractedHints: entry.ticket.extractedHints,
    });
    setLogName(entry.log.fileName);
    setLogContent("");
    setLogLines(Array.from({ length: entry.log.lineCount }).map(() => ""));
    setConfirmedLogInput(false);
    setRcaResult({
      rootCause: entry.rca.rootCause,
      confidence: undefined,
      evidenceSummary: [],
      extractedLogSignals: [],
      explanation: entry.rca.summary,
      remediationSuggestions: [],
    });
    setTicketError(null);
    setLogError(null);
    setRcaError(null);
    setWorkflowInfo(
      "Restored from this device. Upload the log file again if you want to run a new analysis."
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Hero card — SplineScene + Spotlight ─────────────────────────── */}
      <div className="relative w-full rounded-2xl bg-black/[0.96] overflow-hidden border border-cyber/[0.15] shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="flex flex-col md:flex-row min-h-[360px]">
          {/* Left: logo + headline */}
          <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
            <div className="flex justify-start py-2">
              <LogIQFullLogo className="max-h-12 max-w-[220px] sm:max-h-14" />
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-cyber/30 bg-cyber/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300 ring-1 ring-cyber/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexus/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-nexus" />
              </span>
              AI-Agent · Deterministic RCA · Remediation
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Debug production issues in seconds, not hours
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-300 max-w-lg">
              Upload logs, trace anomalies, and uncover root cause instantly — all in one intelligent
              debugging workspace.
            </p>
          </div>
          {/* Right: Spline 3D */}
          <div className="flex-1 relative hidden md:block min-h-[360px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* ── Workflow panel ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-sky-500/20 bg-black/[0.94] p-4 text-left shadow-[0_0_0_1px_rgba(56,189,248,0.08)] sm:p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200/95">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                ticketLoading || searchLoading
                  ? "animate-pulse bg-sky-400"
                  : rcaLoading
                    ? "animate-pulse bg-amber-300"
                    : rcaResult
                      ? isWeakRca
                        ? "bg-amber-300"
                        : "bg-emerald-300"
                      : ticket
                        ? "bg-sky-300"
                        : "bg-slate-500"
              )}
            />
            Current stage: {workflowStageLabel}
          </div>
          <p className="mb-4 text-xs text-slate-400">{nextActionHint}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              {
                k: "01",
                label: "Fetch ticket",
                done: Boolean(ticket),
                active: ticketLoading || searchLoading,
              },
              { k: "02", label: "Upload logs", done: Boolean(logContent.trim()), active: false },
              {
                k: "03",
                label: "Preview logs",
                done: confirmedLogInput && Boolean(logContent.trim()),
                active: false,
              },
              { k: "04", label: "Run RCA", done: Boolean(rcaResult), active: rcaLoading },
              { k: "05", label: "Review result", done: Boolean(rcaResult), active: false },
            ].map((step) => (
              <span
                key={step.k}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em]",
                  step.done
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                    : step.active
                      ? "border-amber-500/45 bg-amber-500/20 text-amber-200"
                    : "border-white/[0.12] bg-black/[0.82] text-slate-400"
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
            Search by key or summary, or enter an exact key — then add logs and run RCA.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="jira-ticket-search">
              Search JIRA tickets
            </label>
            <input
              id="jira-ticket-search"
              value={ticketSearchQuery}
              onChange={(e) => {
                setTicketSearchQuery(e.target.value);
                if (searchError) setSearchError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSearchTickets();
                }
              }}
              placeholder="Key or words from summary"
              autoComplete="off"
              className="w-full rounded-xl border border-white/[0.12] bg-black/[0.82] px-3.5 py-2.5 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
            />
            <button
              type="button"
              onClick={() => void handleSearchTickets()}
              disabled={searchLoading || ticketLoading || !ticketSearchQuery.trim()}
              title={!ticketSearchQuery.trim() ? "Enter a search term first" : undefined}
              className={cn(
                "inline-flex min-w-[10.5rem] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35"
              )}
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {searchLoading ? "Searching…" : "Search"}
            </button>
          </div>
          {searchLoading ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-sky-300/90">
              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
              Searching JIRA…
            </p>
          ) : null}
          {searchError ? (
            <div
              className="mt-3 inline-flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-100/90"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
              <span>{searchError}</span>
            </div>
          ) : null}
          {searchResults !== null && !searchLoading ? (
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-black/[0.82] p-2 text-left ring-1 ring-white/[0.04]">
              {searchResults.length === 0 ? (
                <p className="px-2 py-2 text-xs text-slate-500">
                  No tickets matched. Try another term or use an exact key below.
                </p>
              ) : (
                <ul className="max-h-52 space-y-1 overflow-y-auto pr-0.5">
                  {searchResults.map((hit) => (
                    <li key={hit.key}>
                      <button
                        type="button"
                        onClick={() => selectSearchHit(hit)}
                        disabled={ticketLoading}
                        className="w-full rounded-lg border border-transparent px-2 py-2 text-left transition hover:border-sky-500/25 hover:bg-black/[0.82] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-sky-300">
                            {hit.key}
                          </span>
                          <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                            {hit.status}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-200">{hit.summary}</p>
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
                          <span>
                            Priority:{" "}
                            <span className="font-medium text-slate-400">{hit.priority}</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                            Updated {formatSearchHitUpdated(hit.updatedAt)}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Or fetch by exact key
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="jira-ticket-key">
              JIRA ticket key
            </label>
            <input
              id="jira-ticket-key"
              value={ticketKey}
              onChange={(e) => setTicketKey(e.target.value.toUpperCase())}
              placeholder="LOG-123"
              className="w-full rounded-xl border border-white/[0.12] bg-black/[0.82] px-3.5 py-2.5 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
            />
            <button
              type="button"
              onClick={() => void handleFetchTicket()}
              disabled={ticketLoading || searchLoading || !ticketKey.trim()}
              title={!ticketKey.trim() ? "Enter a ticket key first" : undefined}
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
          {!ticketLoading && !ticket && !ticketError ? (
            <p className="mt-2 text-xs text-slate-500">
              Example: <span className="font-mono text-slate-300">LOG-123</span>
            </p>
          ) : null}
          {ticketLoading ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-sky-300/90">
              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
              Fetching ticket from JIRA…
            </p>
          ) : null}
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
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 ring-1 ring-white/[0.04]">
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
                {ticket.cleanedDescription || "No description text was included for this ticket."}
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

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/[0.82] p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.16] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Step 2-3
              </span>
              <p className="text-sm font-semibold text-white">Upload and preview logs</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Use a .log, .txt, or .csv file. Check the preview, then confirm before running RCA.
            </p>
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
                disabled={!canUploadLogs}
                onClick={onPickFile}
                title={!canUploadLogs ? "Fetch ticket first" : undefined}
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
                    className="h-4 w-4 rounded border-white/20 bg-black/[0.85]"
                  />
                  Confirm this log file as RCA input
                </label>
              </>
            ) : null}
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/[0.82] p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.16] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Step 4
              </span>
              <p className="text-sm font-semibold text-white">Run RCA</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Uses the ticket above and the log file you confirmed in Step 3.
            </p>
            <button
              type="button"
              disabled={!canRunRca || rcaLoading}
              onClick={() => void handleRunRca()}
              title={runDisabledReason ?? undefined}
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
            {runDisabledReason && !rcaLoading && !rcaResult ? (
              <p className="mt-2 text-xs text-amber-200/85">Next: {runDisabledReason}.</p>
            ) : null}
          </div>

          {rcaResult ? (
            <div
              ref={investigationResultsRef}
              className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4 ring-1 ring-emerald-500/10"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
                  Step 5
                </span>
                <p className="text-sm font-semibold text-white">RCA result</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                From ticket{" "}
                <span className="font-mono text-sky-300">{ticket?.key ?? "—"}</span>
                {logName ? (
                  <>
                    {" "}
                    and log <span className="text-slate-300">{logName}</span>
                  </>
                ) : null}
                .
              </p>
              {workflowInfo ? (
                <div
                  className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-100/95"
                  role="status"
                >
                  {workflowInfo}
                </div>
              ) : null}
              <div className="mt-3 rounded-lg border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] to-black/[0.85] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200/90">
                  Primary root cause
                </p>
                <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                  {hasStrongCandidate
                    ? rcaResult.rootCause
                    : "No strong root cause was found for this run. Review the evidence and signals, or try a larger log sample."}
                </p>
                {confidencePct !== null ? (
                  <p className="mt-2 text-xs text-emerald-200/90">
                    Confidence: <span className="font-semibold">{confidencePct}%</span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">No confidence score for this run.</p>
                )}
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Evidence summary
                  </p>
                  {rcaResult.evidenceSummary.length > 0 ? (
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      {rcaResult.evidenceSummary.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/80" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">No evidence bullets for this run.</p>
                  )}
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Extracted log signals
                  </p>
                  {rcaResult.extractedLogSignals.length > 0 ? (
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      {rcaResult.extractedLogSignals.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">No log signals for this run.</p>
                  )}
                </div>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
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
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">Ticket context unavailable.</p>
                  )}
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Log input summary
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    <li>
                      <span className="text-slate-500">File:</span> {logName ?? "—"}
                    </li>
                    <li>
                      <span className="text-slate-500">Lines:</span> {logLines.length.toLocaleString()}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Explanation
                </p>
                {rcaResult.explanation ? (
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{rcaResult.explanation}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    No extra explanation for this run. Treat the root cause above as the main output.
                  </p>
                )}
              </div>
              <div className="mt-3 rounded-lg border border-white/[0.08] bg-black/[0.82] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Remediation suggestions
                </p>
                {rcaResult.remediationSuggestions && rcaResult.remediationSuggestions.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    {rcaResult.remediationSuggestions.map((step) => (
                      <li key={step} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    No suggested fixes yet. Use the ticket and evidence above to decide next steps.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 ring-1 ring-white/[0.03]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 shrink-0 text-sky-400/90" aria-hidden />
                  <p className="text-sm font-semibold text-white">Investigation history</p>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">
                  Past JIRA RCA runs on this device — open one to review the full result.
                </p>
              </div>
              {recentInvestigations.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    clearRecentInvestigations();
                    setRecentInvestigations([]);
                  }}
                  className="shrink-0 text-[11px] font-medium text-slate-500 transition hover:text-slate-300"
                >
                  Clear all
                </button>
              ) : null}
            </div>
            {recentInvestigations.length === 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                Nothing saved yet. Complete an RCA run above and it will show up here.
              </p>
            ) : (
              <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-0.5">
                {recentInvestigations.map((entry) => {
                  const findingLine =
                    entry.rca.rootCause.trim() ||
                    entry.rca.summary.trim() ||
                    "RCA completed";
                  const insightLine =
                    entry.rca.rootCause.trim() && entry.rca.summary.trim() !== entry.rca.rootCause.trim()
                      ? entry.rca.summary
                      : null;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => restoreRecentInvestigation(entry)}
                        title={`Open from ${formatDateTime(entry.timestamp)}`}
                        className="group flex w-full items-start gap-2 rounded-lg border border-white/[0.06] bg-black/[0.82] px-2.5 py-2 text-left transition hover:border-sky-500/35 hover:bg-black/[0.82]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <span className="font-mono text-xs font-semibold text-sky-300">
                              {entry.ticket.key}
                            </span>
                            <span
                              className="shrink-0 text-[10px] tabular-nums text-slate-500"
                              title={formatDateTime(entry.timestamp)}
                            >
                              {formatRelativeShort(entry.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-300">
                            {entry.ticket.summary}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-emerald-200/85">
                            {findingLine}
                          </p>
                          {insightLine ? (
                            <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500">
                              {insightLine}
                            </p>
                          ) : null}
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
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
              "cta-shimmer-secondary inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-black/[0.82] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition",
              "hover:border-sky-500/30 hover:bg-black/[0.82] hover:text-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
            )}
          >
            <span className="relative z-10">Explore Features</span>
          </a>
        </div>

      <div className="mx-auto max-w-4xl mt-4">
        <ProductPreviewCard />
      </div>
    </div>
  );
}
