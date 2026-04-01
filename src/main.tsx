import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CurrentUserProvider } from "./auth";
import { API_BASE_URL, HTTP_MODE_FLAG } from "./api/config";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV && HTTP_MODE_FLAG && !API_BASE_URL) {
  console.warn(
    "[LogIQ] VITE_USE_HTTP is true but VITE_API_BASE_URL is missing or empty — the app will use mock data. Set VITE_API_BASE_URL in .env / .env.local (not .env.example)."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </BrowserRouter>
  </StrictMode>
);
