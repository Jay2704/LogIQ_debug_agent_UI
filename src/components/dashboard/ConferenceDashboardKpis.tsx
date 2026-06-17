import { Activity, AlertTriangle, CheckCircle2, Clock, Layers } from "lucide-react";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { CONFERENCE_DASHBOARD_METRICS } from "@/data/demo/conferenceDemoData";

/** Conference demo headline metrics — shown when {@link DEMO_MODE} is enabled. */
export function ConferenceDashboardKpis() {
  const m = CONFERENCE_DASHBOARD_METRICS;
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <DashboardKpiCard
        title="Active Investigations"
        value={String(m.activeInvestigations)}
        subtitle="Open + in progress"
        icon={Layers}
        accent="ice"
      />
      <DashboardKpiCard
        title="Critical Incidents"
        value={String(m.criticalIncidents)}
        subtitle="Sev-1 / critical anomalies"
        icon={AlertTriangle}
        accent="rose"
      />
      <DashboardKpiCard
        title="RCA Success Rate"
        value={`${m.rcaSuccessRate}%`}
        subtitle="Last 30 days"
        icon={CheckCircle2}
        accent="emerald"
      />
      <DashboardKpiCard
        title="Avg Resolution Time"
        value={`${m.avgResolutionMinutes} min`}
        subtitle="Ticket → RCA complete"
        icon={Clock}
        accent="amber"
      />
      <DashboardKpiCard
        title="Total RCA Runs"
        value={String(m.totalRcaRuns)}
        subtitle="Workspace lifetime"
        icon={Activity}
        accent="ice"
      />
    </section>
  );
}
