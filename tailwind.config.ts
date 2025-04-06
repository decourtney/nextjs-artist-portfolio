import type { Config } from "tailwindcss";
import { customColors } from "./ColorTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        beasties: ["Beasties", "serif"],
        charm: ["Charm", "var(--font-charm)"],
        openSans: ["Open_Sans", "var(--font-openSans)"],
      },
      colors: {
        border: "hsl(var(--border))",
        ...customColors,
      },
      backgroundImage: {
        "test-gradient": "linear-gradient(90deg, #FFC593 0%, #BC7198 100%);",
      },
      fontSize: {
        tiny: "0.75rem",
        small: "0.875rem",
        medium: "1rem",
        large: "1.125rem",
      },
      lineHeight: {
        tiny: "1rem",
        small: "1.25rem",
        medium: "1.5rem",
        large: "1.75rem",
      },
      borderRadius: {
        small: "8px",
        medium: "12px",
        large: "14px",
      },
      borderWidth: {
        small: "1px",
        medium: "2px",
        large: "3px",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
