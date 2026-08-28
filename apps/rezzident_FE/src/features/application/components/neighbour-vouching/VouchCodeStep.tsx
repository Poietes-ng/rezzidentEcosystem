import React, { useState } from "react";
import { Button } from "#/shared/components/ui/button";

export interface VouchCodeStepProps {
  currentStep: number;
  totalSteps: number;
  vouchCode: string;
  vouchLink: string;
  onViewStatus: () => void;
}

export function VouchCodeStep({
  currentStep,
  totalSteps,
  vouchCode,
  vouchLink,
  onViewStatus,
}: VouchCodeStepProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(vouchCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShareLink = async () => {
    const fullUrl = vouchLink.startsWith("http") ? vouchLink : `https://${vouchLink}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "Vouch for me on Rezzident",
          text: `Please vouch for my residency on Rezzident using code ${vouchCode}`,
          url: fullUrl,
        });
        return;
      }
    } catch {
      // Fallback to copying
    }

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Share with neighbours
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          Share your vouch code or link with at least 2 neighbours to verify your identity
        </p>

        {/* ── Section 1: Your Vouch Code ── */}
        <div className="mt-8">
          <h2 className="font-dmsans text-[18px] font-bold text-actionDark">
            Your Vouch Code
          </h2>
          <p className="mt-0.5 font-dmsans text-[13px] text-gray-500">
            Share this code with your neighbours
          </p>

          {/* Yellow Dashed Card for Code */}
          <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-dashed border-actionYellow bg-offWhite p-4">
            <div className="flex flex-col">
              <span className="font-dmsans text-[11px] font-medium text-gray-400">
                Code
              </span>
              <span className="font-dmsans text-[18px] font-bold tracking-widest text-actionDark">
                {vouchCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-lg border border-actionYellow bg-amber-50/60 px-3.5 py-1.5 font-dmsans text-[13px] font-medium text-actionDark shadow-2xs transition-colors hover:bg-amber-100/60 active:bg-actionYellow/30"
            >
              <span>{copiedCode ? "Copied" : "Copy"}</span>
              {!copiedCode && (
                <span className="material-symbols-outlined text-[18px] text-actionDark">content_copy</span>
              )}
            </button>
          </div>
          <p className="mt-2 font-dmsans text-[11px] text-gray-400">
            Code expires in 48 hours
          </p>
        </div>

        {/* ── Divider: or ── */}
        <div className="my-6 flex items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-gray-100" />
          <span className="font-dmsans text-[13px] text-gray-400">or</span>
          <div className="h-[1px] flex-1 bg-gray-100" />
        </div>

        {/* ── Section 2: Share via Link ── */}
        <div>
          <h2 className="font-dmsans text-[18px] font-bold text-actionDark">
            Share via Link
          </h2>

          {/* Yellow Dashed Card for Link */}
          <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-dashed border-actionYellow bg-offWhite p-4">
            <span className="font-dmsans text-[14px] text-actionDark truncate max-w-[200px] sm:max-w-[240px]">
              {vouchLink}
            </span>
            <button
              type="button"
              onClick={handleShareLink}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-actionYellow bg-amber-50/60 px-3.5 py-1.5 font-dmsans text-[13px] font-medium text-actionDark shadow-2xs transition-colors hover:bg-amber-100/60 active:bg-actionYellow/30"
            >
              <span>{copiedLink ? "Link Copied" : "Share"}</span>
              {!copiedLink && (
                <span className="material-symbols-outlined text-[18px] text-actionDark">share</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={onViewStatus}
          className="h-[54px] w-full rounded-[14px] bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90"
        >
          View Status
        </Button>
      </div>
    </div>
  );
}
