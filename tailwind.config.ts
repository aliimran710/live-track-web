import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2.5rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      fontFamily: {
        display: ["Archivo Variable", "Archivo", "Segoe UI", "sans-serif"],
        sans: ["Public Sans Variable", "Public Sans", "Segoe UI", "sans-serif"],
        mono: ["Martian Mono Variable", "Martian Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        /* Elevation steps. Deep blue-violet, never grey. */
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
        /* Brand constants, identical in both themes. */
        brand: {
          navy: "#04003A",
          indigo: "#140B7A",
          cyan: "#22D3EE",
          paper: "#F7F8FC",
          slate: "#5A5F7A",
        },
        /* The six live vehicle states, carried over from the operator panel.
           Used only where they mean what they mean there. */
        status: {
          move: "#16D97E",
          idle: "#FFB020",
          stop: "#FF4D5E",
          offline: "#5B6BA8",
          disabled: "#A855F7",
          total: "#38BDF8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
      },
      letterSpacing: {
        tightest: "-0.04em",
        display: "-0.03em",
        eyebrow: "0.18em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "route-draw": {
          from: { strokeDashoffset: "var(--dash)" },
          to: { strokeDashoffset: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.7)", opacity: "0.9" },
          "70%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        ticker: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0.15" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2,0.6,0.3,1) infinite",
        ticker: "ticker 28s linear infinite",
        scan: "scan 5s linear infinite",
        blink: "blink 1.6s steps(1,end) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
