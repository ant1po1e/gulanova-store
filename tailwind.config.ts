import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F4",
        ink: "#1C1B19",
        ink2: "#4A4740",
        line: "#E4E1D6",
        ochre: "#B8863B",
        ochreDark: "#8F6427",
        sage: "#5F6E52",
        rose: "#A6484A",
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
