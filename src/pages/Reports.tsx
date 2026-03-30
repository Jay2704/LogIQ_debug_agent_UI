import { ReportArtifactCard } from "@/components/ui/ReportArtifactCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { useReportsList } from "@/api/hooks";

export function Reports() {
  const { data, loading, error } = useReportsList();

  if (loading) {
    return <PageLoading message="Loading reports…" />;
  }

  if (error) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  const sorted = [...(data ?? [])].sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Reports</h1>
        <p className="ui-page-desc">
          Investigation Report artifacts with downloadable exports (mock). Each
          ties to an anomaly_id and generated_at timestamp.
        </p>
      </div>

      <div className="grid gap-4">
        {sorted.map((r) => (
          <ReportArtifactCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
