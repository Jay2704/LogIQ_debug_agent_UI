import type {
  Anomaly,
  EvidenceItem,
  InsightMetrics,
  Job,
  JobDetailBundle,
  JiraRcaResult,
  JiraTicketSearchHit,
  JiraTicketSummary,
  RcaResult,
  SimilarIncident,
} from "@/types";

/** Headline KPIs for the conference dashboard strip. */
export const CONFERENCE_DASHBOARD_METRICS = {
  activeInvestigations: 12,
  criticalIncidents: 3,
  rcaSuccessRate: 94,
  avgResolutionMinutes: 18,
  totalRcaRuns: 243,
} as const;

export const CONFERENCE_INVESTIGATIONS: Job[] = [
  {
    id: "INV-1001",
    jobId: "INV-1001",
    anomalyId: "anomaly-conf-001",
    status: "completed",
    trigger: "alert",
    createdAt: "2026-06-16T08:14:22Z",
    service: "auth-service",
    userSummary: "MFA Authentication Failure",
  },
  {
    id: "INV-1002",
    jobId: "INV-1002",
    anomalyId: "anomaly-conf-002",
    status: "completed",
    trigger: "webhook",
    createdAt: "2026-06-16T06:42:11Z",
    service: "payment-service",
    userSummary: "Payment Gateway Timeout",
  },
  {
    id: "INV-1003",
    jobId: "INV-1003",
    anomalyId: "anomaly-conf-005",
    status: "running",
    trigger: "manual",
    createdAt: "2026-06-16T05:18:44Z",
    service: "analytics-service",
    userSummary: "Kafka Consumer Lag Spike",
  },
  {
    id: "INV-1004",
    jobId: "INV-1004",
    anomalyId: "anomaly-conf-004",
    status: "completed",
    trigger: "alert",
    createdAt: "2026-06-15T22:31:09Z",
    service: "user-profile-service",
    userSummary: "Database Pool Exhaustion",
  },
  {
    id: "INV-1005",
    jobId: "INV-1005",
    anomalyId: "anomaly-conf-003",
    status: "running",
    trigger: "scheduled",
    createdAt: "2026-06-15T19:05:33Z",
    service: "api-gateway",
    userSummary: "Rate Limiter Failure",
  },
];

export const CONFERENCE_ANOMALIES: Anomaly[] = [
  {
    id: "anomaly-conf-001",
    service: "Auth Service",
    severity: "critical",
    status: "resolved",
    detectedAt: "2026-06-16T08:12:00Z",
    summary: "OTP Validation Timeout",
    signalType: "Auth logs + latency SLO",
  },
  {
    id: "anomaly-conf-002",
    service: "Payment Service",
    severity: "high",
    status: "mitigated",
    detectedAt: "2026-06-16T06:40:18Z",
    summary: "Gateway Timeout",
    signalType: "Payment traces + partner status",
  },
  {
    id: "anomaly-conf-003",
    service: "Notification Service",
    severity: "medium",
    status: "open",
    detectedAt: "2026-06-15T19:02:44Z",
    summary: "Queue Backlog",
    signalType: "Queue depth + SES metrics",
  },
  {
    id: "anomaly-conf-004",
    service: "User Profile Service",
    severity: "high",
    status: "resolved",
    detectedAt: "2026-06-15T22:28:51Z",
    summary: "Connection Leak",
    signalType: "DB pool metrics + APM",
  },
  {
    id: "anomaly-conf-005",
    service: "Analytics Service",
    severity: "medium",
    status: "investigating",
    detectedAt: "2026-06-16T05:16:02Z",
    summary: "Kafka Consumer Lag",
    signalType: "Kafka lag + consumer metrics",
  },
];

export const CONFERENCE_JIRA_SEARCH: JiraTicketSearchHit[] = [
  {
    key: "LAAA-78",
    summary: "Users unable to complete MFA authentication",
    status: "Open",
    priority: "High",
    updatedAt: "2026-06-16T08:10:00.000Z",
  },
  {
    key: "LAAA-91",
    summary: "Payment processing latency spike",
    status: "In Progress",
    priority: "High",
    updatedAt: "2026-06-16T06:38:00.000Z",
  },
  {
    key: "LAAA-105",
    summary: "Kafka consumer backlog in production",
    status: "Open",
    priority: "High",
    updatedAt: "2026-06-16T05:14:00.000Z",
  },
  {
    key: "LAAA-118",
    summary: "Database pool exhaustion after deployment",
    status: "Resolved",
    priority: "Critical",
    updatedAt: "2026-06-15T22:25:00.000Z",
  },
  {
    key: "LAAA-132",
    summary: "Rate limiting bypass detected",
    status: "Monitoring",
    priority: "Medium",
    updatedAt: "2026-06-15T19:00:00.000Z",
  },
];

