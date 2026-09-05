import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981", // Emerald marketplace main
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        brand: {
          indigo: "#4f46e5",
          amber: "#f59e0b",
          red: "#ef4444",
          dark: "#0f172a",
        }
      },
    },
  },
  plugins: [],
};
export default config;
