import {
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";
import type { RcaEvaluationSummary } from "@/types";

function formatRate(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(pct)}%`;
}

interface EvaluationKpiGridProps {
  summary: RcaEvaluationSummary;
}

export function EvaluationKpiGrid({ summary }: EvaluationKpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total investigations"
        value={summary.totalInvestigations.toLocaleString()}
        subtitle="Indexed in evaluation window"
        icon={Target}
        variant="blue"
      />
      <KpiCard
        title="Total feedback"
        value={summary.totalFeedback.toLocaleString()}
        subtitle="Reviewer actions recorded"
        icon={MessageSquare}
        variant="violet"
      />
      <KpiCard
        title="Confirmation rate"
        value={formatRate(summary.confirmationRate)}
        subtitle="Share of confirm actions"
        icon={ThumbsUp}
        variant="green"
      />
      <KpiCard
        title="Rejection rate"
        value={formatRate(summary.rejectionRate)}
        subtitle="Share of reject actions"
        icon={ThumbsDown}
        variant="red"
      />
      <KpiCard
        title="Override rate"
        value={formatRate(summary.overrideRate)}
        subtitle="Manual RCA overrides"
        icon={ShieldAlert}
        variant="amber"
      />
      <KpiCard
        title="Average confidence"
        value={formatRate(summary.averageConfidence)}
        subtitle="Mean deterministic score"
        icon={TrendingUp}
        variant="blue"
      />
      <KpiCard
        title="High confidence accuracy"
        value={formatRate(summary.highConfidenceAccuracy)}
        subtitle="Accuracy when confidence > 80%"
        icon={CheckCircle2}
        variant="green"
      />
    </div>
  );
}