interface ConferenceInvestigationFixture {
  jobId: string;
  rootCausePath: string;
  confidence: number;
  priority: string;
  investigationStatus: string;
  evidenceSummary: string[];
  extractedSignals: string[];
  explanation: string;
  remediation: string[];
  evidence: EvidenceItem[];
  similarIncidents: SimilarIncident[];
  jiraKey: string;
  jiraSummary: string;
  logFileName: string;
}

const INVESTIGATION_FIXTURES: ConferenceInvestigationFixture[] = [
  {
    jobId: "INV-1001",
    rootCausePath: "/srv/auth/otp_service.py",
    confidence: 0.99,
    priority: "Critical",
    investigationStatus: "RCA Complete",
    evidenceSummary: [
      "Timeout exceptions increased 300%",
      "OTP validation latency exceeded SLA",
      "MFA failures correlate with recent deployment",
      "Retry attempts exhausted before timeout recovery",
    ],
    extractedSignals: [
      "timeout",
      "otp_validation",
      "auth_service",
      "retry_exhausted",
      "latency_spike",
    ],
    explanation:
      "The RCA engine identified otp_service.py as the most probable root cause. Analysis of stack traces, deployment history, and correlated timeout events indicates that OTP validation requests exceeded configured thresholds. The issue aligns with a recent deployment that modified authentication timeout handling and retry behavior.",
    remediation: [
      "Validate timeout configuration",
      "Review retry policy implementation",
      "Compare deployment changes",
      "Add timeout monitoring",
      "Add circuit breaker protection",
      "Validate OTP edge cases",
    ],
    evidence: [
      {
        id: "e1",
        label: "Timeout spike",
        detail: "OTP validation timeouts increased 300% within 8 minutes of deploy auth-service@2026.06.16-1.",
        source: "Logs",
      },
      {
        id: "e2",
        label: "Deploy correlation",
        detail: "Config diff in otp_service.py reduced upstream read timeout from 4.5s to 2.0s.",
        source: "CI/CD",
      },
      {
        id: "e3",
        label: "Regional impact",
        detail: "MFA failure rate correlated across us-east-1 and eu-west-1 with r=0.91.",
        source: "Metrics",
      },
    ],
    similarIncidents: [
      {
        id: "sim-2025-11-mfa",
        service: "auth-service",
        title: "MFA latency after auth deploy",
        occurredAt: "2025-11-08T14:22:00Z",
        overlap: "otp_service timeout regression; deploy window",
      },
    ],
    jiraKey: "LAAA-78",
    jiraSummary: "Users unable to complete MFA authentication",
    logFileName: "otp_validation_timeout.log",
  },
  {
    jobId: "INV-1002",
    rootCausePath: "/services/payments/gateway_client.py",
    confidence: 0.96,
    priority: "High",
    investigationStatus: "RCA Complete",
    evidenceSummary: [
      "Gateway client timeouts rose 220% during checkout peak",
      "External PSP latency exceeded configured connect timeout",
      "Retry storms amplified queue depth on capture workers",
      "Error budget burn concentrated on POST /v1/capture",
    ],
    extractedSignals: [
      "gateway_timeout",
      "payment_capture",
      "retry_storm",
      "external_dependency",
      "checkout_latency",
    ],
    explanation:
      "Deterministic RCA ranked gateway_client.py as the primary bottleneck. Partner latency spikes coincided with tightened connect timeouts introduced in the last release. Overlapping retries on the same capture intent increased tail latency and caused user-visible payment failures.",
    remediation: [
      "Raise connect and read timeouts for external gateway",
      "Cap parallel retries per capture id",
      "Add partner health circuit breaker",
      "Alert on capture p99 regression",
      "Run load test before payment deploys",
    ],
    evidence: [
      {
        id: "e1",
        label: "PSP latency",
        detail: "Partner status page reported elevated capture API latency during incident window.",
        source: "External",
      },
      {
        id: "e2",
        label: "Retry overlap",
        detail: "12 overlapping retries observed on single capture id within 90 seconds.",
        source: "Traces",
      },
    ],
    similarIncidents: [
      {
        id: "sim-2026-02-pay",
        service: "payment-service",
        title: "PSP maintenance retry storm",
        occurredAt: "2026-02-03T04:18:00Z",
        overlap: "gateway_client backoff; partner incident",
      },
    ],
    jiraKey: "LAAA-91",
    jiraSummary: "Payment processing latency spike",
    logFileName: "payment_gateway_timeout.log",
  },
  {
    jobId: "INV-1003",
    rootCausePath: "/streaming/consumer_worker.py",
    confidence: 0.88,
    priority: "High",
    investigationStatus: "Investigating",
    evidenceSummary: [
      "Consumer lag exceeded 120k messages on analytics-events topic",
      "Partition rebalance followed broker maintenance window",
      "Processing time per batch increased after schema change",
      "Downstream dashboards delayed by 18–22 minutes",
    ],
    extractedSignals: [
      "consumer_lag",
      "kafka_rebalance",
      "batch_processing",
      "schema_change",
      "analytics_pipeline",
    ],
    explanation:
      "RCA is in progress with strong signal on consumer_worker.py. Lag growth accelerated after a schema migration increased deserialization cost. Rebalance events temporarily reduced effective parallelism while backlog continued to ingest.",
    remediation: [
      "Scale consumer group replicas",
      "Rollback schema migration if safe",
      "Tune max.poll.interval and batch size",
      "Add lag-based autoscaling",
      "Partition hot keys review",
    ],
    evidence: [
      {
        id: "e1",
        label: "Lag trend",
        detail: "analytics-events consumer group lag crossed 100k threshold at 05:16 UTC.",
        source: "Kafka",
      },
    ],
    similarIncidents: [],
    jiraKey: "LAAA-105",
    jiraSummary: "Kafka consumer backlog in production",
    logFileName: "kafka_consumer_lag.log",
  },
  {
    jobId: "INV-1004",
    rootCausePath: "/db/connection_pool.py",
    confidence: 0.97,
    priority: "Critical",
    investigationStatus: "RCA Complete",
    evidenceSummary: [
      "Connection pool utilization sustained above 98% for 14 minutes",
      "Leak introduced in profile repository session cleanup path",
      "Deploy v3.2.1 touched connection_pool acquire/release helpers",
      "502 rate on profile reads correlated with pool exhaustion",
    ],
    extractedSignals: [
      "connection_leak",
      "pool_exhaustion",
      "profile_reads",
      "deployment_correlation",
      "db_timeout",
    ],
    explanation:
      "Graph analysis identified connection_pool.py as the dominant failure anchor. Sessions were not returned to the pool under error branches introduced in v3.2.1. Exhaustion cascaded into profile read timeouts and elevated 502 responses.",
    remediation: [
      "Fix session cleanup in error branches",
      "Add pool utilization alerts at 85%",
      "Canary deploy with connection leak detection",
      "Enable pool metrics dashboard",
      "Rollback v3.2.1 if leak persists",
    ],
    evidence: [
      {
        id: "e1",
        label: "Pool metrics",
        detail: "Active connections monotonically increased without matching release events.",
        source: "DB metrics",
      },
    ],
    similarIncidents: [
      {
        id: "sim-2025-09-db",
        service: "user-profile-service",
        title: "Pool saturation after ORM upgrade",
        occurredAt: "2025-09-19T11:40:00Z",
        overlap: "connection_pool leak pattern",
      },
    ],
    jiraKey: "LAAA-118",
    jiraSummary: "Database pool exhaustion after deployment",
    logFileName: "db_pool_exhaustion.log",
  },
  {
    jobId: "INV-1005",
    rootCausePath: "/middleware/rate_limit.py",
    confidence: 0.91,
    priority: "Medium",
    investigationStatus: "Monitoring",
    evidenceSummary: [
      "Rate limit bypass detected on internal admin routes",
      "Token bucket reset logic skipped for trusted CIDR range",
      "Abuse traffic pattern matched scanner fingerprint",
      "Mitigation deployed; monitoring for recurrence",
    ],
    extractedSignals: [
      "rate_limit_bypass",
      "token_bucket",
      "admin_routes",
      "scanner_traffic",
      "middleware_config",
    ],
    explanation:
      "RCA identified rate_limit.py misconfiguration allowing trusted-range bypass to apply too broadly. Scanner traffic exploited the gap before WAF rules were tightened. Post-fix monitoring shows normalized request rates.",
    remediation: [
      "Narrow trusted CIDR allowlist",
      "Add integration tests for bypass paths",
      "Enable per-route rate limit metrics",
      "Review middleware config in IaC",
      "Schedule quarterly limiter audit",
    ],
    evidence: [
      {
        id: "e1",
        label: "Bypass pattern",
        detail: "429 responses dropped to zero on /admin/* while global traffic unchanged.",
        source: "API gateway",
      },
    ],
    similarIncidents: [],
    jiraKey: "LAAA-132",
    jiraSummary: "Rate limiting bypass detected",
    logFileName: "rate_limiter_failure.log",
  },
];

