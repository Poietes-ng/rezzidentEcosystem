// Single source of truth for all brand colors across web + mobile.
// Both apps/rezzident_FE/tailwind.config.js and apps/rezzident_MB/tailwind.config.js
// should import from here instead of defining colors inline.

export const colors = {
  // ── Brand actions ──
  actionYellow: "#FFE022",
  actionYellowHover: "#F0D010",
  actionDark: "#1A1A1A",
  actionDarkHover: "#2A2A2A",

  // ── UI surfaces ──
  chatArea: "#F2F0E8",
  inputBg: "#FFF9CC",
  receiverBubble: "#F2F1ED",
  deletedBubble: "#F5F4F0",
  menuHover: "#FAFAF5",
};
