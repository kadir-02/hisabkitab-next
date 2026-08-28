import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F1DF",
        "paper-dark": "#EFE4C4",
        ink: "#2B2118",
        "ink-soft": "#6B5C48",
        "ink-faint": "#9A8B74",
        brand: {
          DEFAULT: "#A63D31",
          dark: "#7E2E24",
          light: "#C25646",
        },
        rule: {
          red: "#B5453A",
          blue: "#33507A",
        },
        full: {
          DEFAULT: "#C99A2E",
          soft: "#F3E3B8",
        },
        half: {
          DEFAULT: "#5E7D4F",
          soft: "#DCE6D2",
        },
        chapati: {
          DEFAULT: "#8B5A2B",
          soft: "#E8D9C2",
        },
        steel: {
          DEFAULT: "#7C8894",
          soft: "#E4E7EA",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        ledger: "0 1px 0 rgba(43,33,24,0.06), 0 8px 24px -12px rgba(43,33,24,0.25)",
        stamp: "0 2px 6px rgba(166,61,49,0.35)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
