import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, ListTodo, Plus, RefreshCw } from "lucide-react";
import { useCurrentUser } from "@/auth";
import {
  getRunDebugShortcutDisabledTitle,
  useRoleUiCapabilities,
} from "@/lib/roleUiCapabilities";
import { JobsTable } from "@/components/ui/JobsTable";
import { JobsListFooter } from "@/components/ui/JobsListFooter";
import { JobsEmptyState } from "@/components/ui/JobsEmptyState";
import { JobsTableSkeleton } from "@/components/ui/JobsTableSkeleton";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown, type FilterOption } from "@/components/ui/FilterDropdown";
import { RunDebugButton } from "@/components/ui/RunDebugButton";
import { useJobs } from "@/api/hooks";
import { CreateJobModal } from "@/components/jobs/CreateJobModal";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";
import { computeJobStatusSummary } from "@/lib/insights";
import { getJobRouteId } from "@/lib/jobRoute";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { JobStatus, TriggerType } from "@/types";

const PAGE_SIZE = 8;

const statusOptions: FilterOption[] = [
  { value: "all", label: "All statuses" },
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const triggerOptions: FilterOption[] = [
  { value: "all", label: "All triggers" },
  { value: "alert", label: "Alert" },
  { value: "manual", label: "Manual" },
  { value: "scheduled", label: "Scheduled" },
  { value: "api", label: "API" },
  { value: "webhook", label: "Webhook" },
];

export function Jobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useCurrentUser();
  const roleCaps = useRoleUiCapabilities();
  const { data: jobs, loading, error, refetch } = useJobs();
  const canCreateJob =
    Boolean(user?.userId?.trim()) && roleCaps.canCreateJob;
  const createBlockedNoUser = !user?.userId?.trim();
  const createBlockedRole = Boolean(user?.userId?.trim()) && !roleCaps.canCreateJob;
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const service = (j.service ?? "").toLowerCase();
      const anomaly = (j.anomalyId ?? "").toLowerCase();
      const routeId = getJobRouteId(j).toLowerCase();
      const matchQ =
        !q ||
        routeId.includes(q) ||
        j.id.toLowerCase().includes(q) ||
        anomaly.includes(q) ||
        service.includes(q);
      const matchS =
        status === "all" || j.status === (status as JobStatus);
      const matchT =
        trigger === "all" || j.trigger === (trigger as TriggerType);
      return matchQ && matchS && matchT;
    });
  }, [jobs, query, status, trigger]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, status, trigger]);

  useEffect(() => {
    const s = location.state as { refreshJobs?: boolean } | undefined;
    if (s?.refreshJobs) {
      void refetch();
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate, refetch]);

  const displayed = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const summary = useMemo(() => {
    if (!jobs?.length) return null;
    return computeJobStatusSummary(jobs);
  }, [jobs]);

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setTrigger("all");
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="ui-page-title">Debug jobs</h1>
            <p className="ui-page-desc">
              Investigations across services — filter, triage, open the workspace.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              disabled
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white opacity-50",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35"
              )}
              title={
                canCreateJob
                  ? undefined
                  : createBlockedNoUser
                    ? "Login to create a job (triggered_by_user_id)"
                    : "Viewer role cannot create jobs (UI only)"
              }
            >
              <Plus className="h-4 w-4" />
              New job
            </button>
            <RunDebugButton
              to="/"
              disabled={!roleCaps.canUseRunDebugShortcut}
              disabledTitle={getRunDebugShortcutDisabledTitle(user)}
            />
          </div>
        </div>
        <JobsTableSkeleton rows={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <FeedbackNotice tone="error" title="Could not load jobs">
          <p>{error.message}</p>
          <p className="mt-2 text-xs text-red-200/75">
            Check <span className="font-mono">VITE_API_BASE_URL</span> and that the jobs
            API is running.
          </p>
        </FeedbackNotice>
        <button
          type="button"
          onClick={() => refetch()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
            ctaButtonGradient,
            ctaGlowBlueOnly,
            "ring-1 ring-blue-400/35 transition hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Retry
        </button>
      </div>
    );
  }

  const hasMore = visibleCount < filtered.length;
  const loadMore = () =>
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));

  return (
    <div className="space-y-8">
      <CreateJobModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(job) => {
          void refetch();
          navigate(`/jobs/${encodeURIComponent(getJobRouteId(job))}`, {
            state: { fromCreate: true },
          });
        }}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-500/90">
            Operations
          </p>
          <h1 className="mt-1 ui-page-title">Debug jobs</h1>
          <p className="ui-page-desc mt-2">
            Search by job ID, anomaly ID, or service. Filter by pipeline status and
            how the run was triggered.
          </p>
          {summary ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/[0.7] px-3 py-2 text-xs text-slate-400">
                <ListTodo className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono font-semibold tabular-nums text-slate-200">
                  {summary.total}
                </span>
                <span className="text-slate-500">total</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-200/90">
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-mono font-semibold tabular-nums">
                  {summary.running}
                </span>
                <span className="text-amber-200/50">active</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-200/85">
                <span className="font-mono font-semibold tabular-nums">
                  {summary.completed}
                </span>
                <span className="text-emerald-200/45">done</span>
              </span>
              {summary.failed > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200/90">
                  <span className="font-mono font-semibold tabular-nums">
                    {summary.failed}
                  </span>
                  <span className="text-red-200/50">failed</span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:pt-1">
          <div className="flex flex-col items-stretch gap-1 sm:items-end">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              disabled={!canCreateJob}
              title={
                canCreateJob
                  ? undefined
                  : createBlockedNoUser
                    ? "Login to create a job — triggered_by_user_id comes from your user record."
                    : "Viewer role cannot create jobs (UI only)"
              }
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35 transition hover:-translate-y-0.5 active:translate-y-0",
                !canCreateJob && "cursor-not-allowed opacity-50 hover:translate-y-0"
              )}
            >
              <Plus className="h-4 w-4" />
              New job
            </button>
            {!canCreateJob ? (
              <p className="max-w-[16rem] text-right text-xs leading-snug text-slate-500">
                {createBlockedNoUser ? (
                  <>
                    <Link
                      to="/login"
                      className="font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      Login
                    </Link>{" "}
                    to select a user before creating a job.
                  </>
                ) : createBlockedRole ? (
                  <>
                    Viewer role is read-only here. Use a tester, support, developer, or SRE
                    account to create jobs.
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          <RunDebugButton
            to="/"
            disabled={!roleCaps.canUseRunDebugShortcut}
            disabledTitle={getRunDebugShortcutDisabledTitle(user)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-cyber/[0.12] bg-black/[0.88] p-5 shadow-inner sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <label
              htmlFor="jobs-search"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Search
            </label>
            <SearchInput
              id="jobs-search"
              variant="panel"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job ID, anomaly ID, or service name…"
              aria-label="Search jobs"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={status}
              onChange={setStatus}
              isActive={status !== "all"}
            />
            <FilterDropdown
              label="Trigger"
              options={triggerOptions}
              value={trigger}
              onChange={setTrigger}
              isActive={trigger !== "all"}
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          {filtered.length === jobs?.length
            ? `All ${jobs?.length ?? 0} jobs in workspace`
            : `${filtered.length} match${filtered.length === 1 ? "" : "es"} · ${jobs?.length ?? 0} total`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <JobsEmptyState
          hasActiveFilters={Boolean(jobs && jobs.length > 0)}
          onClearFilters={
            jobs && jobs.length > 0 ? clearFilters : undefined
          }
        />
      ) : (
        <JobsTable
          jobs={displayed}
          footer={
            <JobsListFooter
              showing={displayed.length}
              total={filtered.length}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          }
        />
      )}
    </div>
  );
}
