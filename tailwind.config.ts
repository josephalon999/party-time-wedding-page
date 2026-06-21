import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#120b1a",
          alt: "#1e1330",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#e8d57a",
          dark: "#b8841f",
        },
        cta: {
          DEFAULT: "#c9963f",
          hover: "#b8841f",
        },
        cream: {
          DEFAULT: "#f5f0e8",
          muted: "#c9b99a",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "serif"],
        sans: ["var(--font-assistant)", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          to: { backgroundPosition: "200% center" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
