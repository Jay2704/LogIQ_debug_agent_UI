import type { ReactNode } from "react";
import { Activity, Radar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  /** Card heading (e.g. “Login”) */
  cardTitle: string;
  cardDescription?: string;
  className?: string;
}

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
        "relative min-h-screen overflow-hidden bg-[#080d18] text-slate-200",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-25%,rgba(37,99,235,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(124,58,237,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_80%,rgba(14,116,144,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a101f_0%,#080d18_40%,#070b14_100%)] opacity-90" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-surface-975/40 p-10 backdrop-blur-xl lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='rgba(148,163,184,0.08)' stroke-width='0.5'%3E%3Cpath d='M0 24h48M24 0v48'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-sky-600/10 blur-3xl" />

          <div className="relative">
            <Link
              to="/"
              className="inline-flex max-w-full items-center gap-3 rounded-xl outline-none ring-offset-2 ring-offset-transparent transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
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

            <p className="mt-12 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-500/90">
              Product
            </p>
            <h1 className="mt-2 max-w-md text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              AI-powered deterministic root cause analysis for engineering teams
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
              Correlate traces, deploys, and code anchors — with assistive AI explanations
              that stay grounded in auditable evidence.
            </p>

            <ul className="mt-10 max-w-sm space-y-3 text-sm text-slate-400">
              <li className="flex gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400/80" />
                Deterministic RCA with explainable steps
              </li>
              <li className="flex gap-2.5">
                <Radar className="mt-0.5 h-4 w-4 shrink-0 text-sky-400/80" />
                Built for SRE, platform, and app teams
              </li>
            </ul>
          </div>
          <p className="relative text-xs text-slate-600">
            © {new Date().getFullYear()} LogIQ · Demo workspace
          </p>
        </aside>

        <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="mb-8 flex w-full max-w-md items-center gap-3 lg:hidden">
            <Link
              to="/"
              className="inline-flex min-w-0 items-center gap-2 rounded-lg text-slate-400 transition hover:text-sky-400"
            >
              <BrandLogo className="h-9 w-9 [&_svg]:h-5 [&_svg]:w-5" />
              <span className="truncate text-sm font-bold text-white">LogIQ Debug Agent</span>
            </Link>
          </div>

          <div
            className={cn(
              "w-full max-w-md rounded-2xl border border-white/[0.1] bg-gradient-to-b from-surface-900/95 via-surface-960 to-surface-975",
              "p-6 shadow-[0_0_0_1px_rgba(99,102,241,0.1),0_24px_64px_-32px_rgba(0,0,0,0.65),0_0_80px_-40px_rgba(59,130,246,0.22)]",
              "ring-1 ring-white/[0.04] sm:p-8"
            )}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {cardTitle}
              </h2>
              {cardDescription ? (
                <p className="mt-1.5 text-sm text-slate-500">{cardDescription}</p>
              ) : null}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
