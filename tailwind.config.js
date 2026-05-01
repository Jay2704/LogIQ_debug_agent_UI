/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Text"', '"SF Pro Display"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // NEXUS Terminal dark palette
        surface: {
          975: "#040C18",   // deepest bg
          960: "#060E1C",
          950: "#071020",
          925: "#0A1428",
          900: "#0D1830",
          875: "#101E38",
          850: "#132340",
          825: "#162848",
          800: "#1A2E52",
          775: "#1E345C",
          700: "#243E6A",
          600: "#2C4E80",
        },
        // Cyber accent: cyan
        cyber: {
          DEFAULT: "#22D3EE",   // cyan-300
          bright: "#67E8F9",   // cyan-200
          dim: "#0891B2",      // cyan-600
          glow: "rgba(34,211,238,0.3)",
          900: "#083344",
          800: "#0E4A5E",
        },
        // Neon green for success/active/running
        nexus: {
          DEFAULT: "#34D399",   // emerald-400
          bright: "#6EE7B7",   // emerald-300
          dim: "#059669",      // emerald-600
          glow: "rgba(52,211,153,0.25)",
        },
        // Keep legacy accent namespace for compatibility
        accent: {
          blue: "#3b82f6",
          "blue-bright": "#60a5fa",
          "blue-glow": "rgba(59, 130, 246, 0.4)",
          violet: "#8b5cf6",
          "violet-bright": "#a78bfa",
          "violet-deep": "#7c3aed",
          "violet-glow": "rgba(139, 92, 246, 0.35)",
          emerald: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(34,211,238,0.06), 0 8px 32px -12px rgba(0,0,0,0.6)",
        "card-premium": "0 0 0 1px rgba(34,211,238,0.12), 0 12px 48px -16px rgba(0,0,0,0.55), 0 0 60px -28px rgba(34,211,238,0.1)",
        "glow-cyber": "0 0 40px -8px rgba(34,211,238,0.45), 0 0 0 1px rgba(34,211,238,0.15)",
        "glow-nexus": "0 0 40px -8px rgba(52,211,153,0.4), 0 0 0 1px rgba(52,211,153,0.12)",
        "glow-amber": "0 0 40px -12px rgba(245,158,11,0.35), 0 0 0 1px rgba(245,158,11,0.1)",
        "glow-rose": "0 0 40px -12px rgba(244,63,94,0.3), 0 0 0 1px rgba(244,63,94,0.1)",
        "glow-blue": "0 0 48px -12px rgba(59,130,246,0.45), 0 0 0 1px rgba(59,130,246,0.15)",
        "glow-violet": "0 0 48px -12px rgba(139,92,246,0.4), 0 0 0 1px rgba(139,92,246,0.12)",
        "glow-cta": "0 0 0 1px rgba(34,211,238,0.4), 0 10px 36px -8px rgba(34,211,238,0.2), 0 0 52px -14px rgba(103,232,249,0.14)",
        insetNav: "inset 0 0 0 1px rgba(34,211,238,0.22), inset 0 1px 0 0 rgba(255,255,255,0.06)",
        insetCyber: "inset 0 0 20px rgba(34,211,238,0.04)",
      },
      borderRadius: {
        card: "8px",
        "card-lg": "12px",
      },
      backgroundImage: {
        "nav-active": "linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(6,182,212,0.1) 50%, rgba(15,23,42,0.4) 100%)",
        "cta-primary": "linear-gradient(135deg, #06B6D4 0%, #0891B2 48%, #0E7490 100%)",
        "cta-primary-hover": "linear-gradient(135deg, #22D3EE 0%, #06B6D4 48%, #0891B2 100%)",
        "cyber-grid": "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
        "scanline": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.015) 2px, rgba(34,211,238,0.015) 4px)",
      },
      animation: {
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 8s linear infinite",
        "flicker": "flicker 0.15s infinite linear",
        "blink-cursor": "blink-cursor 1s step-end infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "investigation-reveal": "investigation-reveal 0.4s ease-out both",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        "blink-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "investigation-reveal": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
