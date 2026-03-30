import { ReportArtifactCard } from "@/components/ui/ReportArtifactCard";
import { mockReports } from "@/data/mock";

export function Reports() {
  const sorted = [...mockReports].sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500">
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
