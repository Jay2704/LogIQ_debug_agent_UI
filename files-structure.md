# Project file structure

This document lists tracked source and configuration files in **LogIQ Debug Agent UI** (excluding `node_modules/`, `.git/`, and build output such as `dist/`), with a short purpose and what each file does.

---

## Root — configuration and metadata

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `package.json` | npm manifest | Declares the app name, scripts (`dev`, `build`, `lint`, `preview`), and dependencies (React, React Router, Vite, Tailwind, Recharts, Lucide icons). |
| `package-lock.json` | Lockfile | Pins exact dependency versions for reproducible installs. |
| `index.html` | Vite HTML entry | Loads fonts, favicon, the `#root` mount point, and the bundled `/src/main.tsx` module. |
| `vite.config.ts` | Vite (TypeScript) | Configures the React plugin, `@` → `./src` path alias, and build/dev behavior. |
| `vite.config.js` | Vite (JavaScript) | Duplicate-style config mirroring `vite.config.ts`; Vite resolves one of them—keep in sync or remove the redundant file. |
| `tsconfig.json` | TypeScript solution | References `tsconfig.app.json` and `tsconfig.node.json` for a split app/tooling setup. |
| `tsconfig.app.json` | App TS compiler options | Strict React app settings, path alias `@/*`, includes only `src/`. |
| `tsconfig.node.json` | Node/tooling TS options | Used for Vite/config files that run in Node. |
| `tailwind.config.js` | Tailwind CSS | Theme, content paths, and Tailwind customization for the UI. |
| `postcss.config.js` | PostCSS | Wires Tailwind and Autoprefixer for processed CSS. |
| `eslint.config.js` | ESLint (flat config) | Lint rules for the project (React, TypeScript, hooks, refresh). |
| `.gitignore` | Git ignore rules | Excludes dependencies, build artifacts, env files, and editor noise from version control. |
| `README.md` | Project readme | Human-facing overview and how to run the project. |
| `LICENSE` | License text | Legal terms for the repository. |

---

## Root — folders

| Path | Purpose | Brief explanation |
|------|---------|-------------------|
| `assets/` | Placeholder assets | Contains `.gitkeep` so the folder exists in git; extend with shared static assets if needed. |
| `public/` | Static public files | Files served as-is at site root (e.g. favicon). |

---

## `public/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `public/favicon.svg` | Site icon | SVG favicon referenced from `index.html`. |

---

## `src/` — application entry

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `src/main.tsx` | React bootstrap | Creates the root, wraps the app in `StrictMode` and `BrowserRouter`, imports global CSS. |
| `src/App.tsx` | Route tree | Declares routes for login/signup and the main shell (`AppLayout`) with dashboard, jobs, anomalies, insights, reports, utilities, settings, and 404. |
| `src/index.css` | Global styles | Tailwind layers and app-wide CSS variables and base styling. |
| `src/vite-env.d.ts` | Vite types | Triple-slash reference for Vite client types (`import.meta.env`, etc.). |

---

## `src/assets/` — images

| Files | Purpose | Brief explanation |
|-------|---------|-------------------|
| `Insights.png`, `anomalies.png`, `dashboard.png`, `jobs.png`, `reports.png` | UI imagery | PNG assets used in navigation or marketing-style UI (e.g. sidebar or empty states). |

---

## `src/api/` — data layer

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `config.ts` | API mode | Reads `VITE_API_URL` and `VITE_USE_HTTP` to decide mock vs HTTP. |
| `contracts.ts` | API surface types | `LogIQApi` and service interfaces (jobs, anomalies, RCA, reports, etc.). |
| `types.ts` | API-related types | Shared request/response or service-level types used with the client. |
| `client.ts` | API factory | `createApiClient()` returns mock or `createHttpApi`; exports singleton `api`. |
| `index.ts` | Public API barrel | Re-exports `api`, config flags, HTTP factory, and types for clean imports from `@/api`. |

### `src/api/http/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `createHttpApi.ts` | Future HTTP client | Stub implementing `LogIQApi` that throws until real `fetch` endpoints are wired. |

### `src/api/mock/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `mockApi.ts` | Mock API implementation | Implements `LogIQApi` using in-memory data from `src/data/mock/`. |
| `jobs.ts`, `anomalies.ts`, `dashboard.ts`, `rca.ts`, `reports.ts`, `insights.ts`, `utilitiesTools.ts` | Mock data slices | Domain-specific fixtures consumed by `mockApi`. |

