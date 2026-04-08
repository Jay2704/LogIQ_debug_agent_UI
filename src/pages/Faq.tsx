import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroAmbientGlow } from "@/components/landing/HeroAmbientGlow";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "What is LogIQ?",
    answer:
      "LogIQ is an AI-powered debugging workspace that helps teams go from JIRA ticket and logs to root cause analysis faster.",
  },
  {
    question: "How does LogIQ work?",
    answer:
      "The workflow starts with a JIRA ticket, then log input is analyzed, signals are extracted, deterministic RCA is run, and the system returns evidence-backed results with explanations and remediation guidance.",
  },
  {
    question: "Do I need to enter anomalies manually?",
    answer:
      "No. The system is designed so anomalies and incident signals are derived from the ticket and logs during analysis.",
  },
  {
    question: "How do I fetch a JIRA ticket?",
    answer:
      "Enter or search for a valid JIRA ticket key in the investigation workflow. LogIQ fetches and normalizes the ticket context automatically.",
  },
  {
    question: "Where do I upload logs?",
    answer:
      "After fetching a JIRA ticket, upload a log file in the same investigation workflow before running RCA.",
  },
  {
    question: "Why is Run RCA disabled?",
    answer:
      "Run RCA is only enabled once the required inputs are available, such as a valid JIRA ticket and uploaded logs.",
  },
  {
    question: "What does deterministic RCA mean?",
    answer:
      "It means the system uses structured evidence and repeatable logic to identify likely root cause, instead of relying only on free-form AI guesses.",
  },
  {
    question: "Does LogIQ store my uploaded logs?",
    answer:
      "The current workflow focuses on derived signals and investigation metadata. Raw log storage is intentionally limited depending on the run and persistence configuration.",
  },
  {
    question: "Can I reopen past investigations?",
    answer:
      "Yes. Investigation history allows you to revisit previous RCA runs and review saved results.",
  },
  {
    question: "Does LogIQ replace engineers?",
    answer:
      "No. LogIQ is designed as an investigation copilot that helps engineers move faster, understand incidents better, and reduce manual debugging effort.",
  },
];

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-white/[0.08] bg-surface-900/45 ring-1 ring-white/[0.04] transition-colors open:border-sky-500/25 open:bg-surface-900/65">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-slate-100 outline-none transition",
          "[&::-webkit-details-marker]:hidden",
          "hover:text-white focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-975"
        )}
      >
        <span className="min-w-0 flex-1 pr-2">{question}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-500 transition duration-200 group-open:rotate-180 group-open:text-sky-400"
          aria-hidden
          strokeWidth={2}
        />
      </summary>
      <div className="border-t border-white/[0.06] px-4 pb-4 pt-0">
        <p className="pt-3 text-sm leading-relaxed text-slate-400">{answer}</p>
      </div>
    </details>
  );
}

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <section className="hero-glow-panel relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-surface-900/95 via-[#0a1020] to-surface-975 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_24px_64px_-32px_rgba(0,0,0,0.55)] sm:p-8">
        <HeroAmbientGlow variant="dashboard" />
        <div className="relative z-10 text-center">
          <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200/95 ring-1 ring-sky-500/20">
            Help
          </span>
          <h1 className="gradient-text mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Quick answers about the LogIQ workflow, JIRA integration, RCA, and how to get started.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/about"
              className={cn(
                "inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-surface-900/50 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-sky-500/30 hover:bg-surface-900/75 hover:text-white",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              About LogIQ
            </Link>
            <Link
              to="/"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="FAQ list" className="space-y-2">
        {FAQ_ITEMS.map((item) => (
          <FaqAccordionItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </section>
    </div>
  );
}
