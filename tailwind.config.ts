import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/domains/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca DomCore
        primary: {
          DEFAULT: "#e8410a",
          light: "#ff5a1f",
          btn: "#ff5708",
        },
        // Tokens semânticos mapeados para CSS vars (light/dark via classe)
        bg: "var(--dc-bg)",
        surface: "var(--dc-surface)",
        card: "var(--dc-card)",
        "card-alt": "var(--dc-card-alt)",
        nav: "var(--dc-nav)",
        border: "var(--dc-border)",
        "text-strong": "var(--dc-text-strong)",
        "text-muted": "var(--dc-text-muted)",
        "text-faint": "var(--dc-text-faint)",
        // Estado
        success: "#2ee06f",
        danger: "#ff4d4d",
        warning: "#ffb020",
        // Ranking
        gold: "#ffc93c",
        silver: "#c7cdd6",
        bronze: "#d08a4e",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
