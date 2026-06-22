/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Backend API origin only (scheme + host + optional port). No path segment.
   * Set via env — e.g. deployed `https://api.example.com` or your local backend URL.
   */
  readonly VITE_API_BASE_URL?: string;
  /** Legacy alias for `VITE_API_BASE_URL` when the new name is unset. */
  readonly VITE_API_URL?: string;
  /**
   * Must be the string `true` (case-insensitive, trimmed) to enable HTTP; also requires
   * `VITE_API_BASE_URL` / `VITE_API_URL`. Otherwise the app uses in-memory mocks.
   */
  readonly VITE_USE_HTTP?: string;
  /** Vite `base` for GitHub Pages — e.g. `/LogIQ_debug_agent_UI/` (set in CI). */
  readonly VITE_BASE_PATH?: string;
  /** When `true`, show MCP provider status and external context preview in the RCA workflow. */
  readonly VITE_MCP_UI_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
