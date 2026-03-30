import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  /** Card heading (e.g. “Sign in”) */
  cardTitle: string;
  cardDescription?: string;
  className?: string;
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
        <aside className="relative hidden flex-col justify-between border-r border-white/[0.06] bg-surface-975/40 p-10 backdrop-blur-xl lg:flex">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-xl outline-none ring-offset-2 ring-offset-transparent transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/45 to-violet-600/40 ring-1 ring-white/15 shadow-glow-blue">
                <Activity className="h-6 w-6 text-sky-300" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  LogIQ
                </p>
                <p className="text-lg font-bold tracking-tight text-white">
                  Debug Agent
                </p>
              </div>
            </Link>
            <h1 className="mt-14 max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
              AI-powered deterministic root cause analysis for engineering teams
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
              Correlate traces, deploys, and code anchors — with assistive AI
              explanations that never override auditable evidence.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} LogIQ · Demo workspace
          </p>
        </aside>

        <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="mb-8 flex w-full max-w-md items-center gap-3 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg text-slate-400 transition hover:text-sky-400"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/40 to-violet-600/35 ring-1 ring-white/15">
                <Activity className="h-5 w-5 text-sky-300" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-white">LogIQ Debug Agent</span>
            </Link>
          </div>

          <div
            className={cn(
              "w-full max-w-md rounded-2xl border border-white/[0.1] bg-gradient-to-b from-surface-900/95 via-surface-960 to-surface-975",
              "p-6 shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_24px_64px_-32px_rgba(0,0,0,0.6),0_0_80px_-40px_rgba(59,130,246,0.2)]",
              "sm:p-8"
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
