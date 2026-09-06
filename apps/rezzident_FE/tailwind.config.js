import { colors } from "@rezzident/design-tokens";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "!./node_modules/**"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        'dmsans': ['"DM Sans"', 'sans-serif'],
        'cabinet': ['"Cabinet Grotesk"', 'sans-serif'],
        'satoshi': ['"Satoshi"', 'sans-serif'],
      },
      fontSize: {
        // ── App (mobile/tablet) ──
        'display': ['32px', { lineHeight: '34px', fontWeight: '700' }],
        'heading-1': ['28px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-2': ['24px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['20px', { lineHeight: '24px', fontWeight: '500' }],
        'body-large': ['18px', { lineHeight: '24px', fontWeight: '400' }],
        'body-base': ['16px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '18px', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '16px', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '16px', fontWeight: '500' }],

        // ── Web (desktop views: auth, public pages) ──
        'web-display': ['56px', { lineHeight: '62px', fontWeight: '700' }],
        'web-h1': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'web-h2': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'web-h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'web-h4': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        'web-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'web-base': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'web-sm': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'web-xs': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'web-label': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'web-overline': ['11px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.08em' }],
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
        // ── Web-specific weight aliases ──
        'web-regular': '400',
        'web-medium': '500',
        'web-semibold': '600',
        'web-bold': '700',
      },
      spacing: {
        // ── App spacing (8-point scale) ──
        '2xs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
        // ── Web spacing (more generous for desktop layouts) ──
        'web-xs': '8px',
        'web-sm': '16px',
        'web-md': '24px',
        'web-lg': '32px',
        'web-xl': '48px',
        'web-2xl': '64px',
        'web-3xl': '80px',
        'web-4xl': '96px',
        'web-5xl': '120px',
      },
      backgroundImage: {
        'onboarding-gradient': 'linear-gradient(173.95deg, #603CD0 4.79%, #3D1982 100%)',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-rtl': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        splashIcon: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.8)' },
          '60%': { opacity: '1', transform: 'translateY(-4px) scale(1.05)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        splashText: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: {
        scroll: 'scroll 90s linear infinite',
        'scroll-rtl': 'scroll-rtl 90s linear infinite',
        heartbeat: 'heartbeat 2s ease-in-out infinite',
        splashIcon: 'splashIcon 0.6s ease-out forwards',
        splashText: 'splashText 0.6s ease-out 0.4s forwards',
      },
      boxShadow: {
        sm: "0px 0px 2px rgba(0, 0, 0, 0.05)",
        md: "0px 0px 6px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0, 0, 0, 0.04)",
        lg: "0px 0px 15px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)",
        xl: "0px 0px 25px rgba(0, 0, 0, 0.1), 0px 0px 10px rgba(0, 0, 0, 0.04)",
        "2xl": "0px 0px 50px rgba(0, 0, 0, 0.25)",
        "3xl": "0px 0px 50px rgba(0, 0, 0, 0.3)",
        'new': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'menu-panel': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'alert-modal': '0 4px 24px rgba(0, 0, 0, 0.15)',
        none: "none",
      },
      screens: {
        // ── Standard breakpoints (Tailwind defaults are preserved via extend) ──
        // sm: 640px   — small tablets (default)
        // md: 768px   — tablets (default)
        // lg: 1024px  — desktop (default)
        // xl: 1280px  — large desktop (default)

        // ── Web breakpoint — use for auth/public desktop-specific styles ──
        "web": "1024px",

        // ── Extra-large breakpoints ──
        "1xl": "1280px",
        "2xl": "1440px",
        "3xl": "1600px",
        "4xl": "1800px",
        "5xl": "2000px",
        "6xl": "2200px",
        "7xl": "2400px",
        "8xl": "2600px",
        "9xl": "2800px",
        "10xl": "3000px",
      },
      maxWidth: {
        "screen-2xl": "1440px",
        "screen-1xl": "1280px",
        "screen-3xl": "1600px",
        "screen-4xl": "1800px",
        "screen-5xl": "2000px",
        "screen-6xl": "2200px",
        "screen-7xl": "2400px",
        "screen-8xl": "2600px",
        "screen-9xl": "2800px",
        "screen-10xl": "3000px",
      },
      lineHeight: {
        "extra-tight": "1.1px",
        "extra-loose": "110px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      ringColor: ["focus"],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".body-fixed": {
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          overflow: "hidden",
        },
      });
    },
  ],
};