// Single source of truth for all brand colors across web + mobile.
// Both apps/rezzident_FE/tailwind.config.js and apps/rezzident_MB/tailwind.config.js
// should import from here instead of defining colors inline.

export const colors = {
  // ── Primary Luxury Cores ──
  actionDark: "#1A1A1A",        // Warm Black
  actionDarkHover: "#2A2A2A",
  actionDarkPressed: "#000000",
  actionYellow: "#FFE022",      // Accent Yellow / Prestige Yellow
  actionYellowHover: "#F0D010",
  actionYellowPressed: "#D4B800",
  offWhite: "#FAFAF5",

  // ── Neutral Grays ──
  slateGray: "#9A9488",
  warmGray: "#8A8578",
  mutedOlive: "#C0BAB0",
  stoneEdge: "#D4D0C8",
  lightCream: "#FFFFFC",

  // ── Semantic Indicators ──
  successGreen: "#2DB84E",
  errorRed: "#C92727",
  warningGold: "#D4A030",

  // ── UI surfaces ──
  chatArea: "#F2F0E8",
  inputBg: "#FFF9CC",
  receiverBubble: "#F2F1ED",
  deletedBubble: "#F5F4F0",
  menuHover: "#FAFAF5",
};
