import type { Config } from "tailwindcss";

function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        paper: withOpacity("--color-paper"),
        panel: withOpacity("--color-panel"),
        line: withOpacity("--color-line"),
        muted: withOpacity("--color-muted"),
        dim: withOpacity("--color-dim"),
        chai: {
          DEFAULT: withOpacity("--color-chai"),
          soft: withOpacity("--color-chai-soft"),
        },
        signal: {
          DEFAULT: withOpacity("--color-signal"),
          soft: withOpacity("--color-signal-soft"),
        },
        danger: withOpacity("--color-danger"),
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        none: "0px",
      },
      keyframes: {
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dot-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
      },
      animation: {
        "bubble-in": "bubble-in 260ms cubic-bezier(0.19, 1, 0.22, 1) both",
        "dot-bounce": "dot-bounce 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
