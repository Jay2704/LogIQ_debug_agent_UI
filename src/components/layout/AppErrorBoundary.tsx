import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches unexpected render errors so the demo keeps a friendly screen instead of a blank page.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[LogIQ] Uncaught UI error:", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface-975 p-6">
          <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-black/[0.88] p-8 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/[0.08]">
              <AlertTriangle className="h-6 w-6 text-red-300" strokeWidth={1.75} />
            </div>
            <h1 className="mt-5 text-lg font-semibold text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The workspace hit an unexpected error. Refresh the page or return to the
              dashboard to continue the demo.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/30",
                  ctaButtonGradient,
                  ctaGlowBlueOnly
                )}
              >
                Refresh page
              </button>
              <Link
                to="/"
                className="rounded-xl border border-white/[0.12] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.04]"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
