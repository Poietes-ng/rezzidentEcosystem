import React from "react";
import { Button } from "#/shared/components/ui/button";

export interface SuccessStepProps {
  onSetupPin: () => void;
}

export function SuccessStep({ onSetupPin }: SuccessStepProps) {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center justify-center px-6 py-12 font-dmsans">
      <div className="flex w-full max-w-[340px] flex-col items-center text-center">
        {/* ── Success Checkmark Icon Badge ── */}
        <div className="relative mb-6 flex items-center justify-center">
          <img
            src="/assets/Success_Circle.svg"
            alt="Success"
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* ── Heading & Subtitle ── */}
        <h1 className="font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[30px]">
          Hurray you're verified!
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
          Your neighbours have confirmed your identity. Set up your PIN to complete your account and access the app.
        </p>

        {/* ── Centered CTA Button ── */}
        <div className="mt-8 w-full">
          <Button
            type="button"
            onClick={onSetupPin}
            className="h-[54px] w-full rounded-xl bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90 cursor-pointer"
          >
            Set Up PIN
          </Button>
        </div>
      </div>
    </div>
  );
}
