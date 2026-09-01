// ──────────────────────────────────────────────────────────
// Unit Tests — validators.ts
//
// WHY THESE TESTS EXIST:
//   validatePhoneNG() is used in both FE and MB to check
//   if a phone number is valid BEFORE hitting the API.
//   If this function is wrong, users can't register.
//
// HOW TO RUN:
//   From repo root: pnpm --filter @rezzident/utils test
//   Or directly:    cd packages/utils && npx vitest run
//
// WHAT TO LEARN:
//   1. describe() groups related tests
//   2. it() defines a single test case
//   3. expect().toBe() is the assertion
//   4. Test BOTH valid AND invalid inputs
//   5. Test edge cases (empty string, undefined-like)
// ──────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { validatePhoneNG } from "./validators";

describe("validatePhoneNG", () => {
  // ── Valid Nigerian phone numbers ──
  // Format: +234 or 0, then 7/8/9, then 0/1, then 8 digits
  // Example: +2348012345678 or 08012345678

  describe("valid numbers", () => {
    it("accepts +234 format (MTN pattern: 803)", () => {
      expect(validatePhoneNG("+2348031234567")).toBe(true);
    });

    it("accepts +234 format (Glo pattern: 805)", () => {
      expect(validatePhoneNG("+2348051234567")).toBe(true);
    });

    it("accepts +234 format (Airtel pattern: 901)", () => {
      expect(validatePhoneNG("+2349011234567")).toBe(true);
    });

    it("accepts local format starting with 0 (080...)", () => {
      expect(validatePhoneNG("08012345678")).toBe(true);
    });

    it("accepts local format starting with 0 (090...)", () => {
      expect(validatePhoneNG("09012345678")).toBe(true);
    });

    it("accepts local format starting with 0 (070...)", () => {
      expect(validatePhoneNG("07012345678")).toBe(true);
    });
  });

  // ── Invalid phone numbers ──
  // These should ALL return false

  describe("invalid numbers", () => {
    it("rejects empty string", () => {
      expect(validatePhoneNG("")).toBe(false);
    });

    it("rejects number without country code or 0 prefix", () => {
      expect(validatePhoneNG("8012345678")).toBe(false);
    });

    it("rejects too short number", () => {
      expect(validatePhoneNG("+23480123")).toBe(false);
    });

    it("rejects too long number", () => {
      expect(validatePhoneNG("+23480123456789")).toBe(false);
    });

    it("rejects non-Nigerian country code", () => {
      expect(validatePhoneNG("+14155551234")).toBe(false);
    });

    it("rejects number starting with invalid digit after prefix", () => {
      // Nigerian numbers start with 7, 8, or 9 after the prefix
      expect(validatePhoneNG("+2341012345678")).toBe(false);
    });

    it("rejects letters mixed in", () => {
      expect(validatePhoneNG("+234801abc5678")).toBe(false);
    });

    it("rejects spaces in number", () => {
      expect(validatePhoneNG("+234 801 234 5678")).toBe(false);
    });
  });
});
