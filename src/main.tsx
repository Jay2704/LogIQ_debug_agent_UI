import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { CurrentUserProvider } from "./auth";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  API_BASE_URL,
  API_BASE_URL_USES_DEV_DEFAULT,
  HTTP_MODE_FLAG,
  USE_HTTP_API,
} from "./api/config";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV && USE_HTTP_API && API_BASE_URL) {
  console.info(
    `[LogIQ] API base URL (active): ${API_BASE_URL}${
      API_BASE_URL_USES_DEV_DEFAULT
        ? " — dev default (set VITE_API_BASE_URL in .env; restart dev server after changes)"
        : ""
    }`
  );
}

if (!import.meta.env.DEV && HTTP_MODE_FLAG && !API_BASE_URL) {
  console.warn(
    "[LogIQ] VITE_USE_HTTP is true but VITE_API_BASE_URL is missing or empty — the app will use mock data. Set VITE_API_BASE_URL in your production env."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <CurrentUserProvider>
          <App />
        </CurrentUserProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);
