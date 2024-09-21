import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{"test-gradient": "linear-gradient(90deg, #FFC593 0%, #BC7198 100%);"},
    },
  },
  // darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
      layout: {
        dividerWeight: "1px", // h-divider the default height applied to the divider component
        disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
        fontSize: {
          tiny: "0.75rem", // text-tiny
          small: "0.875rem", // text-small
          medium: "1rem", // text-medium
          large: "1.125rem", // text-large
        },
        lineHeight: {
          tiny: "1rem", // text-tiny
          small: "1.25rem", // text-small
          medium: "1.5rem", // text-medium
          large: "1.75rem", // text-large
        },
        radius: {
          small: "8px", // rounded-small
          medium: "12px", // rounded-medium
          large: "14px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "2px", // border-medium (default)
          large: "3px", // border-large
        },
      },
      themes: {
        light: {
          layout: {},
          colors: {
            background: "#F5F5F5",
            foreground: "#229799",
            primary: "#F5F5F5",
            secondary: "#424242",
            // divider: "",
            // overlay: "",
            // focus: "",
            // content1: "",
            // content2: "",
            // content3: "",
            // content4: "",
          },
        },
        dark: {
          layout: {},
          colors: {
            background: "#229799",
            foreground: "#48CFCB",
            primary: "#F5F5F5",
            secondary: "#424242",
            // divider: "",
            // overlay: "",
            // focus: "",
            // content1: "",
            // content2: "",
            // content3: "",
            // content4: "",
          },
        },
      },
    }),
  ],
};
export default config;
