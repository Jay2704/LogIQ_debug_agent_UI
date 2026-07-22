import {
  AlertTriangle,
  AlignLeft,
  Compass,
  FileText,
  ListChecks,
  ListOrdered,
  Percent,
  Sparkles,
  TextQuote,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { RcaAssistiveExplanation } from "@/types";
import { cn } from "@/lib/utils";

/** Explicit labels for the assistive narrative (used on Job Detail and in-panel). */
export function AssistiveLayerPills() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center rounded-full border border-amber-400/35 bg-amber-500/[0.12] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-100/95 shadow-[0_0_20px_-12px_rgba(245,158,11,0.45)]">
        AI Explanation
      </span>
      <span
        className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
        title="Narrative only — does not change the deterministic ranked path"
      >
        Assistive Layer
      </span>
    </div>
  );
}

interface ExplanationPanelProps {
  /** Legacy markdown-ish paragraphs (mock bundles). Ignored when `structured` is set. */
  content?: string;
  /** Live API assistive payload — takes precedence over `content`. */
  structured?: RcaAssistiveExplanation;
  className?: string;
  /** default = standard card; emphasis = portfolio hero for AI secondary panel */
  variant?: "default" | "emphasis";
}

function hasAssistiveContent(data: RcaAssistiveExplanation): boolean {
  return (
    Boolean(data.explanationSummary?.trim()) ||
    data.evidenceHighlights.length > 0 ||
    Boolean(data.confidenceAlignmentNote?.trim()) ||
    Boolean(data.limitations?.trim()) ||
    Boolean(data.patchDirection?.trim()) ||
    data.remediationSteps.length > 0 ||
    Boolean(data.finalReportSummary?.trim())
  );
}

function hasStructuredPayload(data: RcaAssistiveExplanation): boolean {
  return hasAssistiveContent(data);
}

function AssistivePipelineIntro({
  structured,
}: {
  structured?: RcaAssistiveExplanation;
}) {
  if (!structured) {
    return (
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Deterministic RCA is primary; assistive text below (when present) does not override
        the ranked path or score.
      </p>
    );
  }
  if (structured.sourceHint === "fallback") {
    return (
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        <span className="text-amber-200/80">Fallback assistive payload</span> — narrative
        below may be template or bundled text.{" "}
        <span className="font-medium text-slate-400">
          Deterministic RCA stays primary;
        </span>{" "}
        nothing here overrides the ranked path or score.
      </p>
    );
  }
  if (structured?.llmAvailable === false) {
    return (
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Live model output may be unavailable; sections below could be cached or static.{" "}
        <span className="font-medium text-slate-400">
          Use deterministic RCA as the binding signal.
        </span>
      </p>
    );
  }
  return (
    <p className="mt-2 text-sm leading-relaxed text-slate-500">
      When present, local LLM output appears below as{" "}
      <span className="text-slate-400">interpretation and suggested actions only</span> —
      it does not override deterministic RCA or its confidence.
    </p>
  );
}

function AssistiveSourcePills({ data }: { data: RcaAssistiveExplanation }) {
  if (data.sourceHint === "fallback") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/[0.1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200/95">
        Fallback explanation
      </span>
    );
  }
  if (data.sourceHint === "local_llm") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200/90">
        Generated with local LLM
      </span>
    );
  }
  return null;
}