function fixtureByJobId(jobId: string): ConferenceInvestigationFixture | undefined {
  return INVESTIGATION_FIXTURES.find((f) => f.jobId === jobId);
}

function fixtureByJiraKey(key: string): ConferenceInvestigationFixture | undefined {
  const normalized = key.trim().toUpperCase();
  return INVESTIGATION_FIXTURES.find((f) => f.jiraKey === normalized);
}

export function getConferenceRcaByJobId(jobId: string): RcaResult | undefined {
  const fx = fixtureByJobId(jobId);
  if (!fx) return undefined;
  const stepsComplete =
    fx.investigationStatus === "RCA Complete"
      ? {
          triage: "done" as const,
          rca: "done" as const,
          evidence: "done" as const,
          explanation: "done" as const,
          reporting: "done" as const,
        }
      : fx.investigationStatus === "Investigating"
        ? {
            triage: "done" as const,
            rca: "active" as const,
            evidence: "pending" as const,
            explanation: "pending" as const,
            reporting: "pending" as const,
          }
        : {
            triage: "done" as const,
            rca: "done" as const,
            evidence: "done" as const,
            explanation: "done" as const,
            reporting: "active" as const,
          };

  return {
    jobId: fx.jobId,
    fileId: `fid_${fx.rootCausePath.replace(/[^\w]+/g, "_")}`,
    runId: `run_${fx.jobId.toLowerCase()} · inv_demo`,
    rootCausePath: fx.rootCausePath,
    confidence: fx.confidence,
    rank: 1,
    evidenceRef: `ticket:${fx.jiraKey} · ${fx.logFileName}`,
    steps: stepsComplete,
  };
}

