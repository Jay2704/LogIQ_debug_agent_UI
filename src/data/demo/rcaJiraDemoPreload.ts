import type { JiraRcaResult, JiraTicketSummary } from "@/types";
import type { RecentInvestigationEntry } from "@/lib/recentInvestigations";
import {
  CONFERENCE_INVESTIGATIONS,
  getConferenceJiraRcaResult,
  getConferenceJiraTicketSummary,
} from "./conferenceDemoData";

/** Sample log bundled for offline RCA with JIRA demo (13 lines). */
export const CONFERENCE_OTP_LOG_CONTENT = `2026-04-08T10:01:01Z INFO auth-service Request received request_id=req_101 user_id=usr_77 endpoint=/login

2026-04-08T10:01:02Z INFO auth-service MFA challenge initiated user_id=usr_77 method=otp channel=sms

2026-04-08T10:01:03Z INFO auth-service OTP validation started request_id=req_101 user_id=usr_77

2026-04-08T10:01:04Z ERROR auth-service OTP validation timeout request_id=req_101 user_id=usr_77

Traceback (most recent call last):
  File "/srv/auth/otp_service.py", line 112, in validate_otp
    raise TimeoutError("OTP validation timeout")

TimeoutError: OTP validation timeout`;

export const CONFERENCE_OTP_LOG_FILE_NAME = "otp_validation_timeout.log";

export interface RcaJiraDemoPreloadState {
  ticketKey: string;
  ticket: JiraTicketSummary;
  logFileName: string;
  logContent: string;
  logLines: string[];
  rcaResult: JiraRcaResult;
  recentInvestigations: RecentInvestigationEntry[];
}

function buildDemoInvestigationHistory(): RecentInvestigationEntry[] {
  return CONFERENCE_INVESTIGATIONS.map((job) => {
    const jobId = job.jobId ?? job.id;
    return {
      id: `demo-${jobId}`,
      timestamp: job.createdAt,
      ticket: {
        key: jobId,
        summary: job.userSummary ?? jobId,
        status: job.status === "completed" ? "Resolved" : "Open",
        priority: jobId === "INV-1001" ? "High" : "Medium",
        extractedHints: [],
      },
      rca: {
        rootCause:
          jobId === "INV-1001"
            ? "/srv/auth/otp_service.py"
            : jobId === "INV-1002"
              ? "/services/payments/gateway_client.py"
              : jobId === "INV-1003"
                ? "/streaming/consumer_worker.py"
                : jobId === "INV-1004"
                  ? "/db/connection_pool.py"
                  : "/middleware/rate_limit.py",
        summary: job.userSummary ?? "RCA completed",
      },
      log: {
        fileName:
          jobId === "INV-1001"
            ? CONFERENCE_OTP_LOG_FILE_NAME
            : jobId === "INV-1002"
              ? "payment_gateway_timeout.log"
              : jobId === "INV-1003"
                ? "kafka_consumer_lag.log"
                : jobId === "INV-1004"
                  ? "db_pool_exhaustion.log"
                  : "rate_limiter_failure.log",
        lineCount: 13,
      },
    };
  });
}

/** Fully populated RCA-with-JIRA state for conference demo landing. */
export function getRcaJiraDemoPreloadState(): RcaJiraDemoPreloadState {
  const ticket = getConferenceJiraTicketSummary("LAAA-78");
  const logContent = CONFERENCE_OTP_LOG_CONTENT;
  const logLines = logContent.split("\n");
  const rcaResult = getConferenceJiraRcaResult(ticket, logContent);

  return {
    ticketKey: ticket.key,
    ticket,
    logFileName: CONFERENCE_OTP_LOG_FILE_NAME,
    logContent,
    logLines,
    rcaResult,
    recentInvestigations: buildDemoInvestigationHistory(),
  };
}
