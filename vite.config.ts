import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Pages project sites are served from `https://<user>.github.io/<repo>/`.
 * Set `VITE_BASE_PATH=/REPO_NAME/` in CI (see deploy workflow). Local dev defaults to `/`.
 */
function resolveBasePath(): string {
  const fromEnv = process.env.VITE_BASE_PATH?.trim();
  if (fromEnv) {
    const withLeading = fromEnv.startsWith("/") ? fromEnv : `/${fromEnv}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }
  return "/";
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
