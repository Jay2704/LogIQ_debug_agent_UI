import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  GitBranch,
  History,
  MessageSquare,
  Sparkles,
  Target,
  Ticket,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeroAmbientGlow } from "@/components/landing/HeroAmbientGlow";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

const whatWeDo = [
  "Reads investigation context from JIRA tickets so you start with the same details your team already captured.",
  "Accepts log uploads as input — bring the evidence you already have, without reformatting everything.",
  "Analyzes signals in logs to surface patterns, errors, and anomalies relevant to the incident.",
  "Runs deterministic root cause analysis — structured reasoning, not a black box.",
  "Generates explanations and remediation guidance you can share with engineering and stakeholders.",
];

const whyDifferent = [
  {
    title: "Deterministic RCA, not just AI guesses",
    body: "LogIQ combines structured analysis with assistive intelligence so conclusions stay traceable and repeatable.",
  },
  {
    title: "Evidence-backed analysis",
    body: "Outputs tie back to ticket context and log signals — so every claim can be reviewed against source material.",
  },
  {
    title: "Unified workflow from ticket to root cause",
    body: "One path from intake through logs to RCA, instead of juggling separate tools and chat threads.",
  },
  {
    title: "Built for real debugging workflows",
    body: "Designed around how on-call and platform teams actually triage: tickets, logs, and clear next steps.",
  },
];

const capabilities = [
  {
    icon: Ticket,
    title: "JIRA ticket ingestion",
    description: "Pull key fields, descriptions, and hints from issues to ground every investigation.",
  },
  {
    icon: FileUp,
    title: "Log upload and analysis",
    description: "Ingest logs in common formats and focus on the signals that matter for the incident.",
  },
  {
    icon: Target,
    title: "Root cause detection",
    description: "Deterministic RCA highlights the most likely cause with confidence and supporting evidence.",
  },
  {
    icon: MessageSquare,
    title: "Explanation and remediation",
    description: "Narrative explanations and actionable remediation suggestions for faster resolution.",
  },
  {
    icon: History,
    title: "Investigation history",
    description: "Revisit recent JIRA-first RCA runs so teams can compare incidents and onboard faster.",
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-8">
      <section className="hero-glow-panel relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-black/[0.85] via-[#0a1020] to-black/[0.96] p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_24px_64px_-32px_rgba(0,0,0,0.55)] sm:p-10">
        <HeroAmbientGlow variant="dashboard" />
        <div className="relative z-10 text-center">
          <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200/95 ring-1 ring-sky-500/20">
            Product
          </span>
          <h1 className="gradient-text mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            About LogIQ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            LogIQ is an AI-powered debugging and root cause analysis workspace designed to help teams
            investigate incidents faster and with more confidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className={cn(
                "inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-sky-400" strokeWidth={2} aria-hidden />
          <h2 className="ui-section-title text-xl sm:text-2xl">What LogIQ does</h2>
        </div>
        <div className="ui-card p-5 shadow-card sm:p-6">
          <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
            {whatWeDo.map((line) => (
              <li key={line} className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" strokeWidth={2} aria-hidden />
          <h2 className="ui-section-title text-xl sm:text-2xl">Why it is different</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyDifferent.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/[0.08] bg-black/[0.82] p-4 ring-1 ring-white/[0.04] transition hover:border-sky-500/20"
            >
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-cyan-400" strokeWidth={2} aria-hidden />
          <h2 className="ui-section-title text-xl sm:text-2xl">Core capabilities</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="ui-card flex flex-col p-4 shadow-card transition hover:border-white/[0.12]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/25">
                <Icon className="h-5 w-5 text-sky-300" strokeWidth={2} aria-hidden />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 text-center ring-1 ring-emerald-500/10 sm:p-8">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300/90">
            Vision
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
            LogIQ helps teams move from incident to understanding faster by combining structured
            investigation workflows with intelligent debugging support.
          </p>
        </div>
      </section>
    </div>
  );
}