export const CONFERENCE_RCA_BY_JOB_ID: Record<string, RcaResult> = Object.fromEntries(
  CONFERENCE_INVESTIGATIONS.map((j) => {
    const rca = getConferenceRcaByJobId(j.id);
    return rca ? [j.id, rca] : [];
  }).filter((entry): entry is [string, RcaResult] => entry.length === 2)
);

export function getConferenceJobDetailBundle(jobId: string): JobDetailBundle | undefined {
  const job = CONFERENCE_INVESTIGATIONS.find((j) => j.id === jobId || j.jobId === jobId);
  const fx = fixtureByJobId(jobId);
  if (!job || !fx) return undefined;
  const anomaly = CONFERENCE_ANOMALIES.find((a) => a.id === job.anomalyId);
  const rca = getConferenceRcaByJobId(jobId);
  if (!anomaly || !rca) return undefined;

  return {
    job,
    jobRowSource: "mock",
    anomaly,
    rca,
    explanation: fx.explanation,
    evidence: fx.evidence,
    remediation: fx.remediation,
    similarIncidents: fx.similarIncidents,
    confidenceNote: `${Math.round(fx.confidence * 100)}% confidence — ${fx.investigationStatus}. Priority: ${fx.priority}.`,
    limitationsNote:
      "Conference demo dataset — representative of production RCA output; not live backend data.",
  };
}

