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
          canvas: "#F5F6F1",       // Warm neutral / ivory background
          canvasAlt: "#ECEFEA",    // Secondary neutral
          surface: "#FFFFFF",      // White surfaces
          surfaceSubtle: "#E7ECE6",// Soft gray-green secondary surfaces
          border: "#E2E6E1",       // Thin subtle borders
          borderLight: "#ECEFEA",
          ink: "#17231D",          // Deep forest / charcoal typography
          inkMuted: "#5A6860",     // Muted secondary typography
          muted: "#5A6860",
          sage: "#526A5B",         // Muted sage primary
          sageDark: "#3E5246",     // Deep sage hover
          forest: "#17231D",       // Deep forest
          emerald: "#166534",      // Verified / active state
          emeraldLight: "#EAF0EC",
          amber: "#B45309",        // Warning / pending
          amberLight: "#FEF3C7",
          rose: "#BE123C",         // Urgent / alert
          roseLight: "#FEE2E2",
        },
      },
      borderRadius: {
        button: "10px",
        card: "14px",
        surface: "18px",
        pill: "9999px",
      },
      boxShadow: {
        "vela-subtle": "0 1px 2px rgba(23, 35, 29, 0.03)",
        "vela-card": "0 2px 6px -1px rgba(23, 35, 29, 0.04), 0 1px 3px rgba(23, 35, 29, 0.02)",
        "vela-floating": "0 8px 20px -3px rgba(23, 35, 29, 0.06), 0 3px 8px -2px rgba(23, 35, 29, 0.02)",
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
