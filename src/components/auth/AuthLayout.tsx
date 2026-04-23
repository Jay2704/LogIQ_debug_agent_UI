import type { ReactNode } from "react";
import { GitBranch, Network, Radar, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  /** Card heading (e.g. "Login") */
  cardTitle: string;
  cardDescription?: string;
  className?: string;
}

const highlightBadges = [
  { label: "Deterministic RCA", icon: Sparkles },
  { label: "Graph context", icon: Network },
  { label: "LLM assist", icon: Zap },
] as const;

export function AuthLayout({
  children,
  cardTitle,
  cardDescription,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-[#040C18] text-slate-200",
        className
      )}
    >
      {/* Cyber ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-20%,rgba(34,211,238,0.07),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(34,211,238,0.04),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(52,211,153,0.04),transparent_45%)]" />

      {/* Cyber grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='rgba(34,211,238,0.08)' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Center glow bridge */}
      <div
        className="pointer-events-none absolute left-1/2 top-[45%] h-[min(500px,70vh)] w-[min(100vw,800px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07)_0%,rgba(52,211,153,0.04)_40%,transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 xl:max-w-[1360px]">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-0 xl:gap-2">
          {/* Left: product story — biased toward center gap */}
          <aside className="relative hidden flex-col justify-center lg:flex lg:pr-6 xl:pr-10">
            <div
              className="pointer-events-none absolute -right-3 top-[12%] bottom-[12%] hidden w-px bg-gradient-to-b from-transparent via-sky-500/35 to-transparent lg:block xl:-right-1"
              aria-hidden
            />
            <div className="ml-auto w-full max-w-lg space-y-7 2xl:max-w-xl">
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-500/[0.06] to-transparent opacity-70 blur-2xl"
                aria-hidden
              />
              <Link
                to="/"
                className="inline-flex max-w-full items-center rounded-xl outline-none ring-offset-2 ring-offset-[#080d18] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
              >
                <LogIQFullLogo className="max-h-20 max-w-[min(380px,92%)] sm:max-h-24" />
              </Link>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                AI debugging platform
              </p>

              <div className="flex flex-wrap gap-2">
                {highlightBadges.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyber/[0.15] bg-black/[0.88] px-2.5 py-1 text-[11px] font-medium text-slate-300 shadow-glow-cyber ring-1 ring-cyber/[0.06] transition hover:border-cyber/[0.3] hover:text-cyan-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-cyber/80" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyber/80">
                  Product
                </p>
                <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl xl:text-[1.85rem] xl:leading-tight">
                  AI-powered deterministic root cause analysis for engineering teams
                </h1>
                <p className="max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
                  Correlate traces, deploys, and code anchors — with assistive AI explanations
                  that stay grounded in auditable evidence.
                </p>
              </div>

              <ul className="max-w-md space-y-4 text-sm leading-relaxed text-slate-400">
                <li className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyber/80" strokeWidth={2} />
                  <span>Deterministic RCA with explainable, replayable steps.</span>
                </li>
                <li className="flex gap-3">
                  <Radar className="mt-0.5 h-4 w-4 shrink-0 text-nexus/80" strokeWidth={2} />
                  <span>Built for SRE, platform, and app teams shipping under pressure.</span>
                </li>
                <li className="flex gap-3">
                  <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-cyber/70" strokeWidth={2} />
                  <span>Graph-aware context across services, deploys, and code anchors.</span>
                </li>
              </ul>

              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} LogIQ · Demo workspace
              </p>
            </div>
          </aside>

          {/* Mobile: compact product strip */}
          <div className="space-y-5 lg:hidden">
            <div className="flex w-full items-center gap-3">
              <Link
                to="/"
                className="inline-flex min-w-0 flex-1 items-center rounded-lg text-slate-400 transition hover:opacity-90"
              >
                <LogIQFullLogo className="max-h-16 max-w-[min(340px,88vw)] sm:max-h-18" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlightBadges.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-black/[0.7] px-2 py-0.5 text-[10px] font-medium text-slate-400"
                >
                  <Icon className="h-3 w-3 text-sky-400/80" strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Deterministic RCA, graph context, and AI-assisted debugging in one workspace.
            </p>
          </div>

          {/* Right: auth card */}
          <main className="flex flex-col items-center justify-center lg:items-stretch lg:pl-6 xl:pl-10">
            <div className="group relative w-full max-w-md lg:ml-0 lg:max-w-[440px]">
              <div
                className="pointer-events-none absolute -inset-[1px] rounded-card bg-gradient-to-br from-cyber/40 via-nexus/20 to-cyber/10 opacity-30 blur-lg transition duration-500 group-hover:opacity-55"
                aria-hidden
              />
              <div
                className={cn(
                  "relative rounded-card border border-cyber/[0.18] bg-black/[0.96]",
                  "p-6 shadow-glow-cyber",
                  "ring-1 ring-cyber/[0.06] transition duration-300 ease-out will-change-transform",
                  "group-hover:-translate-y-0.5 group-hover:border-cyber/[0.28]",
                  "sm:p-8"
                )}
              >
                <div className="mb-6 space-y-2">
                  <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {cardTitle}
                  </h2>
                  {cardDescription ? (
                    <p className="text-sm leading-relaxed text-slate-500">{cardDescription}</p>
                  ) : null}
                </div>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
