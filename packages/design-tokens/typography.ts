// Typography tokens — font families, sizes, and weights.
// Each platform consumes these differently (Tailwind config vs StyleSheet).
// Font: DM Sans across all platforms.

export const fontFamilies = {
  dmsans: '"DM Sans", sans-serif',
  cabinet: '"Cabinet Grotesk", sans-serif',
  satoshi: '"Satoshi", sans-serif',
};

// NativeWind requires the actual native font name (no quotes, no fallbacks).
export const nativeFontFamilies = {
  dmsans: "DMSans",
};

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

// Tailwind fontSize format: [size, { lineHeight, fontWeight? }]
// Matches Rezzident Design System Foundations v1.0.0 — 02 Typography (DM Sans)
export const fontSize = {
  display: ["32px", { lineHeight: "34px" }],
  "heading-1": ["28px", { lineHeight: "32px" }],
  "heading-2": ["24px", { lineHeight: "28px" }],
  "heading-3": ["20px", { lineHeight: "24px" }],
  "body-large": ["18px", { lineHeight: "24px" }],
  "body-base": ["16px", { lineHeight: "20px" }],
  "body-small": ["14px", { lineHeight: "18px" }],
  caption: ["14px", { lineHeight: "16px" }],
  label: ["14px", { lineHeight: "16px" }],
  "tab-label": ["10px", { lineHeight: "12px" }],
} as const;
