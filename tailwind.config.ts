import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        // Classic Apple Rainbow Colors
        apple: {
          red: "hsl(var(--apple-red))",
          orange: "hsl(var(--apple-orange))",
          yellow: "hsl(var(--apple-yellow))",
          green: "hsl(var(--apple-green))",
          blue: "hsl(var(--apple-blue))",
          purple: "hsl(var(--apple-purple))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        }
      },
      // 80s Apple Border Radius - Sharp, geometric corners
      borderRadius: {
        none: "0",
        sm: "0",      // Sharp corners throughout
        DEFAULT: "0", 
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px" // Keep full for special cases like dots
      },
      // 8pt Grid System - Classic Apple spacing
      spacing: {
        'grid-1': '8px',    // 1 grid unit
        'grid-2': '16px',   // 2 grid units  
        'grid-3': '24px',   // 3 grid units
        'grid-4': '32px',   // 4 grid units
        'grid-5': '40px',   // 5 grid units
        'grid-6': '48px',   // 6 grid units
        'grid-8': '64px',   // 8 grid units
        'grid-10': '80px',  // 10 grid units
        'grid-12': '96px',  // 12 grid units
      },
      // Typography scale matching Apple's classic systems
      fontSize: {
        'display': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'title-1': ['24px', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        'title-2': ['20px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'title-3': ['18px', { lineHeight: '1.35', letterSpacing: '-0.005em' }],
        'body': ['14px', { lineHeight: '1.4', letterSpacing: '0em' }],
        'caption': ['12px', { lineHeight: '1.35', letterSpacing: '0.005em' }],
        'fine-print': ['10px', { lineHeight: '1.3', letterSpacing: '0.01em' }],
      },
      // Classic Apple font families
      fontFamily: {
        'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'body': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      // Clean, precise shadows
      boxShadow: {
        'light': 'var(--shadow-light)',
        'medium': 'var(--shadow-medium)', 
        'strong': 'var(--shadow-strong)',
        'none': '0 0 #0000',
        // Classic inset shadow for pressed buttons
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        // Simplified animations - more precise, less bouncy
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-4px)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" }
        },
        // Classic Mac button press animation
        "button-press": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(1px)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out", 
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.15s ease-in",
        "slide-in": "slide-in 0.25s ease-out",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "button-press": "button-press 0.1s ease-out"
      },
      // Precise transitions
      transitionDuration: {
        '50': '50ms',
        '150': '150ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)', // Apple's preferred easing
      }
    }
  },
  plugins: [],
};

export default config;