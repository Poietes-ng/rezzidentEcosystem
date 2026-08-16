// Spacing tokens — single source of truth for both platforms.
// Web uses larger values for desktop layouts; app uses tighter 8-point scale.
// Matches Rezzident Design System Foundations v1.0.0 — 07 App Frame & Layout

export const spacing = {
  // ── App spacing (8-point scale — mobile/tablet) ──
  "2xs": 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  // ── Layout-specific tokens (from frame spec) ──
  "content-margin": 24,   // 24px left / 24px right
  "nav-bar": 56,           // Nav bar height
  "status-bar": 54,        // iOS safe area (status bar)
  "bottom-safe": 21,       // Bottom safe area
  "btn-height": 56,        // Button min-height
  "cta-h": 24,             // CTA block horizontal padding
  "cta-b": 16,             // CTA block bottom padding
};

export const webSpacing = {
  // ── Web spacing (desktop layouts: auth, public pages) ──
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 80,
  "4xl": 96,
  "5xl": 120,
};

// Border-radius tokens matching design spec
export const borderRadius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  btn: "12px",      // Buttons — spec: 12px
  lg: "16px",
  xl: "24px",
  full: "9999px",
};
