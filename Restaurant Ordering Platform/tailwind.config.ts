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
        cream: {
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#EBE3D5",
          300: "#DDD1BC",
          400: "#C6B497",
        },
        forest: {
          50: "#EAF3EE",
          100: "#D5E7DD",
          200: "#ACCDBB",
          600: "#225638",
          700: "#1A442C",
          800: "#133321",
          900: "#0D2216",
          950: "#08160E",
        },
        amberGold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -2px rgba(19, 51, 33, 0.08)",
        card: "0 8px 30px rgba(0, 0, 0, 0.06)",
        hover: "0 14px 35px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
