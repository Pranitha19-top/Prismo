/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        surface: "#0d0f14",
        panel: "#141720",
        border: "#1e2330",
        accent: "#f97316",
        "accent-dim": "#7c3a0a",
        safe: "#22c55e",
        warn: "#eab308",
        danger: "#ef4444",
        muted: "#4b5563",
        text: "#e2e8f0",
        "text-dim": "#64748b",
      },
      boxShadow: {
        glow: "0 0 20px rgba(249,115,22,0.15)",
        "glow-sm": "0 0 8px rgba(249,115,22,0.1)",
      }
    }
  },
  plugins: []
}