### `src/api/hooks/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `index.ts` | Hooks barrel | Re-exports data hooks for pages. |
| `useJobs.ts` | Jobs list | Fetches or loads job list data via `api`. |
| `useJobDetailData.ts` | Job detail bundle | Loads job detail, RCA, evidence, etc., for `JobDetail`. |
| `useAnomaliesData.ts` | Anomalies | Loads anomaly list for the Anomalies page. |
| `useDashboardData.ts` | Dashboard aggregates | KPIs and summary metrics for the dashboard. |
| `useDashboardWidgets.ts` | Dashboard widgets | Extra dashboard widgets (e.g. charts, top files). |
| `useInsightMetrics.ts` | Insights | Metrics for the Insights page. |
| `useReportsList.ts` | Reports | Report listing and related queries. |
| `useUtilitiesData.ts` | Utilities | Tools list and utility-related data. |

---

## `src/data/mock/` — fixtures (used by mock API)

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `index.ts` | Mock exports | Barrel exporting jobs, anomalies, RCA, explanations bundle, insights, reports, dashboard, utilities. |
| `jobs.ts` | Job fixtures | Sample jobs for tables and detail. |
| `anomalies.ts` | Anomaly fixtures | Sample anomalies. |
| `rca.ts` | RCA fixtures | Root-cause data keyed by job. |
| `explanations.ts` | Explanation bundles | Text/explanation payloads for job detail. |
| `insights.ts` | Insight metrics mocks | Recurring signals / metrics samples. |
| `reports.ts` | Report mocks | Report list and lookup by anomaly. |
| `dashboard.ts` | Dashboard mocks | Anomaly activity, top root-cause files, etc. |
| `utilities.ts` | Utilities catalog | Tool definitions and usage metadata. |
| `utilityWorkspaceMocks.ts` | Utility workspaces | Per-tool sample input/output for workspace UIs. |

---

## `src/types/` — TypeScript domain models

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `index.ts` | Types barrel | Re-exports domain types. |
| `auth.ts` | Auth shapes | Login/signup form and session-related types. |
| `domain/common.ts` | Shared primitives | IDs, timestamps, enums shared across domains. |
| `domain/job.ts` | Jobs | Job, status, and job-list types. |
| `domain/anomaly.ts` | Anomalies | Anomaly records and fields. |
| `domain/rca.ts` | RCA | Root-cause analysis structures. |
| `domain/explanation.ts` | Explanations | Explanation panels and narrative types. |
| `domain/report.ts` | Reports | Report entities and links to anomalies. |
| `domain/dashboard.ts` | Dashboard | Widget and KPI types. |
| `domain/insights.ts` | Insights | Insight metrics types. |
| `domain/utilities.ts` | Utilities | Tool IDs, categories, run results. |
| `domain/bundle.ts` | Aggregates | Composite bundles (e.g. job detail with nested data). |

---

## `src/lib/` — shared utilities

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `utils.ts` | General helpers | `cn` (class names), formatting, small pure helpers. |
| `ui.ts` | UI tokens | Shared layout/spacing or design tokens used across components. |
| `ctaTheme.ts` | CTA / accent theme | Colors and styles for buttons and calls-to-action. |
| `authValidation.ts` | Form validation | Rules or validators for login/signup fields. |
| `authHandlers.ts` | Auth actions | Submit handlers or mock auth flow logic. |
| `insights.ts` | Insight helpers | Pure functions for insight metrics or display. |
| `utilityCategories.ts` | Utilities taxonomy | Categories/labels for grouping tools. |
| `utilityIcons.tsx` | Utility icons | Maps tool IDs to Lucide (or similar) icon components. |

---

## `src/hooks/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `useSimulatedUtilityRun.ts` | Simulated runs | Drives fake progress/delay when “running” a utility in the UI without a backend. |

---

## `src/components/layout/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `AppLayout.tsx` | Main shell | Sidebar, top bar, quick nav, and `<Outlet />` for child routes. |
| `Sidebar.tsx` | Primary navigation | App sections and branding. |
| `Topbar.tsx` | Header bar | Title, actions, or global controls. |
| `QuickNav.tsx` | Secondary nav | Shortcuts or breadcrumbs-style navigation. |

---

## `src/components/auth/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `AuthLayout.tsx` | Auth page frame | Centered layout for login/signup. |
| `AuthField.tsx` | Form field | Labeled input with consistent styling. |
| `index.ts` | Barrel | Re-exports auth components. |

---

