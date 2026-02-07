import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./global/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#04A9FF",
        secondary: "#FF6B6B",
      },
      keyframes: {
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "bounce-slow": "bounce-slow 3s infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};

export default config;
