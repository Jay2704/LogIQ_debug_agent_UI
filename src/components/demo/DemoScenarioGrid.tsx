import type { DemoScenario } from "@/types";
import { DemoScenarioCard } from "./DemoScenarioCard";

interface DemoScenarioGridProps {
  scenarios: DemoScenario[];
  launchingId: string | null;
  onLaunch: (scenario: DemoScenario) => void;
}

export function DemoScenarioGrid({
  scenarios,
  launchingId,
  onLaunch,
}: DemoScenarioGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {scenarios.map((scenario) => (
        <DemoScenarioCard
          key={scenario.id}
          scenario={scenario}
          launching={launchingId === scenario.id}
          onLaunch={onLaunch}
        />
      ))}
    </div>
  );
}
