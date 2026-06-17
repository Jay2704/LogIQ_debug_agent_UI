import { DashboardHomeHero } from "@/components/landing/DashboardHomeHero";
import { ConferenceDashboardKpis } from "@/components/dashboard/ConferenceDashboardKpis";
import { FeaturesGrid } from "@/components/dashboard/FeaturesGrid";
import { ProductPreviewCard } from "@/components/landing/ProductPreviewCard";
import { DEMO_MODE } from "@/lib/demoMode";

export function Dashboard() {
  return (
    <div className="space-y-10">
      <DashboardHomeHero showWorkflow={false} showPreviewCard={false} />
      {DEMO_MODE ? (
        <ConferenceDashboardKpis />
      ) : null}
      <div style={{ marginTop: "40px", paddingBottom: "40px" }}>
        <FeaturesGrid />
      </div>
      <div className="h-px w-full bg-cyber/[0.12]" />
      <div style={{ marginTop: "40px", paddingBottom: "60px" }}>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">
          {DEMO_MODE ? "Featured Investigation" : "Example Investigation"}
        </h2>
        <div className="mx-auto max-w-4xl">
          <ProductPreviewCard />
        </div>
      </div>
    </div>
  );
}
