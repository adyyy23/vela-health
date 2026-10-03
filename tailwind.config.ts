import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vela: {
          canvas: "#EDF3F8",     // Icy powder blue background
          subtle: "#F4F7FB",     // Very soft powder tint
          surface: "#FFFFFF",    // Crisp white floating surface
          border: "#E2E8F0",     // Crisp subtle border
          ink: "#0F172A",        // Deep confident slate ink
          muted: "#64748B",      // Secondary metadata
          primary: "#0284C7",    // Precision sapphire / medical blue
          primaryDark: "#0369A1",
          primaryLight: "#E0F2FE",
          accent: "#2563EB",     // Tech cobalt
          emerald: "#059669",    // Healthy emerald
          emeraldLight: "#ECFDF5",
          amber: "#D97706",      // Urgent amber
          amberLight: "#FFFBEB",
          rose: "#E11D48",       // Warning rose
          roseLight: "#FFF1F2",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "bubble": "2.25rem",
        "sheet": "2.5rem",
      },
      boxShadow: {
        "bubble": "0 12px 36px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)",
        "sheet": "0 -10px 40px -5px rgba(15, 23, 42, 0.09), 0 -2px 10px rgba(15, 23, 42, 0.03)",
        "floating": "0 20px 50px -10px rgba(15, 23, 42, 0.12), 0 6px 16px -2px rgba(15, 23, 42, 0.04)",
        "subtle": "0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
