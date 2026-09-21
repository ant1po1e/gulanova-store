import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        ink2: "rgb(var(--color-ink2) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        ochre: "rgb(var(--color-ochre) / <alpha-value>)",
        ochreDark: "rgb(var(--color-ochre-dark) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        rose: "rgb(var(--color-rose) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
