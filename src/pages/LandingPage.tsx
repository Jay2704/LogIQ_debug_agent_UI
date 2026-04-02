import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  FileSearch,
  Gauge,
  GitBranch,
  Headphones,
  Layers,
  ListTree,
  Network,
  Radar,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/45 to-violet-600/40 ring-1 ring-white/15 shadow-glow-blue sm:h-11 sm:w-11",
        className
      )}
    >
      <Activity className="h-5 w-5 text-sky-300 sm:h-6 sm:w-6" strokeWidth={2} />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080d18]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none ring-offset-2 ring-offset-[#080d18] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50 sm:gap-3"
        >
          <BrandLogo className="h-9 w-9 sm:h-10 sm:w-10" />
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
              LogIQ Debug Agent
            </p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:block">
              AI debugging platform
            </p>
          </div>
        </Link>
        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white sm:text-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-semibold text-sky-400 transition hover:bg-white/[0.05] hover:text-sky-300 sm:text-sm"
            )}
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeroMockPreview() {
  return (
    <div className="relative w-full max-w-xl lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 via-violet-600/10 to-transparent opacity-60 blur-2xl"
        aria-hidden
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-surface-900/95 to-surface-975 shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_24px_64px_-24px_rgba(0,0,0,0.65)]",
          "ring-1 ring-white/[0.04] animate-investigation-reveal"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-surface-975/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-400">dbg_inv_7f2a</span>
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/95">
              Complete
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2 py-1 ring-1 ring-sky-500/25">
            <Gauge className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold tabular-nums text-sky-200">94% confidence</span>
          </div>
        </div>
        <div className="grid gap-0 sm:grid-cols-5">
          <div className="border-b border-white/[0.06] p-4 sm:col-span-2 sm:border-b-0 sm:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Root cause
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-slate-100">
              Deploy <span className="font-mono text-sky-300/95">checkout-svc@v2.4.1</span>{" "}
              introduced a regression in cart validation under load.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["trace", "deploy", "code"].map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300/90 ring-1 ring-violet-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 sm:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Evidence graph
            </p>
            <div className="mt-3 flex h-24 items-end justify-between gap-1 px-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-full max-w-[2rem] rounded-t bg-gradient-to-t from-sky-600/40 to-cyan-400/25 ring-1 ring-white/[0.06]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Correlated latency spike → failed rollout window → anchor file match.
            </p>
          </div>
        </div>
        <div className="border-t border-white/[0.06] bg-slate-950/40 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            AI explanation
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Hypothesis ranks deploy change first; trace evidence supports rollback to{" "}
            <span className="font-mono text-slate-300">v2.3.8</span> while metrics stabilize.
          </p>
        </div>
      </div>
    </div>
  );
}

const trustPills = [
  "Deterministic RCA",
  "Graph-based reasoning",
  "LLM-assisted explanations",
  "Role-aware workflows",
] as const;

const features = [
  {
    title: "Deterministic Root Cause Analysis",
    description:
      "Reproducible investigation graphs — same inputs yield the same ranked causes, auditable end to end.",
    icon: Sparkles,
    ring: "hover:ring-sky-500/25",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(56,189,248,0.25)]",
  },
  {
    title: "AI-Assisted Debugging",
    description:
      "Narratives grounded in traces, logs, and code anchors — not generic advice.",
    icon: Brain,
    ring: "hover:ring-violet-500/25",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.22)]",
  },
  {
    title: "Knowledge Graph Context",
    description:
      "Map services, deploys, and dependencies to see how failures propagate through the stack.",
    icon: Network,
    ring: "hover:ring-cyan-500/25",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.2)]",
  },
  {
    title: "Investigation Workflows",
    description:
      "One workspace for anomalies, jobs, RCA output, and handoff — from triage to remediation.",
    icon: Workflow,
    ring: "hover:ring-indigo-500/25",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.22)]",
  },
] as const;

const steps = [
  {
    n: "01",
    title: "Ingest anomaly",
    body: "Route from alerts, manual triggers, or API — capture anomaly and run context.",
    icon: Radar,
  },
  {
    n: "02",
    title: "Run RCA pipeline",
    body: "Deterministic correlation and graph walk across traces, deploys, and code.",
    icon: Cpu,
  },
  {
    n: "03",
    title: "Review evidence & explanation",
    body: "Ranked hypotheses with evidence panels and LLM assist — stay audit-ready.",
    icon: FileSearch,
  },
  {
    n: "04",
    title: "Take remediation action",
    body: "Track fixes, rollbacks, and owner handoff without leaving the investigation.",
    icon: CheckCircle2,
  },
] as const;

