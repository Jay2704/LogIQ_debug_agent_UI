import { Link } from "react-router-dom";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

/**
 * Marketing-style hero for the authenticated home dashboard (no duplicate app chrome — Topbar remains).
 */
export function DashboardHomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-surface-900/95 via-[#0a1020] to-surface-975 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_24px_64px_-32px_rgba(0,0,0,0.55)] sm:p-10">
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="flex justify-center py-2">
          <LogIQFullLogo className="mx-auto max-h-[9rem] max-w-[min(880px,94vw)] object-contain sm:max-h-40 lg:max-h-48" />
        </div>
        <span className="mt-10 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200/95 ring-1 ring-sky-500/20">
          AI-Powered Deterministic RCA
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl lg:leading-tight">
          Debug production incidents with deterministic RCA and AI explanations
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
          Upload logs, trace anomalies, identify root cause, and generate evidence-backed
          explanations in one intelligent debugging workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/jobs"
            className={cn(
              "inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/35 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
            )}
          >
            Try Demo
          </Link>
          <a
            href="#workspace-explore"
            className={cn(
              "inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-surface-900/50 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition",
              "hover:border-sky-500/30 hover:bg-surface-900/75 hover:text-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
            )}
          >
            Explore Features
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl">
        <ProductPreviewCard />
      </div>
    </section>
  );
}
