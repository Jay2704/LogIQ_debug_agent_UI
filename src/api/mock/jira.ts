import type { JiraService } from "@/api/contracts";
import type { JiraTicketSearchHit } from "@/types";

const MOCK_SEARCH_CATALOG: JiraTicketSearchHit[] = [
  {
    key: "LOG-101",
    summary: "Checkout API returns 500 when promo code is applied",
    status: "In Progress",
    priority: "High",
    updatedAt: "2026-04-01T14:22:00.000Z",
  },
  {
    key: "LOG-204",
    summary: "Intermittent timeout on payment gateway webhook",
    status: "To Do",
    priority: "Medium",
    updatedAt: "2026-03-28T09:15:00.000Z",
  },
  {
    key: "OPS-88",
    summary: "Redis connection pool exhaustion during peak traffic",
    status: "Open",
    priority: "Critical",
    updatedAt: "2026-04-06T11:40:00.000Z",
  },
  {
    key: "LOG-310",
    summary: "Null pointer in promo validation after deploy",
    status: "In Review",
    priority: "High",
    updatedAt: "2026-04-05T16:05:00.000Z",
  },
];

export const mockJiraService: JiraService = {
  async searchTickets(query: string) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return MOCK_SEARCH_CATALOG.filter(
      (row) =>
        row.key.toLowerCase().includes(q) || row.summary.toLowerCase().includes(q)
    );
  },
  async getTicketSummary(ticketKey: string) {
    const normalizedKey = ticketKey.trim().toUpperCase();
    return {
      key: normalizedKey,
      summary: "Checkout API returns 500 when promo code is applied",
      status: "In Progress",
      priority: "High",
      labels: ["checkout", "api", "incident"],
      cleanedDescription:
        "Customers see intermittent 500 responses on checkout when promo validation times out. Impact started after the latest deployment window.",
      extractedHints: [
        "Started after deployment window",
        "Related to promo validation timeout",
        "Checkout API is the impacted surface",
      ],
    };
  },
  async runRcaWithTicket({ ticket, logContent }) {
    const totalLines = logContent.split("\n").filter(Boolean).length;
    const hasTimeout = /timeout|timed out|deadline exceeded/i.test(logContent);
    const hasNullPointer = /nullpointer|cannot read properties of null/i.test(logContent);

    const rootCause = hasNullPointer
      ? "Null reference in promo-validation branch causes checkout handler crash."
      : hasTimeout
        ? "Promo validation dependency timeout cascades into checkout 500 responses."
        : "Checkout service error path in promo application flow.";

    const extractedLogSignals = [
      ...(hasTimeout ? ["Repeated timeout events around promo validation dependency."] : []),
      ...(hasNullPointer ? ["Null-pointer pattern observed in checkout request path."] : []),
      `Parsed ${totalLines.toLocaleString()} log lines from uploaded file.`,
      `Ticket context ${ticket.key} aligned with checkout error signals.`,
    ];

    return {
      rootCause,
      confidence: hasNullPointer || hasTimeout ? 0.89 : 0.68,
      evidenceSummary: [
        `${ticket.key}: ${ticket.summary}`,
        `Ticket priority ${ticket.priority}; status ${ticket.status}.`,
        "Error spikes correlate with promo code application requests.",
      ],
      extractedLogSignals,
      explanation:
        "Mock RCA combines normalized ticket context with uploaded logs and ranks the most likely failure mode for checkout flow.",
      remediationSuggestions: [
        "Add a timeout guard and fallback path around promo validation calls.",
        "Instrument checkout handler with request-level error context for faster triage.",
        "Ship a targeted regression test for promo-code checkout flow before rollout.",
      ],
    };
  },
};
