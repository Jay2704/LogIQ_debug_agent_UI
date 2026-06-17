import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  FileText,
  History,
  Loader2,
  PlayCircle,
  SearchCheck,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { parseUploadedLogFile, SUPPORTED_LOG_EXTENSIONS } from "@/lib/logFileUpload";
import {
  addRecentInvestigation,
  clearRecentInvestigations,
  loadRecentInvestigations,
  type RecentInvestigationEntry,
} from "@/lib/recentInvestigations";
import { getRcaJiraDemoPreloadState } from "@/data/demo/rcaJiraDemoPreload";
import { DEMO_MODE } from "@/lib/demoMode";
import { cn, formatDateTime, formatRelativeShort } from "@/lib/utils";
import type { JiraRcaResult, JiraTicketSummary } from "@/types";

const TICKET_KEY_PATTERN = /^[A-Z][A-Z0-9]+-\d+$/;

function parseLabelsInput(input: string): string[] {
  return input
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

function buildTicketFromFields(input: {
  key: string;
  title: string;
  description: string;
  labelsInput: string;
  status: string;
  priority: string;
  extractedHints?: string[];
}): JiraTicketSummary | null {
  const normalizedKey = input.key.trim().toUpperCase();
  if (!TICKET_KEY_PATTERN.test(normalizedKey) || !input.title.trim()) {
    return null;
  }
  return {
    key: normalizedKey,
    summary: input.title.trim(),
    status: input.status.trim() || "Unknown",
    priority: input.priority.trim() || "Unknown",
    labels: parseLabelsInput(input.labelsInput),
    cleanedDescription: input.description.trim(),
    extractedHints: input.extractedHints ?? [],
  };
}

function applyTicketToFormFields(
  payload: JiraTicketSummary,
  setters: {
    setTicketTitle: (v: string) => void;
    setTicketDescription: (v: string) => void;
    setTicketLabelsInput: (v: string) => void;
    setTicketStatus: (v: string) => void;
    setTicketPriority: (v: string) => void;
  }
) {
  setters.setTicketTitle(payload.summary);
  setters.setTicketDescription(payload.cleanedDescription);
  setters.setTicketLabelsInput(payload.labels.join(", "));
  setters.setTicketStatus(payload.status);
  setters.setTicketPriority(payload.priority);
}

function mapTicketError(message: string): string {
  const safe = message.trim();
  const lower = safe.toLowerCase();
  if (lower.includes("network error (no response)")) {
    return "Failed to fetch ticket";
  }
  const status = safe.match(/\b(\d{3})\b/)?.[1];
  if (status === "400") {
    return "That doesn’t look like a valid ticket key. Try something like LOG-123.";
  }
  if (status === "404") {
    return "Ticket not found";
  }
  if (status === "401" || status === "403") {
    return "Failed to fetch ticket";
  }
  if (status === "500" || status === "502" || status === "503") {
    return "Failed to fetch ticket";
  }
  return safe || "Failed to fetch ticket";
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
interface DashboardHomeHeroProps {
  showHero?: boolean;
  showWorkflow?: boolean;
  showPreviewCard?: boolean;
  /** When true and DEMO_MODE, auto-populates ticket, logs, RCA result, and history. */
  preloadDemoInvestigation?: boolean;
}

export function DashboardHomeHero({
  showHero = true,
  showWorkflow = true,
  showPreviewCard = true,
  preloadDemoInvestigation = false,
}: DashboardHomeHeroProps) {
  const demoPreload =
    preloadDemoInvestigation && DEMO_MODE ? getRcaJiraDemoPreloadState() : null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const investigationResultsRef = useRef<HTMLDivElement | null>(null);
  const scrollRestoredInvestigationRef = useRef(false);
  const [ticketKey, setTicketKey] = useState(() => demoPreload?.ticketKey ?? "");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<JiraTicketSummary | null>(() => demoPreload?.ticket ?? null);
  const [ticketTitle, setTicketTitle] = useState(() => demoPreload?.ticket.summary ?? "");
  const [ticketDescription, setTicketDescription] = useState(
    () => demoPreload?.ticket.cleanedDescription ?? ""
  );
  const [ticketLabelsInput, setTicketLabelsInput] = useState(
    () => demoPreload?.ticket.labels.join(", ") ?? ""
  );
  const [ticketStatus, setTicketStatus] = useState(() => demoPreload?.ticket.status ?? "");
  const [ticketPriority, setTicketPriority] = useState(() => demoPreload?.ticket.priority ?? "");
  const [logName, setLogName] = useState<string | null>(() => demoPreload?.logFileName ?? null);
  const [logContent, setLogContent] = useState(() => demoPreload?.logContent ?? "");
  const [logLines, setLogLines] = useState<string[]>(() => demoPreload?.logLines ?? []);
  const [logError, setLogError] = useState<string | null>(null);
  const [confirmedLogInput, setConfirmedLogInput] = useState(() => Boolean(demoPreload));
  const [rcaLoading, setRcaLoading] = useState(false);
  const [rcaError, setRcaError] = useState<string | null>(null);
  const [rcaExplanationToast, setRcaExplanationToast] = useState<string | null>(null);
  /** Soft info banner (weak RCA, restored session, etc.) — not a hard failure */
  const [workflowInfo, setWorkflowInfo] = useState<string | null>(null);
  const [rcaResult, setRcaResult] = useState<JiraRcaResult | null>(() => demoPreload?.rcaResult ?? null);
  const [recentInvestigations, setRecentInvestigations] = useState<RecentInvestigationEntry[]>(
    () => demoPreload?.recentInvestigations ?? []
  );

  const manualTicket = buildTicketFromFields({
    key: ticketKey,
    title: ticketTitle,
    description: ticketDescription,
    labelsInput: ticketLabelsInput,
    status: ticketStatus,
    priority: ticketPriority,
    extractedHints: ticket?.extractedHints,
  });
  const effectiveTicket = ticket ?? manualTicket;
  const hasValidTicketKey = TICKET_KEY_PATTERN.test(ticketKey.trim().toUpperCase());
  const hasFetchedTicket = Boolean(ticket?.key.trim());
  const hasManualTicket = Boolean(hasValidTicketKey && ticketTitle.trim());
  const canUploadLogs = hasFetchedTicket || hasManualTicket;
  const canRunRca = Boolean(hasValidTicketKey && effectiveTicket && logContent.trim());
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
    ? "Fetching ticket..."
    : rcaLoading
      ? "Running RCA…"
      : rcaResult
        ? isWeakRca
          ? "RCA done (partial)"
          : "RCA complete"
        : hasFetchedTicket || hasManualTicket
          ? logContent.trim()
            ? "Ready to run RCA"
            : "Ticket ready — upload logs"
          : ticketKey.trim()
            ? "Fetch ticket or fill fields manually"
            : "Start here";
  const nextActionHint = ticketLoading
    ? "Fetching ticket..."
    : ticketError
      ? "Fix the issue above, then fetch again or enter ticket fields manually."
      : !hasFetchedTicket && !hasManualTicket
        ? "Enter a ticket key, then fetch or fill title and other fields manually."
        : !logContent.trim()
          ? "Upload a log file (.log, .txt, or .csv)."
          : rcaLoading
            ? "Analysis in progress — results appear in Step 5."
            : rcaResult
              ? "Scroll down to review the result, or start a new ticket above."
              : "Choose Run RCA when you’re ready.";
  const runDisabledReason = !hasValidTicketKey
    ? "Enter a valid ticket key"
    : !hasFetchedTicket && !hasManualTicket
      ? "Fetch ticket or enter title manually"
      : !logContent.trim()
        ? "Upload logs first"
        : null;

  useEffect(() => {
    if (preloadDemoInvestigation && DEMO_MODE) return;
    setRecentInvestigations(loadRecentInvestigations());
  }, [preloadDemoInvestigation]);

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
      if (!payload.key.trim()) {
        throw new Error("[LogIQ] Ticket response missing ticket_key");
      }
      console.log("Fetch status:", 200);
      console.log("Fetched ticket:", payload);
      setTicketError(null);
      setTicket(payload);
      setTicketKey(normalizedKey);
      applyTicketToFormFields(payload, {
        setTicketTitle,
        setTicketDescription,
        setTicketLabelsInput,
        setTicketStatus,
        setTicketPriority,
      });
      setRcaResult(null);
      setRcaError(null);
      setWorkflowInfo(null);
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
    const ticketForRca =
      ticket ??
      buildTicketFromFields({
        key: ticketKey,
        title: ticketTitle,
        description: ticketDescription,
        labelsInput: ticketLabelsInput,
        status: ticketStatus,
        priority: ticketPriority,
      });
    if (!ticketForRca) {
      setRcaError("Enter a valid ticket key and title in Step 1 first.");
      return;
    }
    if (!logContent.trim()) {
      setRcaError("Upload a log file in Step 2 first.");
      return;
    }

    setRcaLoading(true);
    setRcaError(null);
    setRcaExplanationToast(null);
    setWorkflowInfo(null);
    try {
      const result = await api.jira.runRcaWithTicket({
        ticket: ticketForRca,
        logContent,
      });
      console.log("RCA RESULT:", result);
      setRcaResult(result);
      const nextRecent = addRecentInvestigation(ticketForRca, result, {
        fileName: logName,
        lineCount: logLines.length,
      });
      setRecentInvestigations(nextRecent);
      const weak =
        !(result.primary_root_cause ?? "").trim() ||
        /not returned|no strong candidate/i.test(result.primary_root_cause ?? "");
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
      setRcaExplanationToast("RCA explanation failed");
      setRcaResult(null);
      setWorkflowInfo(null);
    } finally {
      setRcaLoading(false);
    }
  }

  function restoreRecentInvestigation(entry: RecentInvestigationEntry) {
    scrollRestoredInvestigationRef.current = true;
    const restored: JiraTicketSummary = {
      key: entry.ticket.key,
      summary: entry.ticket.summary,
      status: entry.ticket.status,
      priority: entry.ticket.priority,
      labels: [],
      cleanedDescription: "",
      extractedHints: entry.ticket.extractedHints,
    };
    setTicketKey(entry.ticket.key);
    setTicket(restored);
    applyTicketToFormFields(restored, {
      setTicketTitle,
      setTicketDescription,
      setTicketLabelsInput,
      setTicketStatus,
      setTicketPriority,
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
    setRcaExplanationToast(null);
    setWorkflowInfo(
      "Restored from this device. Upload the log file again if you want to run a new analysis."
    );
  }

  const explanation = rcaResult?.explanation?.trim() ?? "";

  return (
    <div className="space-y-4">
      {/* ── Hero card — SplineScene + Spotlight ─────────────────────────── */}
      {showHero ? (
        <div className="relative w-full overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <div className="flex min-h-[360px] flex-col md:flex-row">
            {/* Left: headline */}
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8 lg:p-12">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyber/30 bg-cyber/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300 ring-1 ring-cyber/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexus/70 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-nexus" />
                </span>
                AI-Agent · Deterministic RCA · Remediation
              </span>
              <h1 className="mt-4 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl lg:leading-tight">
                Debug production issues in seconds, not hours
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-300">
                Upload logs, trace anomalies, and uncover root cause instantly — all in one intelligent
                debugging workspace.
              </p>
            </div>
            {/* Right: Spline 3D */}
            <motion.div
              className="hero-robot relative hidden min-h-[360px] flex-1 md:block"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 0.5, 0],
                scale: [1, 1.015, 1],
                x: [0, 2, -2, 0],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* ── Workflow panel ──────────────────────────────────────────────── */}
      {showWorkflow ? (
      <div className="rounded-2xl border border-sky-500/20 bg-black/[0.94] p-4 text-left shadow-[0_0_0_1px_rgba(56,189,248,0.08)] sm:p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200/95">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                ticketLoading
                  ? "animate-pulse bg-sky-400"
                  : rcaLoading
                    ? "animate-pulse bg-amber-300"
                    : rcaResult
                      ? isWeakRca
                        ? "bg-amber-300"
                        : "bg-emerald-300"
                      : hasFetchedTicket || hasManualTicket
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
                done: hasFetchedTicket || hasManualTicket,
                active: ticketLoading,
              },
              { k: "02", label: "Upload logs", done: Boolean(logContent.trim()), active: false },
              {
                k: "03",
                label: "Preview logs",
                done: Boolean(logContent.trim()),
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
            Enter a ticket key, fetch from the API, or fill the fields below manually for offline
            RCA testing.
          </p>
          <div className="mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row">
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
              disabled={ticketLoading || !ticketKey.trim()}
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
              {ticketLoading ? "Fetching ticket..." : "Fetch Ticket"}
            </button>
          </div>
          {!ticketLoading && !hasFetchedTicket && !hasManualTicket && !ticketError ? (
            <p className="mt-2 text-xs text-slate-500">
              Example: <span className="font-mono text-slate-300">LAAA-78</span>
            </p>
          ) : null}
          {ticketLoading ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-sky-300/90">
              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
              Fetching ticket...
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
          {hasValidTicketKey || hasFetchedTicket || hasManualTicket ? (
            <div className="mt-4 space-y-3 rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 ring-1 ring-white/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Ticket details {hasFetchedTicket ? "(from API)" : "(manual)"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-400">Title</span>
                  <input
                    value={ticketTitle}
                    onChange={(e) => {
                      setTicketTitle(e.target.value);
                      setTicket(null);
                    }}
                    placeholder="Users unable to complete MFA authentication"
                    className="w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-400">
                    Description
                  </span>
                  <textarea
                    value={ticketDescription}
                    onChange={(e) => {
                      setTicketDescription(e.target.value);
                      setTicket(null);
                    }}
                    rows={3}
                    placeholder="OTP validation timeout during MFA verification."
                    className="w-full resize-y rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-400">Status</span>
                  <input
                    value={ticketStatus}
                    onChange={(e) => {
                      setTicketStatus(e.target.value);
                      setTicket(null);
                    }}
                    placeholder="open"
                    className="w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-400">
                    Priority
                  </span>
                  <input
                    value={ticketPriority}
                    onChange={(e) => {
                      setTicketPriority(e.target.value);
                      setTicket(null);
                    }}
                    placeholder="high"
                    className="w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-400">
                    Labels (comma-separated)
                  </span>
                  <input
                    value={ticketLabelsInput}
                    onChange={(e) => {
                      setTicketLabelsInput(e.target.value);
                      setTicket(null);
                    }}
                    placeholder="sev1, auth, mfa"
                    className="w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/55 focus:ring-2 focus:ring-sky-500/25"
                  />
                </label>
              </div>
              {ticket?.extractedHints && ticket.extractedHints.length > 0 ? (
                <div>
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
              <p className="text-sm font-semibold text-white">Upload logs</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Use a .log, .txt, or .csv file, then confirm before running RCA.
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
                title={
                  !canUploadLogs
                    ? "Fetch ticket or enter title manually first"
                    : undefined
                }
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
            {!canUploadLogs ? (
              <p className="mt-2 text-xs text-slate-500">
                Fetch a ticket or enter a title manually to enable log upload.
              </p>
            ) : null}
            {canUploadLogs && !logContent.trim() ? (
              <p className="mt-2 text-xs text-slate-500">
                No logs uploaded yet. Upload a file to continue the investigation workflow.
              </p>
            ) : null}
            {canUploadLogs && logContent.trim() && logName ? (
              <p className="mt-2 text-xs text-emerald-300/90">Log file uploaded successfully</p>
            ) : null}
            {logError ? (
              <p className="mt-2 inline-flex rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
                {logError}
              </p>
            ) : null}
            {logContent.trim() ? (
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={confirmedLogInput}
                  onChange={(e) => setConfirmedLogInput(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/[0.85]"
                />
                Confirm this log file as RCA input
              </label>
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
              Uses the ticket key, ticket fields above, and the uploaded log file.
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
                <span className="font-mono text-sky-300">{effectiveTicket?.key ?? "—"}</span>
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
                  {effectiveTicket ? (
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      <li>
                        <span className="text-slate-500">Key:</span> {effectiveTicket.key}
                      </li>
                      <li>
                        <span className="text-slate-500">Title:</span> {effectiveTicket.summary}
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
                  AI Explanation
                </p>
                {explanation ? (
                  <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                    {explanation}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    LLM explanation unavailable.
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
          {rcaExplanationToast ? (
            <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-100/95">
              {rcaExplanationToast}
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
      ) : null}
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

      {showPreviewCard ? (
        <div className="mx-auto mt-4 max-w-4xl">
          <ProductPreviewCard />
        </div>
      ) : null}
    </div>
  );
}