function AssistiveMetaStrip({ data }: { data: RcaAssistiveExplanation }) {
  const showLlmDown = data.llmAvailable === false;
  const notice = data.assistiveNotice?.trim();
  const showSourcePill =
    data.sourceHint === "fallback" || data.sourceHint === "local_llm";

  if (!showLlmDown && !notice && !showSourcePill) return null;

  return (
    <div className="space-y-2">
      {showLlmDown ? (
        <div className="rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-400 ring-1 ring-inset ring-white/[0.04]">
          <p className="font-medium text-slate-300">
            Assistive text may not be from a live model
          </p>
          <p className="mt-1 text-xs text-slate-500">
            The UI is working as designed. Deterministic RCA remains authoritative; content
            below may be cached, templated, or from a prior run — do not infer full LLM
            capability from this screen alone.
          </p>
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] px-4 py-3 text-xs leading-relaxed text-sky-100/90 ring-1 ring-inset ring-sky-500/15">
          {notice}
        </div>
      ) : null}
      {showSourcePill ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <AssistiveSourcePills data={data} />
          </div>
          {data.sourceHint === "fallback" ? (
            <p className="text-[11px] leading-relaxed text-slate-500">
              This response is not attributed to a live LLM generation — treat as
              placeholder or bundled copy. Deterministic RCA is unchanged.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ExplanationPanel({
  content = "",
  structured,
  className,
  variant = "default",
}: ExplanationPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed shadow-inner ring-1 ring-inset ring-white/[0.04]",
        variant === "emphasis"
          ? "border-amber-500/35 bg-gradient-to-br from-amber-500/[0.08] via-black/[0.84] to-black/[0.96] p-6 sm:p-8"
          : "border-slate-600/50 bg-black/[0.94] p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
            variant === "emphasis"
              ? "bg-gradient-to-br from-amber-500/25 to-orange-600/15 ring-amber-400/35"
              : "bg-slate-800/80 ring-slate-600/40"
          )}
        >
          <Sparkles
            className={cn(
              "h-6 w-6",
              variant === "emphasis" ? "text-amber-200" : "text-slate-500"
            )}
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400/90">
            Assistive pipeline
          </p>
          <div className="mt-2">
            <AssistiveLayerPills />
          </div>
          <h3
            className={cn(
              "mt-3 font-bold tracking-tight text-white",
              variant === "emphasis" ? "text-xl sm:text-2xl" : "text-sm"
            )}
          >
            Narrative, remediation & summary
          </h3>
          <AssistivePipelineIntro structured={structured} />
        </div>
      </div>

      {structured ? (
        <div className="mt-5">
          <AssistiveMetaStrip data={structured} />
        </div>
      ) : null}

      <div className="mt-6 border-t border-white/[0.06] pt-6">
        {structured && hasStructuredPayload(structured) ? (
          <StructuredAssistiveBody data={structured} />
        ) : structured &&
          !hasStructuredPayload(structured) &&
          content.trim() ? (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-4 ring-1 ring-inset ring-amber-500/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400/90">
              Fallback explanation (bundle)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Structured assistive fields were empty. Showing job-bundle narrative as a
              readable fallback — it may not reflect a current LLM run.
            </p>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-300">
              {content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        ) : structured ? (
          <StructuredAssistiveBody data={structured} />
        ) : content.trim() ? (
          <div className="space-y-4 text-sm leading-relaxed text-slate-400">
            {content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : (
          <AssistiveEmptyState hasStructuredShell={Boolean(structured)} />
        )}
      </div>
    </div>
  );
}

function AssistiveEmptyState({
  hasStructuredShell,
}: {
  hasStructuredShell: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-amber-500/25 bg-gradient-to-br from-amber-500/[0.06] via-black/[0.88] to-black/[0.96] px-5 py-8 text-center shadow-inner ring-1 ring-inset ring-amber-500/10">
      <div className="pointer-events-none absolute -right-16 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.08]">
        <TextQuote className="h-6 w-6 text-amber-300/80" strokeWidth={1.5} />
      </div>
      <p className="relative mt-4 text-sm font-semibold text-slate-300">
        {hasStructuredShell
          ? "No assistive fields in the last response."
          : "No assistive explanation loaded yet."}
      </p>
      <p className="relative mt-2 text-xs leading-relaxed text-slate-500">
        After <span className="font-mono text-slate-400">Run investigation</span>, assistive
        fields populate when the explanation API returns data. If the provider is down,
        you may see empty or fallback content — that does not invalidate deterministic RCA
        on the left.
      </p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  children,
  tone = "neutral",
}: {
  icon: LucideIcon;
  children: ReactNode;
  tone?: "neutral" | "sky" | "amber" | "cyan" | "emerald" | "indigo";
}) {
  const toneIcon =
    tone === "sky"
      ? "text-sky-400"
      : tone === "amber"
        ? "text-amber-400"
        : tone === "cyan"
          ? "text-cyan-400"
          : tone === "emerald"
            ? "text-emerald-400"
            : tone === "indigo"
              ? "text-indigo-400"
              : "text-slate-400";
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4 shrink-0", toneIcon)} strokeWidth={2} />
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {children}
      </p>
    </div>
  );
}

function SubstackTitle({
  icon: IconComponent,
  title,
  subtitle,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: "amber" | "emerald" | "indigo";
}) {
  const Icon = IconComponent;
  const border =
    accent === "amber"
      ? "border-amber-500/25 bg-amber-500/[0.04]"
      : accent === "emerald"
        ? "border-emerald-500/25 bg-emerald-500/[0.05]"
        : "border-indigo-500/25 bg-indigo-500/[0.05]";
  const iconWrap =
    accent === "amber"
      ? "from-amber-500/20 to-orange-600/10 ring-amber-400/30"
      : accent === "emerald"
        ? "from-emerald-500/20 to-teal-600/10 ring-emerald-400/30"
        : "from-indigo-500/20 to-violet-600/10 ring-indigo-400/30";
  const iconColor =
    accent === "amber"
      ? "text-amber-200"
      : accent === "emerald"
        ? "text-emerald-200"
        : "text-indigo-200";

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        border
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1",
            iconWrap
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function StructuredAssistiveBody({ data }: { data: RcaAssistiveExplanation }) {
  const hasContent = hasAssistiveContent(data);

  if (!hasContent) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-700/50 bg-black/[0.88] px-4 py-5 text-center">
          <p className="text-sm text-slate-400">
            No explanation, remediation, or summary fields in this response — often normal
            during warmup, empty JSON, or when the assistive service returns a shell
            payload. The page layout is fine.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Deterministic RCA on the RCA tab is unchanged and remains the source of truth.
          </p>
        </div>
      </div>
    );
  }

  const showAiBlock =
    Boolean(data.explanationSummary?.trim()) ||
    data.evidenceHighlights.length > 0 ||
    Boolean(data.confidenceAlignmentNote?.trim()) ||
    Boolean(data.limitations?.trim());

  const showRemediationBlock =
    data.remediationSteps.length > 0 || Boolean(data.patchDirection?.trim());

  const showReport = Boolean(data.finalReportSummary?.trim());

  return (
    <div className="space-y-8">
      {showAiBlock ? (
        <section aria-label="AI explanation">
          <SubstackTitle
            icon={Sparkles}
            accent="amber"
            title="AI explanation"
            subtitle="LLM-backed when the API provides it — always secondary to deterministic RCA."
          />
          <div className="space-y-6">
            {data.explanationSummary?.trim() ? (
              <div className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 shadow-inner ring-1 ring-inset ring-white/[0.04]">
                <SectionHeader icon={AlignLeft} tone="neutral">
                  Explanation summary
                </SectionHeader>
                <p className="mt-3 whitespace-pre-line break-words text-[15px] leading-[1.7] text-slate-200 sm:text-base">
                  {data.explanationSummary.trim()}
                </p>
              </div>
            ) : null}

            {data.evidenceHighlights.length > 0 ? (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-4 ring-1 ring-inset ring-sky-500/10">
                <SectionHeader icon={ListChecks} tone="sky">
                  Evidence highlights
                </SectionHeader>
                <ul className="mt-4 space-y-2.5">
                  {data.evidenceHighlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-lg border border-sky-500/10 bg-black/[0.88] px-3 py-3 text-[15px] leading-relaxed text-slate-200"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/[0.08] font-mono text-[10px] font-bold tabular-nums text-sky-300">
                        {i + 1}
                      </span>
                      <span className="min-w-0">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {data.confidenceAlignmentNote?.trim() ? (
              <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/[0.05] px-4 py-4 ring-1 ring-inset ring-cyan-500/10">
                <SectionHeader icon={Percent} tone="cyan">
                  Confidence alignment
                </SectionHeader>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {data.confidenceAlignmentNote.trim()}
                </p>
                <p className="mt-3 border-l-2 border-cyan-500/30 pl-4 text-[11px] leading-relaxed text-slate-500">
                  Narrative cross-check to the deterministic score — not a second
                  confidence metric.
                </p>
              </div>
            ) : null}

            {data.limitations?.trim() ? (
              <div className="rounded-xl border border-white/[0.07] bg-slate-950/55 px-4 py-3.5 ring-1 ring-inset ring-white/[0.04]">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Limitations
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {data.limitations.trim()}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showRemediationBlock ? (
        <section aria-label="Remediation">
          <SubstackTitle
            icon={Wrench}
            accent="emerald"
            title="Remediation"
            subtitle="Suggested steps from the assistive layer — verify against deterministic RCA before production."
          />
          <div className="space-y-4">
            {data.remediationSteps.length > 0 ? (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4 ring-1 ring-inset ring-emerald-500/12">
                <SectionHeader icon={ListOrdered} tone="emerald">
                  Remediation steps
                </SectionHeader>
                <ol className="mt-4 space-y-2.5">
                  {data.remediationSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-lg border border-emerald-500/10 bg-black/[0.88] px-3 py-3 text-[15px] leading-relaxed text-slate-200"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/[0.1] font-mono text-[10px] font-bold tabular-nums text-emerald-300">
                        {i + 1}
                      </span>
                      <span className="min-w-0">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {data.patchDirection?.trim() ? (
              <div className="rounded-xl border border-teal-500/25 bg-teal-500/[0.05] px-4 py-4 ring-1 ring-inset ring-teal-500/12">
                <SectionHeader icon={Compass} tone="emerald">
                  Patch direction
                </SectionHeader>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                  {data.patchDirection.trim()}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showReport ? (
        <section aria-label="Executive summary">
          <SubstackTitle
            icon={FileText}
            accent="indigo"
            title="Executive summary"
            subtitle="Assistive closing synthesis (e.g. final_report_summary or executive_summary) — not a signed incident report."
          />
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] px-4 py-4 ring-1 ring-inset ring-indigo-500/12">
            <p className="text-[15px] leading-[1.7] text-slate-200">
              {data.finalReportSummary!.trim()}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