export function getConferenceJiraTicketSummary(ticketKey: string): JiraTicketSummary {
  const normalized = ticketKey.trim().toUpperCase();
  if (normalized === "LAAA-78") {
    return {
      key: "LAAA-78",
      summary: "Users unable to complete MFA authentication",
      status: "Open",
      priority: "High",
      labels: ["sev1", "auth", "mfa"],
      cleanedDescription: "OTP validation timeout during MFA verification.",
      extractedHints: ["timeout", "otp_validation", "auth_service"],
    };
  }
  const fx = fixtureByJiraKey(ticketKey);
  const hit =
    CONFERENCE_JIRA_SEARCH.find((t) => t.key === ticketKey.trim().toUpperCase()) ??
    CONFERENCE_JIRA_SEARCH[0];
  const summary = fx?.jiraSummary ?? hit.summary;
  return {
    key: hit.key,
    summary,
    status: hit.status,
    priority: hit.priority,
    labels: ["incident", "production", "rca"],
    cleanedDescription: `${summary}. Impact observed in production with correlated log signals and elevated error rates.`,
    extractedHints: fx?.extractedSignals.slice(0, 3) ?? [
      "Production impact confirmed",
      "Correlated with recent deployment window",
      "Log signals support deterministic RCA ranking",
    ],
  };
}

export function getConferenceJiraRcaResult(
  ticket: JiraTicketSummary,
  _logContent: string
): JiraRcaResult {
  const fx = fixtureByJiraKey(ticket.key);
  if (fx) {
    return {
      rootCause: fx.rootCausePath,
      confidence: fx.confidence,
      evidenceSummary: fx.evidenceSummary,
      extractedLogSignals: [...fx.extractedSignals],
      explanation: fx.explanation,
      remediationSuggestions: fx.remediation,
    };
  }
  return {
    rootCause: "/services/unknown/handler.py",
    confidence: 0.72,
    evidenceSummary: [`${ticket.key}: ${ticket.summary}`],
    extractedLogSignals: ["demo_mode", "conference_fixture"],
    explanation: "Conference demo RCA synthesis from ticket context and uploaded logs.",
    remediationSuggestions: ["Review ranked file anchor", "Validate fix in staging"],
  };
}

export const CONFERENCE_INSIGHT_METRICS: InsightMetrics = {
  anomalyTrend: [
    { date: "Jun 10", count: 9 },
    { date: "Jun 11", count: 11 },
    { date: "Jun 12", count: 8 },
    { date: "Jun 13", count: 14 },
    { date: "Jun 14", count: 10 },
    { date: "Jun 15", count: 13 },
    { date: "Jun 16", count: 12 },
  ],
  anomaliesBySeverity: [
    { name: "Critical", value: 3, fill: "#f87171" },
    { name: "High", value: 8, fill: "#fb923c" },
    { name: "Medium", value: 14, fill: "#fbbf24" },
    { name: "Low", value: 6, fill: "#64748b" },
  ],
  confidenceDistribution: [
    { range: "0.0–0.5", count: 2 },
    { range: "0.5–0.7", count: 5 },
    { range: "0.7–0.85", count: 11 },
    { range: "0.85–1.0", count: 22 },
  ],
  topServices: [
    { service: "auth-service", count: 4 },
    { service: "payment-service", count: 3 },
    { service: "analytics-service", count: 2 },
    { service: "user-profile-service", count: 2 },
    { service: "api-gateway", count: 1 },
  ],
  recurringSignals: [
    {
      id: "sig-conf-001",
      label: "OTP validation timeout · MFA path",
      service: "auth-service",
      occurrences: 19,
      lastSeen: "2026-06-16T08:14:00Z",
      trendPct: 14,
    },
    {
      id: "sig-conf-002",
      label: "Gateway timeout · capture retries",
      service: "payment-service",
      occurrences: 15,
      lastSeen: "2026-06-16T06:42:00Z",
      trendPct: 9,
    },
    {
      id: "sig-conf-003",
      label: "Kafka consumer lag spike",
      service: "analytics-service",
      occurrences: 11,
      lastSeen: "2026-06-16T05:18:00Z",
      trendPct: 22,
    },
    {
      id: "sig-conf-004",
      label: "DB connection pool exhaustion",
      service: "user-profile-service",
      occurrences: 8,
      lastSeen: "2026-06-15T22:31:00Z",
      trendPct: -3,
    },
    {
      id: "sig-conf-005",
      label: "Rate limiter bypass · admin routes",
      service: "api-gateway",
      occurrences: 6,
      lastSeen: "2026-06-15T19:05:00Z",
      trendPct: 5,
    },
  ],
  avgResolutionMinutes: 18,
  totalAnomalies: 31,
  monitoredServices: 96,
};

export function getConferenceExplanationForJob(jobId: string): string {
  return fixtureByJobId(jobId)?.explanation ?? "";
}
