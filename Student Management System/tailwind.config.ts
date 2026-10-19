import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#627d98",
          500: "#486581",
          600: "#334e68",
          700: "#243b53",
          800: "#102a43",
          900: "#0b1f33",
          950: "#061320",
        },
        gold: {
          50: "#fffdf5",
          100: "#fef9e7",
          200: "#fdf0c5",
          300: "#fbe49c",
          400: "#f7d268",
          500: "#d4af37", // classic metallic gold
          600: "#b89428",
          700: "#94731c",
          800: "#755a19",
          900: "#5c4617",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(16, 42, 67, 0.06), 0 4px 12px rgba(16, 42, 67, 0.04)",
        dropdown: "0 10px 30px -5px rgba(16, 42, 67, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
