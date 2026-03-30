import { useMemo, useState } from "react";
import { JobsTable } from "@/components/ui/JobsTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterDropdown, type FilterOption } from "@/components/ui/FilterDropdown";
import { RunDebugButton } from "@/components/ui/RunDebugButton";
import { useJobs } from "@/api/hooks";
import { PageLoading } from "@/components/ui/PageLoading";
import type { JobStatus, TriggerType } from "@/types";

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
  const { data: jobs, loading, error } = useJobs();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [trigger, setTrigger] = useState("all");

  const filtered = useMemo(() => {
    if (!jobs) return [];
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchQ =
        !q ||
        j.id.toLowerCase().includes(q) ||
        j.anomalyId.toLowerCase().includes(q);
      const matchS =
        status === "all" || j.status === (status as JobStatus);
      const matchT =
        trigger === "all" || j.trigger === (trigger as TriggerType);
      return matchQ && matchS && matchT;
    });
  }, [jobs, query, status, trigger]);

  if (loading) {
    return <PageLoading message="Loading jobs…" />;
  }

  if (error) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="ui-page-title">Debug jobs</h1>
          <p className="ui-page-desc">
            Search by job ID or anomaly ID, filter by status and trigger.
          </p>
        </div>
        <RunDebugButton />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-slate-500">
            Search
          </label>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="dbg_… or anomaly_…"
            aria-label="Search jobs"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
          <FilterDropdown
            label="Trigger"
            options={triggerOptions}
            value={trigger}
            onChange={setTrigger}
          />
        </div>
      </div>

      <JobsTable jobs={filtered} />
    </div>
  );
}
