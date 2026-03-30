/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        surface: {
          975: "#070b14",
          960: "#080d18",
          950: "#0a101f",
          925: "#0c1428",
          900: "#0f1a2e",
          875: "#111f38",
          850: "#142542",
          825: "#162a4a",
          800: "#1a3054",
          775: "#1e365e",
          700: "#224066",
          600: "#2a4f7a",
        },
        accent: {
          blue: "#3b82f6",
          "blue-bright": "#38bdf8",
          "blue-glow": "rgba(59, 130, 246, 0.4)",
          violet: "#8b5cf6",
          "violet-deep": "#7c3aed",
          "violet-glow": "rgba(139, 92, 246, 0.35)",
          emerald: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      boxShadow: {
        card:
          "0 0 0 1px rgba(59, 130, 246, 0.08), 0 10px 40px -12px rgba(0, 0, 0, 0.55)",
        "card-premium":
          "0 0 0 1px rgba(99, 102, 241, 0.12), 0 12px 48px -16px rgba(0, 0, 0, 0.5), 0 0 80px -32px rgba(59, 130, 246, 0.12)",
        "glow-blue":
          "0 0 48px -12px rgba(59, 130, 246, 0.45), 0 0 0 1px rgba(59, 130, 246, 0.15)",
        "glow-violet":
          "0 0 48px -12px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.12)",
        "glow-cta":
          "0 0 0 1px rgba(56, 189, 248, 0.35), 0 10px 40px -8px rgba(37, 99, 235, 0.45), 0 0 64px -12px rgba(139, 92, 246, 0.25)",
        insetNav:
          "inset 0 0 0 1px rgba(99, 102, 241, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      borderRadius: {
        card: "16px",
      },
      backgroundImage: {
        "nav-active":
          "linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, rgba(124, 58, 237, 0.22) 50%, rgba(15, 23, 42, 0.4) 100%)",
        "cta-primary":
          "linear-gradient(135deg, #2563eb 0%, #3b82f6 38%, #6366f1 72%, #22d3ee 100%)",
        "cta-primary-hover":
          "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #818cf8 75%, #67e8f9 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
