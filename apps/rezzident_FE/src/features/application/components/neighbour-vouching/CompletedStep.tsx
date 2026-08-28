import React from "react";
import { Button } from "#/shared/components/ui/button";

export interface CompletedStepProps {
  fullName: string;
  faceIdEnabled: boolean;
  onFinish: () => void;
}

export function CompletedStep({ fullName, faceIdEnabled, onFinish }: CompletedStepProps) {
  return (
    <div className="flex min-h-full w-full flex-col justify-between px-6 pb-8 pt-12 font-dmsans animate-in fade-in zoom-in-95 duration-400">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* ── Success Check Badge ── */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2DB84E]/10 text-[#2DB84E]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2DB84E] text-white shadow-sm">
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* ── Heading & Details ── */}
        <h1 className="font-dmsans text-[28px] font-bold text-actionDark sm:text-[32px]">
          Welcome to Rezzident!
        </h1>
        <p className="mt-2 max-w-[280px] font-dmsans text-[14px] leading-relaxed text-gray-500">
          Your profile has been fully verified through neighbour vouching.
        </p>

        {/* ── Summary Card ── */}
        <div className="mt-8 w-full rounded-[16px] border border-gray-100 bg-[#FAFAF5] p-5 text-left shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <span className="text-[13px] text-gray-500">Resident</span>
            <span className="font-bold text-actionDark text-[14px]">{fullName || "Resident"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200/60 py-3">
            <span className="text-[13px] text-gray-500">Verification</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#2DB84E] text-[13px]">
              <span className="h-2 w-2 rounded-full bg-[#2DB84E]" />
              Tier 2 Verified
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[13px] text-gray-500">Face ID</span>
            <span className="font-medium text-actionDark text-[13px]">
              {faceIdEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="pt-6">
        <Button
          type="button"
          onClick={onFinish}
          className="h-[54px] w-full rounded-[14px] bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90"
        >
          Enter Dashboard
        </Button>
      </div>
    </div>
  );
}
