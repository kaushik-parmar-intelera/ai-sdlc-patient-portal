import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/controllers/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        // Clinical Curator Design System - Primary
        primary: "#002976",
        "primary-container": "#003da6",
        "on-primary": "#ffffff",
        "on-primary-container": "#99b1ff",
        "primary-fixed": "#dbe1ff",
        "primary-fixed-dim": "#b4c5ff",
        "on-primary-fixed": "#00174b",
        "on-primary-fixed-variant": "#023ea7",

        // Clinical Curator Design System - Secondary
        secondary: "#006591",
        "secondary-container": "#6cc4fe",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#005074",
        "secondary-fixed": "#c9e6ff",
        "secondary-fixed-dim": "#89ceff",
        "on-secondary-fixed": "#001e2f",
        "on-secondary-fixed-variant": "#004c6e",

        // Clinical Curator Design System - Tertiary (Accent Gold)
        tertiary: "#3d2d00",
        "tertiary-container": "#594200",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#dcad2f",
        "tertiary-fixed": "#ffdf9a",
        "tertiary-fixed-dim": "#f1c041",
        "on-tertiary-fixed": "#251a00",
        "on-tertiary-fixed-variant": "#5a4300",

        // Clinical Curator Design System - Surface
        surface: "#f3faff",
        "surface-bright": "#f3faff",
        "surface-container": "#e3f0f7",
        "surface-container-highest": "#d8e4ec",
        "surface-container-high": "#ddeaf2",
        "surface-container-low": "#e9f6fd",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#cfdce3",
        "surface-variant": "#d8e4ec",

        // Clinical Curator Design System - Support
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        outline: "#747684",
        "outline-variant": "#c4c6d5",

        // Clinical Curator Design System - Background & OnSurface
        background: "#f3faff",
        "on-background": "#111d23",
        "on-surface": "#111d23",
        "on-surface-variant": "#434653",
        "inverse-surface": "#263238",
        "inverse-on-surface": "#e6f3fa",
        "inverse-primary": "#b4c5ff",

        // Legacy brand colors for compatibility
        brand: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          700: "#0369a1",
          900: "#0c4a6e",
        },
      },
      borderRadius: {
        // Clinical Curator rounded corners (ROUND_FOUR = 0.25rem)
        "clinic-xs": "0.125rem",
        "clinic-sm": "0.25rem",
        "clinic-md": "0.375rem",
        "clinic-lg": "0.75rem",
        "clinic-xl": "1rem",
      },
      boxShadow: {
        // Ambient shadows - tinted, soft
        ambient: "0 12px 32px -4px rgba(17, 29, 35, 0.06)",
        "ambient-sm": "0 4px 12px -2px rgba(17, 29, 35, 0.06)",
        "ambient-lg": "0 20px 48px -8px rgba(17, 29, 35, 0.06)",
      },
      spacing: {
        "xs": "0.25rem",  // 4px
        "sm": "0.5rem",   // 8px
        "md": "0.75rem",  // 12px
        "lg": "1rem",     // 16px
        "xl": "1.5rem",   // 24px
        "2xl": "2rem",    // 32px
      },
      backgroundColor: {
        "glass-light": "rgba(255, 255, 255, 0.8)",
      },
      backdropBlur: {
        "clinic": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
