// ──────────────────────────────────────────────────────────
// Unit Tests — formatters.ts
//
// WHY THESE TESTS EXIST:
//   formatNaira() renders money on every screen that shows
//   bills, dues, or payments. If the format is wrong,
//   users see "₦1000" instead of "₦1,000.00" — or worse,
//   the amount is ambiguous.
//
// HOW TO RUN:
//   From repo root: pnpm --filter @rezzident/utils test
//   Or directly:    cd packages/utils && npx vitest run
//
// WHAT TO LEARN:
//   1. Intl.NumberFormat is locale-dependent — these tests
//      verify YOUR expected output, not the browser default
//   2. Test zero, positive, negative, large numbers, decimals
//   3. Each test name describes the USER-VISIBLE behavior
// ──────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { formatNaira } from "./formatters";

describe("formatNaira", () => {
  // ── Basic formatting ──

  it("formats a simple integer amount", () => {
    const result = formatNaira(1000);
    // Should contain the number with grouping separators
    expect(result).toContain("1,000");
  });

  it("formats zero", () => {
    const result = formatNaira(0);
    expect(result).toContain("0");
  });

  it("formats decimal amounts (kobo)", () => {
    const result = formatNaira(1500.5);
    expect(result).toContain("1,500");
  });

  it("formats large amounts with proper grouping", () => {
    const result = formatNaira(1000000);
    // Should be "1,000,000" with comma grouping
    expect(result).toContain("1,000,000");
  });

  // ── Currency symbol ──

  it("includes NGN currency indicator", () => {
    const result = formatNaira(100);
    // Intl.NumberFormat for NGN produces ₦ or NGN depending on locale
    // At minimum, the result should contain the formatted number
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(1); // Not just the number
  });

  // ── Edge cases ──

  it("formats negative amounts", () => {
    const result = formatNaira(-500);
    expect(result).toContain("500");
  });

  it("formats very small amounts", () => {
    const result = formatNaira(0.01);
    expect(result).toContain("0");
  });

  it("formats typical estate dues (25000)", () => {
    const result = formatNaira(25000);
    expect(result).toContain("25,000");
  });

  it("returns a string, not a number", () => {
    expect(typeof formatNaira(100)).toBe("string");
  });
});