const roles = [
  { label: "Developer", icon: Cpu, desc: "Code anchors & deploy context" },
  { label: "Tester", icon: Layers, desc: "Repro & regression trails" },
  { label: "Support engineer", icon: Headphones, desc: "Customer-impacting incidents" },
  { label: "SRE", icon: Zap, desc: "Production reliability & SLOs" },
  { label: "Viewer", icon: Shield, desc: "Read-only dashboards & RCA" },
] as const;

function PrimaryCta({ className }: { className?: string }) {
  return (
    <Link
      to="/login"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
        ctaButtonGradient,
        ctaGlowBlueOnly,
        "ring-1 ring-blue-400/35 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
        className
      )}
    >
      Login
    </Link>
  );
}

function SecondaryCta({ className }: { className?: string }) {
  return (
    <Link
      to="/signup"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-surface-900/50 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition",
        "hover:border-white/[0.2] hover:bg-surface-900/75",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
        className
      )}
    >
      Create account
    </Link>
  );
}

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080d18] text-slate-200">
      {/* Ambient + grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-25%,rgba(37,99,235,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(124,58,237,0.14),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_80%,rgba(14,116,144,0.1),transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='rgba(148,163,184,0.06)' stroke-width='0.5'%3E%3Cpath d='M0 32h64M32 0v64'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a101f_0%,#080d18_45%,#070b14_100%)] opacity-95" />

      <div className="relative z-10">
        <LandingNav />

        <main>
          {/* Hero */}
          <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-300/95 ring-1 ring-sky-500/15">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-40" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
                    </span>
                    Deterministic + AI
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-400">
                    Production debugging workspace
                  </span>
                </div>
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15] xl:text-5xl xl:leading-tight">
                  <span className="block">AI-Powered Debugging for Modern Systems</span>
                  <span className="mt-3 block text-xl font-semibold leading-snug text-slate-200 sm:text-2xl lg:mt-4 lg:text-[1.65rem] xl:text-3xl">
                    Find root cause faster with{" "}
                    <span className="text-gradient-blue">deterministic RCA</span>
                    {" + "}
                    <span className="text-gradient-violet">AI</span>
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                  Graph-based reasoning across traces and deploys, LLM-assisted explanations you
                  can audit, and one workspace to debug production issues — without black-box
                  guesswork.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryCta className="w-full sm:w-auto" />
                  <SecondaryCta className="w-full sm:w-auto" />
                </div>
              </div>
              <HeroMockPreview />
            </div>

            {/* Trust strip */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-2 sm:mt-16 sm:gap-3 lg:mt-20">
              {trustPills.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-white/[0.08] bg-gradient-to-b from-surface-900/90 to-surface-975/95 px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-[0_0_24px_-8px_rgba(59,130,246,0.35)] ring-1 ring-white/[0.04] transition hover:border-sky-500/20 hover:shadow-[0_0_28px_-6px_rgba(56,189,248,0.35)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="border-t border-white/[0.06] bg-surface-975/20 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="ui-section-eyebrow">Platform</p>
                <h2 className="ui-section-title mt-1">Built for serious incidents</h2>
                <p className="ui-section-desc">
                  Everything you need to go from alert to actionable root cause — with evidence
                  that holds up in postmortems.
                </p>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
                {features.map(({ title, description, icon: Icon, ring, glow }) => (
                  <div
                    key={title}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface-900/95 to-surface-975 p-6 ring-1 ring-white/[0.04] transition-all duration-300",
                      "hover:-translate-y-0.5",
                      ring,
                      glow
                    )}
                  >
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20 transition group-hover:bg-sky-500/15">
                        <Icon className="h-6 w-6 text-sky-400/95" strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="ui-section-eyebrow">Flow</p>
                <h2 className="ui-section-title mt-1">How investigations run</h2>
                <p className="ui-section-desc">
                  From signal to action — a pipeline your whole org can follow.
                </p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-4 lg:gap-4">
                {steps.map((s, i) => (
                  <div key={s.n} className="relative">
                    {i < steps.length - 1 ? (
                      <div
                        className="absolute left-[calc(50%+3.5rem)] top-10 hidden h-px w-[calc(100%-1rem)] bg-gradient-to-r from-sky-500/35 via-sky-500/10 to-transparent lg:block"
                        aria-hidden
                      />
                    ) : null}
                    <div
                      className={cn(
                        "relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface-975/60 p-5 ring-1 ring-white/[0.04] transition hover:border-sky-500/20",
                        "animate-investigation-reveal"
                      )}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-sky-500/90">
                          {s.n}
                        </span>
                        <s.icon className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={1.75} />
                      </div>
                      <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Product showcase */}
          <section className="border-t border-white/[0.06] bg-gradient-to-b from-transparent via-surface-975/30 to-transparent py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="ui-section-eyebrow">In product</p>
                <h2 className="ui-section-title mt-1">Investigation workspace preview</h2>
                <p className="ui-section-desc">
                  RCA summaries, evidence lists, and assistive explanations in one surface.
                </p>
              </div>
              <div
                className={cn(
                  "mt-10 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-surface-900/98 to-slate-950 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.05]",
                  "animate-investigation-reveal"
                )}
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] bg-surface-975/90 px-4 py-2.5">
                  {["RCA summary", "Evidence", "Explanation"].map((tab, idx) => (
                    <button
                      key={tab}
                      type="button"
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        idx === 0
                          ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                  <span className="ml-auto font-mono text-[10px] text-slate-600">job · dbg_inv_7f2a</span>
                </div>
                <div className="grid gap-0 lg:grid-cols-12">
                  <div className="border-b border-white/[0.06] p-5 lg:col-span-5 lg:border-b-0 lg:border-r">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Top hypothesis
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      Deployment <span className="font-mono text-sky-300/90">checkout-svc@v2.4.1</span>{" "}
                      correlated with error rate and p99 latency in the cart path.
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-400">
                      <li className="flex gap-2">
                        <ListTree className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
                        Trace: checkout → payment edge timeout cluster
                      </li>
                      <li className="flex gap-2">
                        <GitBranch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400/80" />
                        Diff touches validation in <span className="font-mono">CartValidator</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-b border-white/[0.06] p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Evidence
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        { k: "Metric", v: "5xx rate +340% vs baseline" },
                        { k: "Deploy", v: "v2.4.1 @ 14:02 UTC" },
                        { k: "Anchor", v: "src/cart/validate.ts:L128" },
                      ].map((row) => (
                        <div
                          key={row.k}
                          className="flex justify-between gap-3 rounded-lg border border-white/[0.05] bg-slate-950/50 px-2.5 py-2 text-[11px]"
                        >
                          <span className="text-slate-500">{row.k}</span>
                          <span className="truncate text-right font-mono text-slate-300">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 lg:col-span-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Remediation
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {["Rollback or hotfix validation path", "Notify #incident-441", "Open PR with guardrail test"].map(
                        (line, idx) => (
                          <li key={line} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/[0.1] bg-slate-900/80 text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            {line}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roles */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="ui-section-eyebrow">Teams</p>
                <h2 className="ui-section-title mt-1">Role-aware collaboration</h2>
                <p className="ui-section-desc">
                  Same workspace — tuned views for how each role triages and ships fixes.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                {roles.map(({ label, icon: Icon, desc }) => (
                  <div
                    key={label}
                    className="flex min-w-[10rem] max-w-[14rem] flex-1 flex-col rounded-xl border border-white/[0.08] bg-surface-975/50 px-4 py-3 text-center ring-1 ring-white/[0.04] transition hover:border-indigo-500/25 hover:bg-surface-975/80"
                  >
                    <Icon className="mx-auto h-5 w-5 text-indigo-400/90" strokeWidth={1.75} />
                    <p className="mt-2 text-sm font-semibold text-white">{label}</p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative border-t border-white/[0.08] py-20 sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(59,130,246,0.18),transparent_55%)]" />
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ship with confidence when production breaks
              </h2>
              <p className="mt-4 text-base text-slate-400 sm:text-lg">
                Join a debugging flow that respects evidence, speed, and accountability — not vibes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <PrimaryCta />
                <SecondaryCta />
              </div>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sky-400/90 transition hover:text-sky-300"
              >
                Already have an account? <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} LogIQ · Demo workspace
          </footer>
        </main>
      </div>
    </div>
  );
}
