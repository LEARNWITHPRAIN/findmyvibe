import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: {
          50: "#1E1E24",
          100: "#18181D",
          200: "#131317",
          300: "#0F0F12",
          DEFAULT: "#121216",
        },
        brand: {
          purple: {
            DEFAULT: "#8B5CF6",
            light: "#A78BFA",
            dark: "#7C3AED",
            glow: "rgba(139, 92, 246, 0.35)",
          },
          coral: {
            DEFAULT: "#F0575A",
            light: "#FB7185",
            dark: "#E11D48",
            glow: "rgba(240, 87, 90, 0.35)",
          },
          teal: {
            DEFAULT: "#2DD4BF",
            light: "#5EEAD4",
            dark: "#14B8A6",
            glow: "rgba(45, 212, 191, 0.35)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient": "radial-gradient(at 0% 0%, rgba(139,92,246,0.18) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(240,87,90,0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(45,212,191,0.12) 0px, transparent 50%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "glow-coral": "0 0 25px -5px rgba(240, 87, 90, 0.4)",
        "glow-teal": "0 0 25px -5px rgba(45, 212, 191, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
