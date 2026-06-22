import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, RefreshCw } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { useDemoScenarios } from "@/api/hooks";
import { DemoLaunchDialog } from "@/components/demo/DemoLaunchDialog";
import { DemoScenarioGrid } from "@/components/demo/DemoScenarioGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { PageLoading } from "@/components/ui/PageLoading";
import { getJobRouteId } from "@/lib/jobRoute";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { DemoScenario } from "@/types";

export function DemoCenter() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { scenarios, loading, error, launchingId, refetch, launchScenario } =
    useDemoScenarios();
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const handleLaunchRequest = (scenario: DemoScenario) => {
    setLaunchError(null);
    setSelectedScenario(scenario);
  };

  const handleCloseDialog = () => {
    if (launchingId) return;
    setSelectedScenario(null);
    setLaunchError(null);
  };

  const handleConfirmLaunch = async () => {
    if (!selectedScenario) return;
    const userId = user?.userId?.trim();
    if (!userId) {
      setLaunchError("Sign in to launch a demo investigation.");
      return;
    }

    setLaunchError(null);
    try {
      const job = await launchScenario(selectedScenario.id, userId);
      setSelectedScenario(null);
      navigate(`/jobs/${encodeURIComponent(getJobRouteId(job))}`, {
        state: { fromCreate: true },
      });
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) {
    return <PageLoading message="Loading demo scenarios…" />;
  }

  if (error && !scenarios) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <FeedbackNotice tone="error" title="Could not load demo scenarios">
          <p className="text-red-100/85">{error.message}</p>
        </FeedbackNotice>
        <button
          type="button"
          onClick={() => refetch()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="relative overflow-hidden rounded-2xl border border-cyber/[0.15] bg-black/[0.96] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400/90">
              Demo mode
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Demo Center
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Launch curated investigation scenarios with realistic severity, root cause previews,
              and confidence scores — then jump straight into Job Detail.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/30">
            <PlayCircle className="h-6 w-6 text-violet-300" aria-hidden />
          </div>
        </div>
      </header>

      {error ? (
        <FeedbackNotice tone="warning" title="Demo workspace issue">
          <p className="text-amber-100/90">{error.message}</p>
        </FeedbackNotice>
      ) : null}

      {!scenarios?.length ? (
        <EmptyState
          icon={PlayCircle}
          title="No demo scenarios available"
          description="Demo scenarios will appear here once configured."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
                ctaButtonGradient,
                ctaGlowBlueOnly
              )}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          }
        />
      ) : (
        <DemoScenarioGrid
          scenarios={scenarios}
          launchingId={launchingId}
          onLaunch={handleLaunchRequest}
        />
      )}

      <DemoLaunchDialog
        scenario={selectedScenario}
        isOpen={Boolean(selectedScenario)}
        submitting={Boolean(launchingId)}
        error={launchError}
        onClose={handleCloseDialog}
        onConfirm={() => void handleConfirmLaunch()}
      />
    </div>
  );
}
