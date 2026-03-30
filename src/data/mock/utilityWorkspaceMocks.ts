/** Static demo content for utility workspace UIs — replace with API responses later */

export const MOCK_SOURCE_LOG = `2026-03-29T14:22:01Z INFO  checkout-service req=chk-8a2f cart_merge started user=u_9912
2026-03-29T14:22:01Z WARN  checkout-service req=chk-8a2f inventory_hold latency=842ms
2026-03-29T14:22:02Z ERROR checkout-service req=chk-8a2f PSP_TIMEOUT partner=stripe region=us-east-1
2026-03-29T14:22:02Z INFO  payment-gateway capture_id=cap_7qk retry=2 backoff_ms=400
2026-03-29T14:22:03Z ERROR payment-gateway PSP circuit half-open partner=stripe
2026-03-29T14:22:04Z INFO  checkout-service req=chk-8a2f cart_merge completed status=200`;

export const MOCK_NOISY_LOG = `${MOCK_SOURCE_LOG}
2026-03-29T14:22:05Z DEBUG auth-service token_refresh jti=jwk-rotate-canary
2026-03-29T14:22:06Z ERROR user-profile-api DynamoDB ConsistentReadStale user=4412
2026-03-29T14:22:07Z INFO  notification-service webhook_dlq depth=12 region=us-west-2`;

export const MOCK_STACK_TRACE = `com.checkout.handlers.CartMergeException: merge blocked — inventory version mismatch
	at com.checkout.handlers.CartMergeHandler.merge(CartMergeHandler.java:142)
	at com.checkout.api.CartController.postMerge(CartController.java:88)
	at jdk.internal.reflect.GeneratedMethodAccessor.invoke(Unknown Source)
	at io.netty.channel.AbstractChannelHandlerContext.invoke(AbstractChannelHandlerContext.java:374)`;

export const MOCK_TIME_FILTERED_LINES = [
  "2026-03-29T14:22:02Z ERROR checkout-service req=chk-8a2f PSP_TIMEOUT partner=stripe region=us-east-1",
  "2026-03-29T14:22:03Z ERROR payment-gateway PSP circuit half-open partner=stripe",
];

export const MOCK_ERROR_LINES = [
  "2026-03-29T14:22:02Z ERROR checkout-service req=chk-8a2f PSP_TIMEOUT partner=stripe region=us-east-1",
  "2026-03-29T14:22:03Z ERROR payment-gateway PSP circuit half-open partner=stripe",
];

export const MOCK_NON_ERROR_LINES = [
  "2026-03-29T14:22:01Z INFO  checkout-service req=chk-8a2f cart_merge started user=u_9912",
  "2026-03-29T14:22:01Z WARN  checkout-service req=chk-8a2f inventory_hold latency=842ms",
  "2026-03-29T14:22:02Z INFO  payment-gateway capture_id=cap_7qk retry=2 backoff_ms=400",
  "2026-03-29T14:22:04Z INFO  checkout-service req=chk-8a2f cart_merge completed status=200",
];

export const MOCK_LOG_SUMMARY_OUTPUT = `Primary failure mode: payment partner timeouts during cart merge (checkout-service → payment-gateway). Two ERROR lines within 1s correlate with PSP maintenance window. Inventory hold warning precedes timeout; not the ranked root cause but contributes to user-visible latency. Recommend: verify retry_manager backoff vs partner SLA and confirm circuit breaker thresholds.`;

export type MockParsedFrame =
  | {
      frame: number;
      exception: string;
      inApp: boolean;
    }
  | {
      frame: number;
      location: string;
      method: string;
      inApp: boolean;
    };

export const MOCK_PARSED_FRAMES: MockParsedFrame[] = [
  {
    frame: 0,
    exception:
      "com.checkout.handlers.CartMergeException: merge blocked — inventory version mismatch",
    inApp: true,
  },
  {
    frame: 1,
    location: "CartMergeHandler.java:142",
    method: "merge",
    inApp: true,
  },
  {
    frame: 2,
    location: "CartController.java:88",
    method: "postMerge",
    inApp: true,
  },
  {
    frame: 3,
    location: "GeneratedMethodAccessor",
    method: "invoke",
    inApp: false,
  },
];

export const MOCK_EXTRACTED_ERROR_LINES = [
  "ERROR checkout-service … PSP_TIMEOUT partner=stripe",
  "ERROR payment-gateway … PSP circuit half-open partner=stripe",
  "ERROR user-profile-api DynamoDB ConsistentReadStale user=4412",
];

export const MOCK_HEURISTIC_CLUSTERS = [
  {
    rank: 1,
    title: "PSP timeout cluster (checkout → payment)",
    confidence: 0.86,
    signals: ["trace:chk-us1-8a2f", "span retry_manager", "partner incident 14:20–14:35 UTC"],
  },
  {
    rank: 2,
    title: "Inventory hold latency spike",
    confidence: 0.62,
    signals: ["metric:inventory.hold_p99", "region us-east-1"],
  },
  {
    rank: 3,
    title: "Auth JWK rotation overlap",
    confidence: 0.41,
    signals: ["canary deploy auth-service@2026.03.29-2"],
  },
];

/** Sidebar “example” blurbs per tool */
export const UTILITY_EXAMPLES: Record<string, string[]> = {
  "keyword-search": [
    "Try ERROR, PSP_TIMEOUT, or a request id from your trace.",
    "Case-sensitive match helps with exact token searches.",
  ],
  "time-slice-filter": [
    "Narrow to incident window first, then run Keyword Search on the slice.",
  ],
  "error-splitter": [
    "Useful before feeding logs into Log Summary or heuristics.",
  ],
  "log-summary": [
    "Paste up to ~50k chars; production would chunk and stream.",
  ],
  "stack-trace-parser": [
    "Frames marked in-app are prioritized for RCA ranking.",
  ],
  "error-lines-extractor": [
    "Filters stack noise; lines still need human triage.",
  ],
  "root-cause-heuristics": [
    "Deterministic scoring — not a substitute for full RCA pipeline.",
  ],
};
