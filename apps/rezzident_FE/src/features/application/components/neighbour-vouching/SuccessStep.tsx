import React from "react";
import { Button } from "#/shared/components/ui/button";

export interface SuccessStepProps {
  onSetupPin: () => void;
}

export function SuccessStep({ onSetupPin }: SuccessStepProps) {
  return (
    <div className="flex min-h-full w-full flex-col justify-between px-6 pb-8 pt-12 font-dmsans">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* ── Success Checkmark Icon Badge ── */}
        <div className="relative mb-8 flex items-center justify-center">
          <img
            src="/assets/Success_Circle.svg"
            alt="Success"
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* ── Heading & Subtitle ── */}
        <h1 className="font-dmsans text-[28px] font-bold text-actionDark sm:text-[32px]">
          Hurray you're verified!
        </h1>
        <p className="mt-3 max-w-[280px] font-dmsans text-[14px] leading-relaxed text-gray-500">
          Your neighbours have verified your residency. You can now set up your PIN for quick and secure access.
        </p>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="pt-6">
        <Button
          type="button"
          onClick={onSetupPin}
          className="h-[54px] w-full rounded-[14px] bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90"
        >
          Set Up PIN
        </Button>
      </div>
    </div>
  );
}