## `src/components/ui/` — reusable primitives

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `StatusBadge.tsx` | Status pill | Colored badge for job/anomaly status. |
| `KpiCard.tsx` | KPI tile | Metric card for dashboards. |
| `ChartCard.tsx` | Chart container | Wraps Recharts or similar with title and chrome. |
| `JobsTable.tsx` | Jobs grid | Sortable/filterable table of jobs. |
| `JobsTableSkeleton.tsx` | Loading skeleton | Placeholder rows while jobs load. |
| `JobsEmptyState.tsx` | Empty jobs | Message when no jobs match. |
| `JobsListFooter.tsx` | List footer | Pagination or summary under the jobs table. |
| `FilterDropdown.tsx` | Filters | Dropdown for filtering lists. |
| `SearchInput.tsx` | Search | Debounced or controlled search field. |
| `SegmentedControl.tsx` | Segmented toggle | Two-or-more-way switch (e.g. view modes). |
| `PageLoading.tsx` | Full-page loader | Spinner or skeleton for route-level loading. |
| `EmptyState.tsx` | Generic empty | Illustration/message when there is no data. |
| `EvidenceList.tsx` | Evidence items | List of evidence snippets for investigations. |
| `ExplanationPanel.tsx` | Explanation UI | Collapsible or structured explanation text. |
| `RcaResultCard.tsx` | RCA summary | Card summarizing root-cause output. |
| `ReportArtifactCard.tsx` | Report artifact | Card linking to or previewing a report. |
| `ConfidenceProgressBar.tsx` | Confidence | Visual confidence score for RCA or models. |
| `RunDebugButton.tsx` | Primary action | CTA to start debug/run flows. |
| `SectionHeader.tsx` | Section title | Heading + optional action for page sections. |
| `StepProgressBar.tsx` | Steps | Multi-step progress for wizards or pipelines. |

---

## `src/components/dashboard/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `DashboardKpiCard.tsx` | Dashboard KPI | Specialized KPI for the home dashboard. |
| `InvestigationCard.tsx` | Investigation summary | Card for active or recent investigations. |
| `AnomalyActivityMiniChart.tsx` | Sparkline | Small chart of anomaly activity over time. |
| `TopRootCauseFiles.tsx` | Top files widget | Lists files most associated with root causes. |
| `SystemHealthPanel.tsx` | Health panel | System or pipeline health indicators. |

---

## `src/components/insights/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `RecurringSignalsWidget.tsx` | Recurring signals | Widget showing repeated patterns across incidents. |

---

## `src/components/job/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `JobReportSummaryCard.tsx` | Job report | Summary of report content for a job. |
| `EvidenceMetadataRow.tsx` | Evidence meta | Row showing source, time, or type for evidence. |
| `SimilarIncidentsPanel.tsx` | Related incidents | Panel listing similar past jobs or anomalies. |
| `RemediationChecklist.tsx` | Remediation | Checklist of suggested fix steps. |

---

## `src/components/utilities/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `UtilityCard.tsx` | Tool card | Card in the utilities grid with description and actions. |
| `UtilityRunButton.tsx` | Run control | Button to execute a utility with loading state. |
| `UtilityToolLayout.tsx` | Tool page layout | Sidebar + main area for a selected utility. |
| `UtilityToolSidebar.tsx` | Tool navigation | List of tools or sections within utilities. |
| `UtilityWorkspaceView.tsx` | Workspace router | Picks the correct workspace component by tool ID. |

### `src/components/utilities/workspaces/`

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `KeywordSearchWorkspace.tsx` | Keyword search UI | Input/output UI for log keyword search. |
| `LogSummaryWorkspace.tsx` | Log summary | Summarization tool workspace. |
| `StackTraceParserWorkspace.tsx` | Stack traces | Parses and displays stack traces. |
| `ErrorLinesExtractorWorkspace.tsx` | Error lines | Extracts error lines from logs. |
| `ErrorSplitterWorkspace.tsx` | Error splitting | Splits or groups error blocks. |
| `RootCauseHeuristicsWorkspace.tsx` | Heuristics | Heuristic RCA exploration UI. |
| `TimeSliceWorkspace.tsx` | Time slicing | Time-range or slice analysis for logs. |

---

## `src/pages/` — route screens

| File | Purpose | Brief explanation |
|------|---------|-------------------|
| `Dashboard.tsx` | `/` | Main dashboard with KPIs, charts, and health. |
| `Jobs.tsx` | `/jobs` | Job list with filters and navigation to detail. |
| `JobDetail.tsx` | `/jobs/:jobId` | Single job: evidence, RCA, similar incidents, remediation. |
| `Anomalies.tsx` | `/anomalies` | Anomaly list and exploration. |
| `Insights.tsx` | `/insights` | Insight metrics and recurring signals. |
| `Reports.tsx` | `/reports` | Reports index and links to anomalies. |
| `Utilities.tsx` | `/utilities` | Grid of debugging utilities. |
| `UtilityDetail.tsx` | `/utilities/:toolId` | Single utility with workspace and run simulation. |
| `Settings.tsx` | `/settings` | App settings placeholder or preferences. |
| `Login.tsx` | `/login` | Sign-in form. |
| `Signup.tsx` | `/signup` | Registration form. |
| `NotFound.tsx` | `*` | 404 page for unknown routes inside the layout. |

---

## Generated / install-only (not listed exhaustively)

- **`node_modules/`** — Installed packages from npm; do not edit by hand.
- **`dist/`** — Production build output from `npm run build` (if present).

---

*Generated for the LogIQ Debug Agent UI codebase. Paths are relative to the repository root.*
