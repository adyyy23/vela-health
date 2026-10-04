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
          canvas: "#FFFFFF", // Warm neutral / ivory background
          canvasAlt: "#EEEAE2", // Secondary neutral
          surface: "#FFFFFF", // White surfaces
          surfaceSubtle: "#F0EEE8", // Soft gray-green secondary surfaces
          border: "#DCD8CE", // Thin subtle borders
          borderLight: "#EEEAE2",
          ink: "#32151E", // Deep forest / charcoal typography
          inkMuted: "#6C6264", // Muted secondary typography
          muted: "#6C6264",
          sage: "#993F2E", // Muted sage primary
          sageDark: "#7F3225", // Deep sage hover
          forest: "#32151E", // Deep forest
          emerald: "#166534", // Verified / active state
          emeraldLight: "#EEF1EC",
          amber: "#B45309", // Warning / pending
          amberLight: "#FEF3C7",
          rose: "#BE123C", // Urgent / alert
          roseLight: "#FEE2E2",
        },
      },
      borderRadius: {
        button: "4px",
        card: "6px",
        surface: "8px",
        pill: "9999px",
      },
      boxShadow: {
        "vela-subtle": "0 1px 2px rgba(23, 35, 29, 0.03)",
        "vela-card":
          "0 2px 6px -1px rgba(23, 35, 29, 0.04), 0 1px 3px rgba(23, 35, 29, 0.02)",
        "vela-floating":
          "0 8px 20px -3px rgba(23, 35, 29, 0.06), 0 3px 8px -2px rgba(23, 35, 29, 0.02)",
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
        serif: [
          "Georgia",
          '"Times New Roman"',
          '"Newsreader"',
          "Cambria",
          "serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
