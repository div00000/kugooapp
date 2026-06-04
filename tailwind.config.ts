import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kugoo: {
          green: "#356946",
          "green-dark": "#244a31",
          "green-light": "#4a8560",
          orange: "#F0592B",
          "orange-dark": "#d6431a",
          "orange-light": "#ff7a4d",
          nude: "#ECDDC9",
          "nude-dark": "#dccab0",
          "nude-light": "#f6efe4",
          ink: "#1c2620",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Fredoka", "Poppins", "sans-serif"],
      },
      fontWeight: {
        "300": "300",
        "400": "400",
        "500": "500",
        "600": "600",
        "700": "700",
        "800": "800",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 38, 32, 0.18)",
        glow: "0 0 40px -8px rgba(240, 89, 43, 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
