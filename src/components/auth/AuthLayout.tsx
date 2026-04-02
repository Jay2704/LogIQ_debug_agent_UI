import type { ReactNode } from "react";
import {
  Activity,
  GitBranch,
  Network,
  Radar,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  /** Card heading (e.g. “Login”) */
  cardTitle: string;
  cardDescription?: string;
  className?: string;
}

const highlightBadges = [
  { label: "Deterministic RCA", icon: Sparkles },
  { label: "Graph context", icon: Network },
  { label: "LLM assist", icon: Zap },
] as const;

function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/45 to-violet-600/40 ring-1 ring-white/15 shadow-glow-blue",
        className
      )}
    >
      <Activity className="h-6 w-6 text-sky-300" strokeWidth={2} />
    </div>
  );
}

export function AuthLayout({
  children,
  cardTitle,
  cardDescription,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-x-hidden bg-[#080d18] text-slate-200",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-25%,rgba(37,99,235,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(124,58,237,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_80%,rgba(14,116,144,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a101f_0%,#080d18_40%,#070b14_100%)] opacity-90" />

      {/* Center “bridge” glow — ties both columns visually */}
      <div
        className="pointer-events-none absolute left-1/2 top-[45%] h-[min(560px,75vh)] w-[min(100vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.14)_0%,rgba(99,102,241,0.08)_40%,transparent_72%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[min(88vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-500/[0.07] via-violet-500/[0.09] to-cyan-500/[0.05] opacity-80 blur-3xl"
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
                className="inline-flex max-w-full items-center gap-3 rounded-xl outline-none ring-offset-2 ring-offset-[#080d18] transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
              >
                <BrandLogo />
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold tracking-tight text-white">
                    LogIQ Debug Agent
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    AI debugging platform
                  </p>
                </div>
              </Link>

              <div className="flex flex-wrap gap-2">
                {highlightBadges.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-surface-975/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)] ring-1 ring-white/[0.04] transition hover:border-sky-500/25 hover:text-slate-100"
                  >
                    <Icon className="h-3.5 w-3.5 text-sky-400/90" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-500/90">
                  Product
                </p>
                <h1 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl xl:text-[1.85rem] xl:leading-tight">
                  AI-powered deterministic root cause analysis for engineering teams
                </h1>
                <p className="max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
                  Correlate traces, deploys, and code anchors — with assistive AI explanations
                  that stay grounded in auditable evidence.
                </p>
              </div>

              <ul className="max-w-md space-y-4 text-sm leading-relaxed text-slate-400">
                <li className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400/85" strokeWidth={2} />
                  <span>Deterministic RCA with explainable, replayable steps.</span>
                </li>
                <li className="flex gap-3">
                  <Radar className="mt-0.5 h-4 w-4 shrink-0 text-sky-400/85" strokeWidth={2} />
                  <span>Built for SRE, platform, and app teams shipping under pressure.</span>
                </li>
                <li className="flex gap-3">
                  <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" strokeWidth={2} />
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
                className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-lg text-slate-400 transition hover:text-sky-400"
              >
                <BrandLogo className="h-9 w-9 [&_svg]:h-5 [&_svg]:w-5" />
                <span className="truncate text-sm font-bold text-white">LogIQ Debug Agent</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlightBadges.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-surface-975/70 px-2 py-0.5 text-[10px] font-medium text-slate-400"
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
                className="pointer-events-none absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-br from-sky-500/35 via-violet-500/25 to-cyan-500/15 opacity-40 blur-lg transition duration-500 group-hover:opacity-70"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-gradient-to-br from-sky-500/15 to-violet-600/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div
                className={cn(
                  "relative rounded-2xl border border-white/[0.12] bg-gradient-to-b from-surface-900/98 via-surface-960 to-surface-975",
                  "p-6 shadow-[0_0_0_1px_rgba(99,102,241,0.12),0_28px_72px_-36px_rgba(0,0,0,0.75),0_0_88px_-44px_rgba(59,130,246,0.28)]",
                  "ring-1 ring-white/[0.06] transition duration-300 ease-out will-change-transform",
                  "group-hover:-translate-y-0.5 group-hover:scale-[1.015] group-hover:border-sky-500/25",
                  "group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_32px_80px_-28px_rgba(0,0,0,0.8),0_0_100px_-36px_rgba(59,130,246,0.42)]",
                  "sm:p-8"
                )}
              >
                <div className="mb-6 space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
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
