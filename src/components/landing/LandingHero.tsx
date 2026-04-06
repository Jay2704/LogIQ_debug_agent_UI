import { Link } from "react-router-dom";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

/** Centered SaaS-style hero for the public landing page */
export function LandingHero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center px-2 py-4 sm:py-6">
          <LogIQFullLogo className="mx-auto h-auto w-auto max-h-[min(18rem,52vw)] max-w-[min(980px,96vw)] object-contain sm:max-h-[min(22rem,48vh)] md:max-h-[min(26rem,52vh)] lg:max-h-[min(28rem,56vh)]" />
        </div>
        <span className="mt-8 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200/95 ring-1 ring-sky-500/20 sm:mt-10">
          AI-Powered Deterministic RCA
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Debug production incidents with deterministic RCA and AI explanations
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
          Upload logs, trace anomalies, identify root cause, and generate evidence-backed
          explanations in one intelligent debugging workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/login"
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
            href="#features"
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

      <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
        <ProductPreviewCard />
      </div>
    </section>
  );
}
