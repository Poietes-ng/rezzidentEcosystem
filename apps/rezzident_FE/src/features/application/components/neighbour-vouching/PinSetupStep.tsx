import React, { useState } from "react";
import { Button } from "#/shared/components/ui/button";
import { PinInput } from "#/shared/components/ui/pin-input";
import { Switch } from "#/shared/components/ui/switch";
import { cn } from "#/shared/utils/cn";

export interface PinSetupStepProps {
  currentStep: number;
  totalSteps: number;
  pin: string;
  confirmPin: string;
  faceIdEnabled: boolean;
  onPinChange: (val: string) => void;
  onConfirmPinChange: (val: string) => void;
  onFaceIdToggle: (enabled: boolean) => void;
  onComplete: () => void;
}

export function PinSetupStep({
  currentStep,
  totalSteps,
  pin,
  confirmPin,
  faceIdEnabled,
  onPinChange,
  onConfirmPinChange,
  onFaceIdToggle,
  onComplete,
}: PinSetupStepProps) {
  const [submitted, setSubmitted] = useState(false);

  const isPinComplete = pin.length === 4;
  const isConfirmComplete = confirmPin.length === 4;
  const isMatch = isPinComplete && isConfirmComplete && pin === confirmPin;
  
  // Show error if user submitted and they don't match, or if both are complete and don't match
  const hasMismatch = (submitted && !isMatch) || (isPinComplete && isConfirmComplete && pin !== confirmPin);

  const handlePinChange = (val: string) => {
    if (submitted) setSubmitted(false);
    onPinChange(val);
  };

  const handleConfirmPinChange = (val: string) => {
    if (submitted) setSubmitted(false);
    onConfirmPinChange(val);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitted(true);
    if (isMatch) {
      onComplete();
    }
  };

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[14px] font-semibold uppercase tracking-wider text-warmGray">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[32px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Create your PIN
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-warmGray">
          Set a 4-digit PIN for quick and secure access
        </p>

        {/* ── Form Inputs (Centered PIN slots) ── */}
        <div className="mt-8 space-y-8">
          {/* Enter PIN */}
          <div className="flex flex-col items-center">
            <label className="font-dmsans text-[13px] font-medium text-warmGray mb-2">
              Enter PIN
            </label>
            <PinInput
              length={4}
              value={pin}
              onChange={handlePinChange}
              variant="dot"
              error={hasMismatch}
              autoFocus
              className="gap-6"
            />
          </div>

          {/* Confirm PIN */}
          <div className="flex flex-col items-center">
            <label className="font-dmsans text-[13px] font-medium text-warmGray mb-2">
              Confirm PIN
            </label>
            <PinInput
              length={4}
              value={confirmPin}
              onChange={handleConfirmPinChange}
              variant="dot"
              error={hasMismatch}
              className="gap-6"
            />
          </div>

          {/* Enable Face ID Toggle Row */}
          <div className="mt-4 flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-actionDark">
                ar_on_you
              </span>
              <span className="font-dmsans text-[14px] font-medium text-actionDark">
                Enable Face ID
              </span>
            </div>

            <Switch
              checked={faceIdEnabled}
              onCheckedChange={onFaceIdToggle}
            />
          </div>

          {/* Error Message Placed Below Face ID row */}
          {hasMismatch && (
            <p className="font-dmsans text-[13px] font-normal text-errorRed text-center animate-in fade-in">
              PINs do not match. Please try again.
            </p>
          )}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={() => handleSubmit()}
          className={cn(
            "h-[56px] w-full rounded-[12px] text-[16px] font-medium text-white transition-colors duration-200",
            isMatch
              ? "bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed cursor-pointer"
              : "bg-stoneEdge hover:bg-stoneEdge active:bg-stoneEdge text-warmGray cursor-not-allowed"
          )}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
