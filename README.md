# LogIQ Debug Agent — Frontend

React + Vite UI for the LogIQ debug agent workflow (jobs, investigations, RCA, explanations).

> **Backend is a separate repository.** This app only needs a configurable **API origin**; it does not embed a server URL in source code. Point `VITE_API_BASE_URL` at wherever your API is hosted (local or remote).

## Development

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (Vite’s default is port `5173`).

```bash
npm run build   # production bundle
npm run preview # serve dist locally
```

## Frontend integration (API)

All live HTTP calls go through `api` from `@/api`, which uses **`VITE_API_BASE_URL`** as the only origin (via `createHttpApi` → `joinApiUrl`). There are no hardcoded backend hosts in application code.

### Required env vars (live backend)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend **origin** only: `https://api.example.com` or `http://localhost:<port>` — **no path suffix**. |
| `VITE_USE_HTTP` | Must be the string `true` (case-insensitive) to enable the HTTP client. |

Optional legacy alias: **`VITE_API_URL`** — used only if `VITE_API_BASE_URL` is unset (same semantics).

### Mock mode (no backend)

Use any of:

- Omit `VITE_USE_HTTP` or set it to something other than `true`, or  
- Leave `VITE_API_BASE_URL` empty — even with `VITE_USE_HTTP=true`, the app **falls back to mocks** if the base URL is missing.

Data comes from `src/data/mock/` via `createMockApi()`. Hybrid HTTP mode still uses mocks for routes that are not wired to the backend yet (see `createHttpApi`).

### Live backend mode (local or deployed)

1. Copy `.env.example` to `.env` or `.env.local`.
2. Set `VITE_API_BASE_URL` to your running API’s origin.
3. Set `VITE_USE_HTTP=true`.
4. Restart the dev server or rebuild.

**CORS:** the browser calls the API origin directly; the backend must allow this app’s origin.

**Production:** set the same `VITE_*` variables in your host’s build environment; values are baked in at **build** time.

## UI screenshots

PNG files live under [`src/assets/`](src/assets/). Paths below are relative to the repo root so images render on GitHub.

### Dashboard

![Dashboard — command center](src/assets/dashboard.png)

### Jobs

![Jobs — workspace](src/assets/jobs.png)

### Anomalies

![Anomalies](src/assets/anomalies.png)

### Insights

![Insights — analytics](src/assets/Insights.png)

### Reports

![Reports](src/assets/reports.png)

---

You can add more captures to `src/assets/` when ready, for example: `job-detail.png`, `utilities.png`, `login.png`, `signup.png`.
