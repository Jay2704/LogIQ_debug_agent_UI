import type { JiraService } from "@/api/contracts";

export const mockJiraService: JiraService = {
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
      evidenceSummary: [
        `${ticket.key}: ${ticket.summary}`,
        `Ticket priority ${ticket.priority}; status ${ticket.status}.`,
        "Error spikes correlate with promo code application requests.",
      ],
      extractedLogSignals,
      explanation:
        "Mock RCA combines normalized ticket context with uploaded logs and ranks the most likely failure mode for checkout flow.",
    };
  },
};
